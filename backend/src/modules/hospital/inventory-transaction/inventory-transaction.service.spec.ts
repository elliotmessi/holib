import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { BusinessException } from '~/common/exceptions/biz.exception'
import { ErrorEnum } from '~/constants/error-code.constant'

import {
  InventoryTransactionEntity,
  InventoryTransactionType,
} from './inventory-transaction.entity'
import {
  CreateInventoryTransactionDto,
  InventoryTransactionQueryDto,
} from './inventory-transaction.dto'
import { InventoryTransactionService } from './inventory-transaction.service'

describe('InventoryTransactionService', () => {
  let service: InventoryTransactionService
  let transactionRepository: Mocked<Repository<InventoryTransactionEntity>>

  const mockTransactionEntity: Partial<InventoryTransactionEntity> = {
    id: 1,
    drugId: 1,
    pharmacyId: 1,
    transactionType: InventoryTransactionType.ADJUSTMENT,
    quantity: 10,
    unitPrice: 10.5,
    totalAmount: 105,
    batchNumber: 'BATCH001',
    reason: '库存调整',
    referenceId: 1,
    referenceType: 'prescription',
    createdBy: 1,
    drug: { id: 1, name: '阿司匹林' } as any,
    pharmacy: { id: 1, name: '西药房' } as any,
  }

  const mockTransactionRepository = {
    findOne: vi.fn(),
    create: vi.fn().mockReturnValue(mockTransactionEntity as InventoryTransactionEntity),
    save: vi.fn().mockResolvedValue(mockTransactionEntity as InventoryTransactionEntity),
    find: vi.fn().mockResolvedValue([mockTransactionEntity as InventoryTransactionEntity]),
    createQueryBuilder: vi.fn().mockReturnValue({
      leftJoinAndSelect: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      andWhere: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      addSelect: vi.fn().mockReturnThis(),
      groupBy: vi.fn().mockReturnThis(),
      getMany: vi.fn().mockResolvedValue([mockTransactionEntity as InventoryTransactionEntity]),
      getRawMany: vi.fn().mockResolvedValue([
        {
          type: InventoryTransactionType.ADJUSTMENT,
          totalQuantity: 10,
          totalAmount: 105,
        },
      ]),
    }),
  }

  beforeEach(async () => {
    vi.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryTransactionService,
        {
          provide: getRepositoryToken(InventoryTransactionEntity),
          useValue: mockTransactionRepository,
        },
      ],
    }).compile()

    service = module.get<InventoryTransactionService>(InventoryTransactionService)
    transactionRepository = module.get(getRepositoryToken(InventoryTransactionEntity)) as Mocked<
      Repository<InventoryTransactionEntity>
    >

    // 设置默认返回值
    transactionRepository.findOne.mockResolvedValue(
      mockTransactionEntity as InventoryTransactionEntity,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('should create a new inventory transaction successfully', async () => {
      const createDto: CreateInventoryTransactionDto = {
        drugId: 1,
        pharmacyId: 1,
        transactionType: InventoryTransactionType.ADJUSTMENT,
        quantity: 10,
        unitPrice: 10.5,
        totalAmount: 105,
        batchNumber: 'BATCH001',
        reason: '库存调整',
        referenceId: 1,
        referenceType: 'prescription',
      }

      const result = await service.create(createDto, 1)

      expect(result).toBeDefined()
      expect(transactionRepository.create).toHaveBeenCalled()
      expect(transactionRepository.save).toHaveBeenCalled()
      expect(result.id).toBe(1)
    })
  })

  describe('findAll', () => {
    it('should return all inventory transactions with relations', async () => {
      const query: InventoryTransactionQueryDto = {}

      const result = await service.findAll(query)

      expect(result).toBeDefined()
      expect(result).toHaveLength(1)
      expect(transactionRepository.createQueryBuilder).toHaveBeenCalled()
    })

    it('should return filtered inventory transactions by drugId', async () => {
      const query: InventoryTransactionQueryDto = {
        drugId: 1,
      }

      const result = await service.findAll(query)

      expect(result).toBeDefined()
      expect(transactionRepository.createQueryBuilder).toHaveBeenCalled()
    })

    it('should return filtered inventory transactions by pharmacyId', async () => {
      const query: InventoryTransactionQueryDto = {
        pharmacyId: 1,
      }

      const result = await service.findAll(query)

      expect(result).toBeDefined()
      expect(transactionRepository.createQueryBuilder).toHaveBeenCalled()
    })

    it('should return filtered inventory transactions by transactionType', async () => {
      const query: InventoryTransactionQueryDto = {
        transactionType: InventoryTransactionType.ADJUSTMENT,
      }

      const result = await service.findAll(query)

      expect(result).toBeDefined()
      expect(transactionRepository.createQueryBuilder).toHaveBeenCalled()
    })

    it('should return filtered inventory transactions by referenceId', async () => {
      const query: InventoryTransactionQueryDto = {
        referenceId: 1,
      }

      const result = await service.findAll(query)

      expect(result).toBeDefined()
      expect(transactionRepository.createQueryBuilder).toHaveBeenCalled()
    })

    it('should return filtered inventory transactions by date range', async () => {
      const query: InventoryTransactionQueryDto = {
        startDate: '2024-01-01',
        endDate: '2024-12-31',
      }

      const result = await service.findAll(query)

      expect(result).toBeDefined()
      expect(transactionRepository.createQueryBuilder).toHaveBeenCalled()
    })
  })

  describe('findOne', () => {
    it('should return inventory transaction by id', async () => {
      transactionRepository.findOne.mockResolvedValue(
        mockTransactionEntity as InventoryTransactionEntity,
      )

      const result = await service.findOne(1)

      expect(result).toBeDefined()
      expect(result.id).toBe(1)
      expect(transactionRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['drug', 'pharmacy'],
      })
    })

    it('should throw error when inventory transaction not found', async () => {
      transactionRepository.findOne.mockResolvedValue(undefined)

      await expect(service.findOne(999)).rejects.toThrow(BusinessException)
      await expect(service.findOne(999)).rejects.toThrow('数据不存在')
    })
  })

  describe('findByReferenceId', () => {
    it('should return inventory transactions by referenceId', async () => {
      const result = await service.findByReferenceId(1)

      expect(result).toBeDefined()
      expect(result).toHaveLength(1)
      expect(transactionRepository.createQueryBuilder).toHaveBeenCalled()
    })

    it('should return inventory transactions by referenceId and referenceType', async () => {
      const result = await service.findByReferenceId(1, 'prescription')

      expect(result).toBeDefined()
      expect(result).toHaveLength(1)
      expect(transactionRepository.createQueryBuilder).toHaveBeenCalled()
    })
  })

  describe('getTransactionStats', () => {
    it('should return transaction stats by date range', async () => {
      const result = await service.getTransactionStats('2024-01-01', '2024-12-31')

      expect(result).toBeDefined()
      expect(result).toHaveLength(1)
      expect(transactionRepository.createQueryBuilder).toHaveBeenCalled()
    })

    it('should return transaction stats by date range and pharmacyId', async () => {
      const result = await service.getTransactionStats('2024-01-01', '2024-12-31', 1)

      expect(result).toBeDefined()
      expect(result).toHaveLength(1)
      expect(transactionRepository.createQueryBuilder).toHaveBeenCalled()
    })
  })
})
