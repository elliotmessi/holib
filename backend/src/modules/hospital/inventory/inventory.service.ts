import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, DataSource } from 'typeorm'

import { BusinessException } from '~/common/exceptions/biz.exception'
import { ErrorEnum } from '~/constants/error-code.constant'

import { InventoryEntity } from './inventory.entity'
import {
  CreateInventoryDto,
  UpdateInventoryDto,
  InventoryQueryDto,
  AdjustInventoryDto,
} from './inventory.dto'
import {
  InventoryTransactionEntity,
  InventoryTransactionType,
} from '../inventory-transaction/inventory-transaction.entity'

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(InventoryEntity)
    private inventoryRepository: Repository<InventoryEntity>,
    @InjectRepository(InventoryTransactionEntity)
    private transactionRepository: Repository<InventoryTransactionEntity>,
    private dataSource: DataSource,
  ) {}

  async create(createDto: CreateInventoryDto): Promise<InventoryEntity> {
    const exist = await this.inventoryRepository.findOne({
      where: {
        drugId: createDto.drugId,
        pharmacyId: createDto.pharmacyId,
        batchNumber: createDto.batchNumber,
      },
    })
    if (exist) {
      throw new BusinessException(ErrorEnum.DATA_ALREADY_EXISTS)
    }

    const inventory = this.inventoryRepository.create({
      ...createDto,
      validFrom: new Date(createDto.validFrom),
      validTo: new Date(createDto.validTo),
    })
    return this.inventoryRepository.save(inventory)
  }

  async findAll(query: InventoryQueryDto): Promise<InventoryEntity[]> {
    const queryBuilder = this.inventoryRepository.createQueryBuilder('inventory')
    queryBuilder.leftJoinAndSelect('inventory.drug', 'drug')
    queryBuilder.leftJoinAndSelect('inventory.pharmacy', 'pharmacy')

    if (query.drugId) {
      queryBuilder.andWhere('inventory.drugId = :drugId', { drugId: query.drugId })
    }
    if (query.pharmacyId) {
      queryBuilder.andWhere('inventory.pharmacyId = :pharmacyId', { pharmacyId: query.pharmacyId })
    }
    if (query.batchNumber) {
      queryBuilder.andWhere('inventory.batchNumber LIKE :batchNumber', {
        batchNumber: `%${query.batchNumber}%`,
      })
    }
    if (query.unfrozenOnly) {
      queryBuilder.andWhere('inventory.isFrozen = :isFrozen', { isFrozen: false })
    }
    if (query.lowStockOnly) {
      queryBuilder.andWhere('inventory.quantity < inventory.minimumThreshold')
    }

    queryBuilder.orderBy('inventory.createdAt', 'DESC')
    return queryBuilder.getMany()
  }

  async findOne(id: number): Promise<InventoryEntity> {
    const inventory = await this.inventoryRepository.findOne({
      where: { id },
      relations: ['drug', 'pharmacy'],
    })
    if (!inventory) {
      throw new BusinessException(ErrorEnum.DATA_NOT_FOUND)
    }
    return inventory
  }

  async findByDrugAndPharmacy(drugId: number, pharmacyId: number): Promise<InventoryEntity[]> {
    return this.inventoryRepository.find({
      where: { drugId, pharmacyId },
      relations: ['drug', 'pharmacy'],
      order: { validTo: 'ASC' },
    })
  }

  async update(id: number, updateDto: UpdateInventoryDto): Promise<void> {
    const inventory = await this.findOne(id)

    if (
      updateDto.drugId !== inventory.drugId ||
      updateDto.pharmacyId !== inventory.pharmacyId ||
      updateDto.batchNumber !== inventory.batchNumber
    ) {
      const exist = await this.inventoryRepository.findOne({
        where: {
          drugId: updateDto.drugId || inventory.drugId,
          pharmacyId: updateDto.pharmacyId || inventory.pharmacyId,
          batchNumber: updateDto.batchNumber || inventory.batchNumber,
        },
      })
      if (exist) {
        throw new BusinessException(ErrorEnum.DATA_ALREADY_EXISTS)
      }
    }

    Object.assign(inventory, {
      ...updateDto,
      validFrom: updateDto.validFrom ? new Date(updateDto.validFrom) : inventory.validFrom,
      validTo: updateDto.validTo ? new Date(updateDto.validTo) : inventory.validTo,
    })
    await this.inventoryRepository.save(inventory)
  }

  async adjustQuantity(
    id: number,
    adjustDto: AdjustInventoryDto,
    userId: number,
  ): Promise<InventoryEntity> {
    const inventory = await this.findOne(id)
    const newQuantity = inventory.quantity + adjustDto.adjustment

    if (newQuantity < 0) {
      throw new BusinessException(ErrorEnum.INSUFFICIENT_INVENTORY)
    }

    await this.dataSource.transaction(async (manager) => {
      inventory.quantity = newQuantity
      await manager.save(inventory)

      const transaction = manager.create(InventoryTransactionEntity, {
        drugId: inventory.drugId,
        pharmacyId: inventory.pharmacyId,
        transactionType: InventoryTransactionType.ADJUSTMENT,
        quantity: Math.abs(adjustDto.adjustment),
        unitPrice: 0,
        totalAmount: 0,
        batchNumber: inventory.batchNumber,
        reason: adjustDto.reason,
        createdBy: userId,
      })
      await manager.save(transaction)
    })

    return inventory
  }

  async toggleFrozen(id: number, isFrozen: boolean): Promise<void> {
    const inventory = await this.findOne(id)
    inventory.isFrozen = isFrozen
    await this.inventoryRepository.save(inventory)
  }

  async remove(id: number): Promise<void> {
    const inventory = await this.findOne(id)
    if (inventory.quantity > 0) {
      throw new BusinessException(ErrorEnum.CANNOT_DELETE_WITH_INVENTORY)
    }
    await this.inventoryRepository.delete(id)
  }

  async getLowStock(): Promise<InventoryEntity[]> {
    return this.inventoryRepository
      .createQueryBuilder('inventory')
      .leftJoinAndSelect('inventory.drug', 'drug')
      .leftJoinAndSelect('inventory.pharmacy', 'pharmacy')
      .where('inventory.quantity < inventory.minimumThreshold')
      .andWhere('inventory.isFrozen = :isFrozen', { isFrozen: false })
      .orderBy('inventory.quantity', 'ASC')
      .getMany()
  }

  async getExpiringWithinDays(days: number): Promise<InventoryEntity[]> {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + days)

    return this.inventoryRepository
      .createQueryBuilder('inventory')
      .leftJoinAndSelect('inventory.drug', 'drug')
      .leftJoinAndSelect('inventory.pharmacy', 'pharmacy')
      .where('inventory.validTo <= :futureDate', { futureDate })
      .andWhere('inventory.quantity > 0')
      .orderBy('inventory.validTo', 'ASC')
      .getMany()
  }
}
