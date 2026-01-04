import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, DataSource, Between } from 'typeorm'
import { nanoid } from 'nanoid'

import { BusinessException } from '~/common/exceptions/biz.exception'
import { ErrorEnum } from '~/constants/error-code.constant'

import { PrescriptionEntity, PrescriptionStatus } from './prescription.entity'
import {
  CreatePrescriptionDto,
  ReviewPrescriptionDto,
  PrescriptionQueryDto,
} from './prescription.dto'
import { PrescriptionDrugEntity } from '../prescription-drug/prescription-drug.entity'
import { InventoryEntity } from '../inventory/inventory.entity'
import {
  InventoryTransactionEntity,
  InventoryTransactionType,
} from '../inventory-transaction/inventory-transaction.entity'

@Injectable()
export class PrescriptionService {
  constructor(
    @InjectRepository(PrescriptionEntity)
    private prescriptionRepository: Repository<PrescriptionEntity>,
    @InjectRepository(PrescriptionDrugEntity)
    private prescriptionDrugRepository: Repository<PrescriptionDrugEntity>,
    @InjectRepository(InventoryEntity)
    private inventoryRepository: Repository<InventoryEntity>,
    @InjectRepository(InventoryTransactionEntity)
    private transactionRepository: Repository<InventoryTransactionEntity>,
    private dataSource: DataSource,
  ) {}

  private generatePrescriptionNumber(): string {
    const date = new Date()
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '')
    const random = nanoid(8)
    return `PRES${dateStr}${random}`
  }

  async create(createDto: CreatePrescriptionDto, doctorId: number): Promise<PrescriptionEntity> {
    const prescriptionNumber = this.generatePrescriptionNumber()

    const prescription = this.prescriptionRepository.create({
      prescriptionNumber,
      patientId: createDto.patientId,
      doctorId,
      pharmacyId: createDto.pharmacyId,
      diagnosis: createDto.diagnosis,
      status: PrescriptionStatus.PENDING_REVIEW,
      remark: createDto.remark,
    })

    let totalAmount = 0
    const prescriptionDrugs: Partial<PrescriptionDrugEntity>[] = []

    for (const drugDto of createDto.prescriptionDrugs) {
      const totalPrice = drugDto.quantity * drugDto.unitPrice
      totalAmount += totalPrice

      prescriptionDrugs.push({
        drugId: drugDto.drugId,
        dosage: drugDto.dosage,
        dosageUnit: drugDto.dosageUnit,
        frequency: drugDto.frequency,
        administrationRoute: drugDto.administrationRoute,
        duration: drugDto.duration,
        quantity: drugDto.quantity,
        unitPrice: drugDto.unitPrice,
        totalPrice,
      })
    }

    prescription.totalAmount = totalAmount

    await this.dataSource.transaction(async (manager) => {
      await manager.save(prescription)

      for (const drugData of prescriptionDrugs) {
        const prescriptionDrug = manager.create(PrescriptionDrugEntity, {
          ...drugData,
          prescriptionId: prescription.id,
        })
        await manager.save(prescriptionDrug)
      }
    })

    return this.findOne(prescription.id!)
  }

  async findAll(query: PrescriptionQueryDto): Promise<PrescriptionEntity[]> {
    const queryBuilder = this.prescriptionRepository.createQueryBuilder('prescription')
    queryBuilder.leftJoinAndSelect('prescription.patient', 'patient')
    queryBuilder.leftJoinAndSelect('prescription.doctor', 'doctor')
    queryBuilder.leftJoinAndSelect('prescription.department', 'department')
    queryBuilder.leftJoinAndSelect('prescription.pharmacy', 'pharmacy')

    if (query.patientId) {
      queryBuilder.andWhere('prescription.patientId = :patientId', { patientId: query.patientId })
    }
    if (query.doctorId) {
      queryBuilder.andWhere('prescription.doctorId = :doctorId', { doctorId: query.doctorId })
    }
    if (query.pharmacyId) {
      queryBuilder.andWhere('prescription.pharmacyId = :pharmacyId', {
        pharmacyId: query.pharmacyId,
      })
    }
    if (query.status) {
      queryBuilder.andWhere('prescription.status = :status', { status: query.status })
    }
    if (query.startDate && query.endDate) {
      queryBuilder.andWhere('prescription.createdAt BETWEEN :startDate AND :endDate', {
        startDate: query.startDate,
        endDate: query.endDate,
      })
    }

    queryBuilder.orderBy('prescription.createdAt', 'DESC')
    return queryBuilder.getMany()
  }

  async findOne(id: number): Promise<PrescriptionEntity> {
    const prescription = await this.prescriptionRepository.findOne({
      where: { id },
      relations: ['patient', 'doctor', 'department', 'pharmacy'],
    })
    if (!prescription) {
      throw new BusinessException(ErrorEnum.DATA_NOT_FOUND)
    }

    const drugs = await this.prescriptionDrugRepository.find({
      where: { prescriptionId: id },
      relations: ['drug'],
    })

    return { ...prescription, prescriptionDrugs: drugs } as any
  }

  async review(id: number, reviewDto: ReviewPrescriptionDto, reviewerId: number): Promise<void> {
    const prescription = await this.findOne(id)

    if (prescription.status !== PrescriptionStatus.PENDING_REVIEW) {
      throw new BusinessException(ErrorEnum.PRESCRIPTION_ALREADY_REVIEWED)
    }

    prescription.status = reviewDto.status
    prescription.reviewComments = reviewDto.reviewComments
    prescription.reviewBy = reviewerId
    prescription.reviewTime = new Date()

    await this.prescriptionRepository.save(prescription)
  }

  async dispense(id: number): Promise<void> {
    const prescription = await this.findOne(id)

    if (prescription.status !== PrescriptionStatus.REVIEWED) {
      throw new BusinessException(ErrorEnum.PRESCRIPTION_NOT_APPROVED)
    }

    await this.dataSource.transaction(async (manager) => {
      const drugs = await this.prescriptionDrugRepository.find({
        where: { prescriptionId: id },
      })

      for (const drug of drugs) {
        const inventory = await manager.findOne(InventoryEntity, {
          where: { drugId: drug.drugId, pharmacyId: prescription.pharmacyId },
        })

        if (!inventory || inventory.quantity < drug.quantity) {
          throw new BusinessException(ErrorEnum.INSUFFICIENT_INVENTORY)
        }

        inventory.quantity -= drug.quantity
        await manager.save(inventory)

        const transaction = manager.create(InventoryTransactionEntity, {
          drugId: drug.drugId,
          pharmacyId: prescription.pharmacyId!,
          transactionType: InventoryTransactionType.OUTBOUND,
          quantity: drug.quantity,
          unitPrice: drug.unitPrice,
          totalAmount: drug.totalPrice,
          batchNumber: inventory.batchNumber,
          reason: '处方发药',
          referenceId: prescription.id,
          referenceType: 'prescription',
          createdBy: prescription.doctorId!,
        })
        await manager.save(transaction)
      }

      prescription.status = PrescriptionStatus.DISPENSED
      prescription.dispenseTime = new Date()
      await manager.save(prescription)
    })
  }

  async cancel(id: number, reason: string): Promise<void> {
    const prescription = await this.findOne(id)

    if (prescription.status === PrescriptionStatus.DISPENSED) {
      throw new BusinessException(ErrorEnum.CANNOT_CANCEL_DISPENSED_PRESCRIPTION)
    }

    prescription.status = PrescriptionStatus.CANCELLED
    prescription.remark = `取消原因: ${reason}`
    await this.prescriptionRepository.save(prescription)
  }

  async getPendingReview(pharmacyId: number): Promise<PrescriptionEntity[]> {
    return this.prescriptionRepository.find({
      where: {
        pharmacyId,
        status: PrescriptionStatus.PENDING_REVIEW,
      },
      relations: ['patient', 'doctor'],
      order: { createdAt: 'ASC' },
    })
  }

  async getStats(startDate: string, endDate: string, doctorId?: number): Promise<any> {
    const queryBuilder = this.prescriptionRepository
      .createQueryBuilder('prescription')
      .select('prescription.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .addSelect('SUM(prescription.totalAmount)', 'totalAmount')
      .where('prescription.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })

    if (doctorId) {
      queryBuilder.andWhere('prescription.doctorId = :doctorId', { doctorId })
    }

    queryBuilder.groupBy('prescription.status')
    return queryBuilder.getRawMany()
  }
}
