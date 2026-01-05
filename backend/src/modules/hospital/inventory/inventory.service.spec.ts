import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
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
import { InventoryService } from './inventory.service'
import {
  InventoryTransactionEntity,
  InventoryTransactionType,
} from '../inventory-transaction/inventory-transaction.entity'

describe('InventoryService', () => {
  let service: InventoryService
  let inventoryRepository: jest.Mocked<Repository<InventoryEntity>>
  let transactionRepository: jest.Mocked<Repository<InventoryTransactionEntity>>
  let dataSource: jest.Mocked<DataSource>

  const mockInventoryEntity: Partial<InventoryEntity> = {
    id: 1,
    drugId: 1,
    pharmacyId: 1,
    batchNumber: 'BATCH001',
    quantity: 100,
    minimumThreshold: 10,
    maximumThreshold: 1000,
    storageLocation: 'A1货架',
    validFrom: new Date('2024-01-01'),
    validTo: new Date('2025-01-01'),
    isFrozen: false,
    drug: { id: 1, name: '阿司匹林' } as any,
    pharmacy: { id: 1, name: '西药房' } as any,
  }

  const mockInventoryTransactionEntity: Partial<InventoryTransactionEntity> = {
    id: 1,
    drugId: 1,
    pharmacyId: 1,
    transactionType: InventoryTransactionType.ADJUSTMENT,
    quantity: 10,
    unitPrice: 0,
    totalAmount: 0,
    batchNumber: 'BATCH001',
    reason: '库存调整',
    createdBy: 1,
  }

  const mockDataSource = {
    transaction: jest.fn().mockImplementation(async (callback) => {
      return callback({
        save: jest.fn().mockResolvedValue(mockInventoryEntity as InventoryEntity),
        create: jest
          .fn()
          .mockReturnValue(mockInventoryTransactionEntity as InventoryTransactionEntity),
      })
    }),
  }

  const mockInventoryRepository = {
    findOne: jest.fn(),
    create: jest.fn().mockReturnValue(mockInventoryEntity as InventoryEntity),
    save: jest.fn().mockResolvedValue(mockInventoryEntity as InventoryEntity),
    find: jest.fn().mockResolvedValue([mockInventoryEntity as InventoryEntity]),
    createQueryBuilder: jest.fn().mockReturnValue({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([mockInventoryEntity as InventoryEntity]),
      getManyAndCount: jest.fn().mockResolvedValue([[mockInventoryEntity as InventoryEntity], 1]),
    }),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
  }

  const mockTransactionRepository = {
    create: jest.fn().mockReturnValue(mockInventoryTransactionEntity as InventoryTransactionEntity),
    save: jest.fn().mockResolvedValue(mockInventoryTransactionEntity as InventoryTransactionEntity),
  }

  beforeEach(async () => {
    jest.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryService,
        {
          provide: getRepositoryToken(InventoryEntity),
          useValue: mockInventoryRepository,
        },
        {
          provide: getRepositoryToken(InventoryTransactionEntity),
          useValue: mockTransactionRepository,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile()

    service = module.get<InventoryService>(InventoryService)
    inventoryRepository = module.get(getRepositoryToken(InventoryEntity)) as jest.Mocked<
      Repository<InventoryEntity>
    >
    transactionRepository = module.get(
      getRepositoryToken(InventoryTransactionEntity),
    ) as jest.Mocked<Repository<InventoryTransactionEntity>>
    dataSource = module.get(DataSource) as jest.Mocked<DataSource>

    // 在获取service之后设置默认返回值
    inventoryRepository.findOne.mockResolvedValue(mockInventoryEntity as InventoryEntity)
  })

  describe('create', () => {
    it('should create a new inventory successfully', async () => {
      const createDto: CreateInventoryDto = {
        drugId: 1,
        pharmacyId: 1,
        batchNumber: 'BATCH001',
        quantity: 100,
        minimumThreshold: 10,
        maximumThreshold: 1000,
        storageLocation: 'A1货架',
        validFrom: '2024-01-01',
        validTo: '2025-01-01',
      }

      mockInventoryRepository.findOne.mockResolvedValue(undefined)

      const result = await service.create(createDto)

      expect(result).toBeDefined()
      expect(inventoryRepository.findOne).toHaveBeenCalledWith({
        where: {
          drugId: 1,
          pharmacyId: 1,
          batchNumber: 'BATCH001',
        },
      })
      expect(inventoryRepository.create).toHaveBeenCalled()
      expect(inventoryRepository.save).toHaveBeenCalled()
    })

    it('should throw error when inventory already exists', async () => {
      const createDto: CreateInventoryDto = {
        drugId: 1,
        pharmacyId: 1,
        batchNumber: 'BATCH001',
        quantity: 100,
        minimumThreshold: 10,
        maximumThreshold: 1000,
        validFrom: '2024-01-01',
        validTo: '2025-01-01',
      }

      mockInventoryRepository.findOne.mockResolvedValue(mockInventoryEntity as InventoryEntity)

      await expect(service.create(createDto)).rejects.toThrow(BusinessException)
      await expect(service.create(createDto)).rejects.toThrow('数据已存在')
    })
  })

  describe('findAll', () => {
    it('should return all inventories with relations', async () => {
      const query: InventoryQueryDto = {}

      const result = await service.findAll(query)

      expect(result).toBeDefined()
      expect(result).toHaveLength(1)
      expect(inventoryRepository.createQueryBuilder).toHaveBeenCalled()
    })

    it('should return filtered inventories by drugId', async () => {
      const query: InventoryQueryDto = {
        drugId: 1,
      }

      const result = await service.findAll(query)

      expect(result).toBeDefined()
      expect(inventoryRepository.createQueryBuilder).toHaveBeenCalled()
    })

    it('should return filtered inventories by pharmacyId', async () => {
      const query: InventoryQueryDto = {
        pharmacyId: 1,
      }

      const result = await service.findAll(query)

      expect(result).toBeDefined()
      expect(inventoryRepository.createQueryBuilder).toHaveBeenCalled()
    })

    it('should return filtered inventories by batchNumber', async () => {
      const query: InventoryQueryDto = {
        batchNumber: 'BATCH',
      }

      const result = await service.findAll(query)

      expect(result).toBeDefined()
      expect(inventoryRepository.createQueryBuilder).toHaveBeenCalled()
    })

    it('should return filtered inventories by unfrozenOnly', async () => {
      const query: InventoryQueryDto = {
        unfrozenOnly: true,
      }

      const result = await service.findAll(query)

      expect(result).toBeDefined()
      expect(inventoryRepository.createQueryBuilder).toHaveBeenCalled()
    })

    it('should return filtered inventories by lowStockOnly', async () => {
      const query: InventoryQueryDto = {
        lowStockOnly: true,
      }

      const result = await service.findAll(query)

      expect(result).toBeDefined()
      expect(inventoryRepository.createQueryBuilder).toHaveBeenCalled()
    })
  })

  describe('findOne', () => {
    it('should return inventory by id', async () => {
      const result = await service.findOne(1)

      expect(result).toBeDefined()
      expect(result.id).toBe(1)
      expect(inventoryRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['drug', 'pharmacy'],
      })
    })

    it('should throw error when inventory not found', async () => {
      mockInventoryRepository.findOne.mockResolvedValue(undefined)

      await expect(service.findOne(999)).rejects.toThrow(BusinessException)
      await expect(service.findOne(999)).rejects.toThrow('数据不存在')
    })
  })

  describe('findByDrugAndPharmacy', () => {
    it('should return inventories by drugId and pharmacyId', async () => {
      const result = await service.findByDrugAndPharmacy(1, 1)

      expect(result).toBeDefined()
      expect(result).toHaveLength(1)
      expect(inventoryRepository.find).toHaveBeenCalled()
    })
  })

  describe('update', () => {
    it('should update inventory successfully', async () => {
      const updateDto: UpdateInventoryDto = {
        drugId: 1,
        pharmacyId: 1,
        batchNumber: 'BATCH001',
        quantity: 200,
        minimumThreshold: 20,
        maximumThreshold: 2000,
        storageLocation: 'A2货架',
        validFrom: '2024-01-01',
        validTo: '2025-01-01',
        isFrozen: false,
      }

      await service.update(1, updateDto)

      expect(inventoryRepository.findOne).toHaveBeenCalled()
      expect(inventoryRepository.save).toHaveBeenCalled()
    })

    it('should throw error when updating non-existent inventory', async () => {
      mockInventoryRepository.findOne.mockResolvedValue(undefined)

      const updateDto: UpdateInventoryDto = {
        drugId: 1,
        pharmacyId: 1,
        batchNumber: 'BATCH001',
        quantity: 200,
        validFrom: '2024-01-01',
        validTo: '2025-01-01',
      }

      await expect(service.update(999, updateDto)).rejects.toThrow(BusinessException)
      await expect(service.update(999, updateDto)).rejects.toThrow('数据不存在')
    })

    it('should throw error when inventory already exists with same drugId, pharmacyId and batchNumber', async () => {
      const updateDto: UpdateInventoryDto = {
        drugId: 2,
        pharmacyId: 2,
        batchNumber: 'BATCH002',
        quantity: 100,
        validFrom: '2024-01-01',
        validTo: '2025-01-01',
      }

      const existingInventory = {
        ...mockInventoryEntity,
        id: 2,
      } as InventoryEntity

      mockInventoryRepository.findOne
        .mockResolvedValueOnce(mockInventoryEntity as InventoryEntity)
        .mockResolvedValueOnce(existingInventory)

      await expect(service.update(1, updateDto)).rejects.toThrow(BusinessException)
      await expect(service.update(1, updateDto)).rejects.toThrow('数据已存在')
    })
  })

  describe('adjustQuantity', () => {
    it('should adjust inventory quantity successfully with transaction', async () => {
      const adjustDto: AdjustInventoryDto = {
        adjustment: 50,
        reason: '库存调整',
      }

      const result = await service.adjustQuantity(1, adjustDto, 1)

      expect(result).toBeDefined()
      expect(dataSource.transaction).toHaveBeenCalled()
      expect(inventoryRepository.findOne).toHaveBeenCalled()
    })

    it('should throw error when adjusting quantity would result in negative inventory', async () => {
      const adjustDto: AdjustInventoryDto = {
        adjustment: -200,
        reason: '库存调整',
      }

      // 设置当前库存为100，调整-200会导致负库存
      const mockInventoryWithPositiveQuantity = {
        ...mockInventoryEntity,
        quantity: 100,
      } as InventoryEntity
      inventoryRepository.findOne.mockResolvedValue(mockInventoryWithPositiveQuantity)

      await expect(service.adjustQuantity(1, adjustDto, 1)).rejects.toThrow(BusinessException)
      await expect(service.adjustQuantity(1, adjustDto, 1)).rejects.toThrow('库存不足')
    })

    it('should throw error when adjusting quantity for non-existent inventory', async () => {
      mockInventoryRepository.findOne.mockResolvedValue(undefined)

      const adjustDto: AdjustInventoryDto = {
        adjustment: 50,
        reason: '库存调整',
      }

      await expect(service.adjustQuantity(999, adjustDto, 1)).rejects.toThrow(BusinessException)
      await expect(service.adjustQuantity(999, adjustDto, 1)).rejects.toThrow('数据不存在')
    })
  })

  describe('toggleFrozen', () => {
    it('should freeze inventory successfully', async () => {
      await service.toggleFrozen(1, true)

      expect(inventoryRepository.findOne).toHaveBeenCalled()
      expect(inventoryRepository.save).toHaveBeenCalled()
    })

    it('should unfreeze inventory successfully', async () => {
      await service.toggleFrozen(1, false)

      expect(inventoryRepository.findOne).toHaveBeenCalled()
      expect(inventoryRepository.save).toHaveBeenCalled()
    })

    it('should throw error when toggling frozen for non-existent inventory', async () => {
      mockInventoryRepository.findOne.mockResolvedValue(undefined)

      await expect(service.toggleFrozen(999, true)).rejects.toThrow(BusinessException)
      await expect(service.toggleFrozen(999, true)).rejects.toThrow('数据不存在')
    })
  })

  describe('remove', () => {
    it('should delete inventory successfully when quantity is zero', async () => {
      const zeroInventory = {
        ...mockInventoryEntity,
        quantity: 0,
      } as InventoryEntity
      mockInventoryRepository.findOne.mockResolvedValue(zeroInventory)

      await service.remove(1)

      expect(inventoryRepository.findOne).toHaveBeenCalled()
      expect(inventoryRepository.delete).toHaveBeenCalled()
    })

    it('should throw error when deleting inventory with positive quantity', async () => {
      const positiveInventory = {
        ...mockInventoryEntity,
        quantity: 100,
      } as InventoryEntity
      mockInventoryRepository.findOne.mockResolvedValue(positiveInventory)

      await expect(service.remove(1)).rejects.toThrow(BusinessException)
      await expect(service.remove(1)).rejects.toThrow('存在库存，无法删除')
    })

    it('should throw error when deleting non-existent inventory', async () => {
      mockInventoryRepository.findOne.mockResolvedValue(undefined)

      await expect(service.remove(999)).rejects.toThrow(BusinessException)
      await expect(service.remove(999)).rejects.toThrow('数据不存在')
    })
  })

  describe('getLowStock', () => {
    it('should return low stock inventories', async () => {
      const result = await service.getLowStock()

      expect(result).toBeDefined()
      expect(result).toHaveLength(1)
      expect(inventoryRepository.createQueryBuilder).toHaveBeenCalled()
    })
  })

  describe('getExpiringWithinDays', () => {
    it('should return expiring inventories within days', async () => {
      const result = await service.getExpiringWithinDays(30)

      expect(result).toBeDefined()
      expect(result).toHaveLength(1)
      expect(inventoryRepository.createQueryBuilder).toHaveBeenCalled()
    })
  })
})
