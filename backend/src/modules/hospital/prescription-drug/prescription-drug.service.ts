import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { BusinessException } from '~/common/exceptions/biz.exception'
import { ErrorEnum } from '~/constants/error-code.constant'

import { PrescriptionDrugEntity } from './prescription-drug.entity'
import {
  CreatePrescriptionDrugDto,
  UpdatePrescriptionDrugDto,
  PrescriptionDrugQueryDto,
} from './prescription-drug.dto'

@Injectable()
export class PrescriptionDrugService {
  constructor(
    @InjectRepository(PrescriptionDrugEntity)
    private prescriptionDrugRepository: Repository<PrescriptionDrugEntity>,
  ) {}

  async create(createDto: CreatePrescriptionDrugDto): Promise<PrescriptionDrugEntity> {
    const totalPrice = createDto.quantity * createDto.unitPrice

    const prescriptionDrug = this.prescriptionDrugRepository.create({
      ...createDto,
      totalPrice,
    })
    return this.prescriptionDrugRepository.save(prescriptionDrug)
  }

  async findAll(query: PrescriptionDrugQueryDto): Promise<PrescriptionDrugEntity[]> {
    const queryBuilder = this.prescriptionDrugRepository.createQueryBuilder('prescriptionDrug')
    queryBuilder.leftJoinAndSelect('prescriptionDrug.drug', 'drug')
    queryBuilder.leftJoinAndSelect('prescriptionDrug.prescription', 'prescription')

    if (query.prescriptionId) {
      queryBuilder.andWhere('prescriptionDrug.prescriptionId = :prescriptionId', {
        prescriptionId: query.prescriptionId,
      })
    }
    if (query.drugId) {
      queryBuilder.andWhere('prescriptionDrug.drugId = :drugId', { drugId: query.drugId })
    }

    queryBuilder.orderBy('prescriptionDrug.createdAt', 'DESC')
    return queryBuilder.getMany()
  }

  async findOne(id: number): Promise<PrescriptionDrugEntity> {
    const prescriptionDrug = await this.prescriptionDrugRepository.findOne({
      where: { id },
      relations: ['drug', 'prescription'],
    })
    if (!prescriptionDrug) {
      throw new BusinessException(ErrorEnum.DATA_NOT_FOUND)
    }
    return prescriptionDrug
  }

  async findByPrescriptionId(prescriptionId: number): Promise<PrescriptionDrugEntity[]> {
    return this.prescriptionDrugRepository.find({
      where: { prescriptionId },
      relations: ['drug'],
      order: { createdAt: 'ASC' },
    })
  }

  async update(id: number, updateDto: UpdatePrescriptionDrugDto): Promise<void> {
    const prescriptionDrug = await this.findOne(id)

    const totalPrice = updateDto.quantity * updateDto.unitPrice

    Object.assign(prescriptionDrug, {
      ...updateDto,
      totalPrice,
    })
    await this.prescriptionDrugRepository.save(prescriptionDrug)
  }

  async remove(id: number): Promise<void> {
    const prescriptionDrug = await this.findOne(id)
    await this.prescriptionDrugRepository.delete(id)
  }

  async calculateTotalAmount(prescriptionId: number): Promise<number> {
    const result = await this.prescriptionDrugRepository
      .createQueryBuilder('pd')
      .select('SUM(pd.totalPrice)', 'total')
      .where('pd.prescriptionId = :prescriptionId', { prescriptionId })
      .getRawOne()

    return parseFloat(result.total) || 0
  }
}
