import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository, Between } from "typeorm"

import { paginate } from "~/helper/paginate"
import { Pagination } from "~/helper/paginate/pagination"
import { BusinessException } from "~/common/exceptions/biz.exception"
import { ErrorEnum } from "~/constants/error-code.constant"

import { InventoryTransactionEntity, InventoryTransactionType } from "./inventory-transaction.entity"
import { CreateInventoryTransactionDto, InventoryTransactionQueryDto } from "./inventory-transaction.dto"

@Injectable()
export class InventoryTransactionService {
  constructor(
    @InjectRepository(InventoryTransactionEntity)
    private transactionRepository: Repository<InventoryTransactionEntity>
  ) {}

  async create(createDto: CreateInventoryTransactionDto, userId: number): Promise<InventoryTransactionEntity> {
    const transaction = this.transactionRepository.create({
      ...createDto,
      createdBy: userId,
    })
    return this.transactionRepository.save(transaction)
  }

  async findAll(query: InventoryTransactionQueryDto): Promise<Pagination<InventoryTransactionEntity>> {
    const queryBuilder = this.transactionRepository.createQueryBuilder("transaction")
    queryBuilder.leftJoinAndSelect("transaction.drug", "drug")
    queryBuilder.leftJoinAndSelect("transaction.pharmacy", "pharmacy")

    if (query.drugId) {
      queryBuilder.andWhere("transaction.drugId = :drugId", { drugId: query.drugId })
    }
    if (query.pharmacyId) {
      queryBuilder.andWhere("transaction.pharmacyId = :pharmacyId", {
        pharmacyId: query.pharmacyId,
      })
    }
    if (query.transactionType) {
      queryBuilder.andWhere("transaction.transactionType = :transactionType", {
        transactionType: query.transactionType,
      })
    }
    if (query.referenceId) {
      queryBuilder.andWhere("transaction.referenceId = :referenceId", {
        referenceId: query.referenceId,
      })
    }
    if (query.startDate && query.endDate) {
      queryBuilder.andWhere("transaction.createdAt BETWEEN :startDate AND :endDate", {
        startDate: query.startDate,
        endDate: query.endDate,
      })
    }

    queryBuilder.orderBy("transaction.createdAt", "DESC")
    return paginate<InventoryTransactionEntity>(queryBuilder, {
      page: query.page,
      pageSize: query.pageSize,
    })
  }

  async findOne(id: number): Promise<InventoryTransactionEntity> {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: ["drug", "pharmacy"],
    })
    if (!transaction) {
      throw new BusinessException(ErrorEnum.DATA_NOT_FOUND)
    }
    return transaction
  }

  async findByReferenceId(referenceId: number, referenceType?: string): Promise<InventoryTransactionEntity[]> {
    const queryBuilder = this.transactionRepository.createQueryBuilder("transaction")
    queryBuilder.where("transaction.referenceId = :referenceId", { referenceId })

    if (referenceType) {
      queryBuilder.andWhere("transaction.referenceType = :referenceType", { referenceType })
    }

    queryBuilder.orderBy("transaction.createdAt", "DESC")
    return queryBuilder.getMany()
  }

  async getTransactionStats(startDate: string, endDate: string, pharmacyId?: number): Promise<any> {
    const queryBuilder = this.transactionRepository
      .createQueryBuilder("transaction")
      .select("transaction.transactionType", "type")
      .addSelect("SUM(transaction.quantity)", "totalQuantity")
      .addSelect("SUM(transaction.totalAmount)", "totalAmount")
      .where("transaction.createdAt BETWEEN :startDate AND :endDate", {
        startDate,
        endDate,
      })

    if (pharmacyId) {
      queryBuilder.andWhere("transaction.pharmacyId = :pharmacyId", { pharmacyId })
    }

    queryBuilder.groupBy("transaction.transactionType")
    return queryBuilder.getRawMany()
  }
}
