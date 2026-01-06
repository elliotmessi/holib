import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository, DataSource } from 'typeorm'
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
import { PrescriptionService } from './prescription.service'

// Mock nanoid
vi.mock('nanoid', () => ({
  nanoid: vi.fn().mockReturnValue('test1234'),
}))

describe('PrescriptionService', () => {
  let service: PrescriptionService
  let prescriptionRepository: Mocked<Repository<PrescriptionEntity>>
  let prescriptionDrugRepository: Mocked<Repository<PrescriptionDrugEntity>>
  let inventoryRepository: Mocked<Repository<InventoryEntity>>
  let transactionRepository: Mocked<Repository<InventoryTransactionEntity>>
  let dataSource: Mocked<DataSource>

  const mockPrescriptionEntity: Partial<PrescriptionEntity> = {
    id: 1,
    prescriptionNumber: 'PRES20260105test1234',
    patientId: 1,
    doctorId: 1,
    pharmacyId: 1,
    diagnosis: '上呼吸道感染',
    totalAmount: 100.0,
    status: PrescriptionStatus.PENDING_REVIEW,
    remark: '无特殊',
    patient: { id: 1, name: '李四' } as any,
    doctor: { id: 1, name: '张三' } as any,
    department: { id: 1, name: '内科' } as any,
    pharmacy: { id: 1, name: '药房' } as any,
  }

  const mockPrescriptionDrugEntity: Partial<PrescriptionDrugEntity> = {
    id: 1,
    prescriptionId: 1,
    drugId: 1,
    dosage: 0.5,
    dosageUnit: 'g',
    frequency: '3次/天',
    administrationRoute: '口服',
    duration: 7,
    quantity: 21,
    unitPrice: 5.0,
    totalPrice: 105.0,
    drug: { id: 1, name: '阿莫西林' } as any,
  }

  const mockInventoryEntity: Partial<InventoryEntity> = {
    id: 1,
    drugId: 1,
    pharmacyId: 1,
    batchNumber: 'BATCH001',
    quantity: 100,
  }

  const mockTransactionEntity: Partial<InventoryTransactionEntity> = {
    id: 1,
    drugId: 1,
    pharmacyId: 1,
    transactionType: InventoryTransactionType.OUTBOUND,
    quantity: 21,
    unitPrice: 5.0,
    totalAmount: 105.0,
    batchNumber: 'BATCH001',
    reason: '处方发药',
    referenceId: 1,
    referenceType: 'prescription',
    createdBy: 1,
  }

  const mockDataSource = {
    transaction: vi.fn().mockImplementation((callback) => {
      return callback({
        save: vi.fn().mockResolvedValue(mockPrescriptionEntity as PrescriptionEntity),
        create: vi.fn().mockReturnValue(mockPrescriptionEntity as PrescriptionEntity),
        findOne: vi.fn().mockResolvedValue(mockInventoryEntity as InventoryEntity),
      })
    }),
  }

  const mockPrescriptionRepository = {
    find: vi.fn().mockResolvedValue([mockPrescriptionEntity as PrescriptionEntity]),
    create: vi.fn().mockReturnValue(mockPrescriptionEntity as PrescriptionEntity),
    save: vi.fn().mockResolvedValue(mockPrescriptionEntity as PrescriptionEntity),
    createQueryBuilder: vi.fn().mockReturnValue({
      leftJoinAndSelect: vi.fn().mockReturnThis(),
      andWhere: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnThis(),
      getMany: vi.fn().mockResolvedValue([mockPrescriptionEntity as PrescriptionEntity]),
      select: vi.fn().mockReturnThis(),
      addSelect: vi.fn().mockReturnThis(),
      groupBy: vi.fn().mockReturnThis(),
      getRawMany: vi
        .fn()
        .mockResolvedValue([
          { status: PrescriptionStatus.PENDING_REVIEW, count: 1, totalAmount: '100.00' },
        ]),
    }),
    findOne: vi.fn().mockResolvedValue(mockPrescriptionEntity as PrescriptionEntity),
  }

  const mockPrescriptionDrugRepository = {
    find: vi.fn().mockResolvedValue([mockPrescriptionDrugEntity as PrescriptionDrugEntity]),
    create: vi.fn().mockReturnValue(mockPrescriptionDrugEntity as PrescriptionDrugEntity),
    save: vi.fn().mockResolvedValue(mockPrescriptionDrugEntity as PrescriptionDrugEntity),
  }

  const mockInventoryRepository = {
    findOne: vi.fn().mockResolvedValue(mockInventoryEntity as InventoryEntity),
  }

  const mockTransactionRepository = {
    save: vi.fn().mockResolvedValue(mockTransactionEntity as InventoryTransactionEntity),
  }

  beforeEach(async () => {
    vi.clearAllMocks()

    // Reset the mock functions to their default behavior
    mockPrescriptionRepository.findOne.mockResolvedValue(
      mockPrescriptionEntity as PrescriptionEntity,
    )
    mockPrescriptionRepository.find.mockResolvedValue([
      mockPrescriptionEntity as PrescriptionEntity,
    ])
    mockPrescriptionDrugRepository.find.mockResolvedValue([
      mockPrescriptionDrugEntity as PrescriptionDrugEntity,
    ])
    mockInventoryRepository.findOne.mockResolvedValue(mockInventoryEntity as InventoryEntity)

    // Mock transaction callback to handle different entities
    mockDataSource.transaction.mockImplementation((callback) => {
      const mockManager = {
        save: vi.fn().mockImplementation((entity: any) => {
          if (
            entity instanceof PrescriptionEntity ||
            entity.constructor.name === 'PrescriptionEntity'
          ) {
            return Promise.resolve({ ...mockPrescriptionEntity, id: 1 } as PrescriptionEntity)
          }
          if (
            entity instanceof PrescriptionDrugEntity ||
            entity.constructor.name === 'PrescriptionDrugEntity'
          ) {
            return Promise.resolve({
              ...mockPrescriptionDrugEntity,
              id: 1,
              prescriptionId: 1,
            } as PrescriptionDrugEntity)
          }
          if (entity instanceof InventoryEntity || entity.constructor.name === 'InventoryEntity') {
            return Promise.resolve({ ...mockInventoryEntity, quantity: 79 } as InventoryEntity)
          }
          if (
            entity instanceof InventoryTransactionEntity ||
            entity.constructor.name === 'InventoryTransactionEntity'
          ) {
            return Promise.resolve(mockTransactionEntity as InventoryTransactionEntity)
          }
          return Promise.resolve(entity)
        }),
        create: vi.fn().mockImplementation((entityType: any, data: any) => {
          if (entityType === PrescriptionDrugEntity) {
            return { ...mockPrescriptionDrugEntity, ...data } as PrescriptionDrugEntity
          }
          if (entityType === InventoryTransactionEntity) {
            return { ...mockTransactionEntity, ...data } as InventoryTransactionEntity
          }
          return data
        }),
        findOne: vi.fn().mockResolvedValue(mockInventoryEntity as InventoryEntity),
      }
      return callback(mockManager)
    })

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrescriptionService,
        {
          provide: getRepositoryToken(PrescriptionEntity),
          useValue: mockPrescriptionRepository,
        },
        {
          provide: getRepositoryToken(PrescriptionDrugEntity),
          useValue: mockPrescriptionDrugRepository,
        },
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

    service = module.get<PrescriptionService>(PrescriptionService)
    prescriptionRepository = module.get(getRepositoryToken(PrescriptionEntity)) as Mocked<
      Repository<PrescriptionEntity>
    >
    prescriptionDrugRepository = module.get(getRepositoryToken(PrescriptionDrugEntity)) as Mocked<
      Repository<PrescriptionDrugEntity>
    >
    inventoryRepository = module.get(getRepositoryToken(InventoryEntity)) as Mocked<
      Repository<InventoryEntity>
    >
    transactionRepository = module.get(getRepositoryToken(InventoryTransactionEntity)) as Mocked<
      Repository<InventoryTransactionEntity>
    >
    dataSource = module.get(DataSource) as Mocked<DataSource>
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('should create a new prescription successfully', async () => {
      const createDto: CreatePrescriptionDto = {
        patientId: 1,
        pharmacyId: 1,
        diagnosis: '上呼吸道感染',
        remark: '无特殊',
        prescriptionDrugs: [
          {
            drugId: 1,
            dosage: 0.5,
            dosageUnit: 'g',
            frequency: '3次/天',
            administrationRoute: '口服',
            duration: 7,
            quantity: 21,
            unitPrice: 5.0,
          },
        ],
      }

      const result = await service.create(createDto, 1)

      expect(result).toBeDefined()
      expect(result.id).toBe(1)
      expect(result.prescriptionNumber).toBe('PRES20260105test1234')
      expect(dataSource.transaction).toHaveBeenCalled()
    })

    it('should create a prescription with multiple drugs', async () => {
      const createDto: CreatePrescriptionDto = {
        patientId: 1,
        pharmacyId: 1,
        diagnosis: '上呼吸道感染',
        remark: '无特殊',
        prescriptionDrugs: [
          {
            drugId: 1,
            dosage: 0.5,
            dosageUnit: 'g',
            frequency: '3次/天',
            administrationRoute: '口服',
            duration: 7,
            quantity: 21,
            unitPrice: 5.0,
          },
          {
            drugId: 2,
            dosage: 10.0,
            dosageUnit: 'mg',
            frequency: '2次/天',
            administrationRoute: '口服',
            duration: 7,
            quantity: 14,
            unitPrice: 2.0,
          },
        ],
      }

      const result = await service.create(createDto, 1)

      expect(result).toBeDefined()
      expect(result.totalAmount).toBe(133.0) // 21*5 + 14*2 = 105 + 28 = 133
      expect(dataSource.transaction).toHaveBeenCalled()
    })
  })

  describe('findAll', () => {
    it('should return all prescriptions', async () => {
      const query: PrescriptionQueryDto = {}

      const result = await service.findAll(query)

      expect(result).toBeDefined()
      expect(result).toHaveLength(1)
      expect(prescriptionRepository.createQueryBuilder).toHaveBeenCalled()
    })

    it('should return filtered prescriptions by patientId', async () => {
      const query: PrescriptionQueryDto = {
        patientId: 1,
      }

      const result = await service.findAll(query)

      expect(result).toBeDefined()
      expect(prescriptionRepository.createQueryBuilder).toHaveBeenCalled()
    })

    it('should return filtered prescriptions by doctorId', async () => {
      const query: PrescriptionQueryDto = {
        doctorId: 1,
      }

      const result = await service.findAll(query)

      expect(result).toBeDefined()
      expect(prescriptionRepository.createQueryBuilder).toHaveBeenCalled()
    })

    it('should return filtered prescriptions by pharmacyId', async () => {
      const query: PrescriptionQueryDto = {
        pharmacyId: 1,
      }

      const result = await service.findAll(query)

      expect(result).toBeDefined()
      expect(prescriptionRepository.createQueryBuilder).toHaveBeenCalled()
    })

    it('should return filtered prescriptions by status', async () => {
      const query: PrescriptionQueryDto = {
        status: PrescriptionStatus.PENDING_REVIEW,
      }

      const result = await service.findAll(query)

      expect(result).toBeDefined()
      expect(prescriptionRepository.createQueryBuilder).toHaveBeenCalled()
    })

    it('should return filtered prescriptions by date range', async () => {
      const query: PrescriptionQueryDto = {
        startDate: '2026-01-01',
        endDate: '2026-01-31',
      }

      const result = await service.findAll(query)

      expect(result).toBeDefined()
      expect(prescriptionRepository.createQueryBuilder).toHaveBeenCalled()
    })
  })

  describe('findOne', () => {
    it('should return prescription by id with drugs', async () => {
      const result = await service.findOne(1)

      expect(result).toBeDefined()
      expect(result.id).toBe(1)
      expect(prescriptionRepository.findOne).toHaveBeenCalled()
      expect(prescriptionDrugRepository.find).toHaveBeenCalled()
    })

    it('should throw error when prescription not found', async () => {
      prescriptionRepository.findOne.mockResolvedValue(undefined)

      await expect(service.findOne(999)).rejects.toThrow(BusinessException)
      await expect(service.findOne(999)).rejects.toThrow('数据不存在')
    })
  })

  describe('review', () => {
    it('should review prescription successfully', async () => {
      const reviewDto: ReviewPrescriptionDto = {
        status: PrescriptionStatus.REVIEWED,
        reviewComments: '审核通过',
      }

      await service.review(1, reviewDto, 2)

      expect(prescriptionRepository.save).toHaveBeenCalled()
    })

    it('should reject prescription successfully', async () => {
      const reviewDto: ReviewPrescriptionDto = {
        status: PrescriptionStatus.REJECTED,
        reviewComments: '审核不通过',
      }

      await service.review(1, reviewDto, 2)

      expect(prescriptionRepository.save).toHaveBeenCalled()
    })

    it('should throw error when prescription already reviewed', async () => {
      const reviewDto: ReviewPrescriptionDto = {
        status: PrescriptionStatus.REVIEWED,
        reviewComments: '审核通过',
      }

      // Mock prescription with already reviewed status
      mockPrescriptionRepository.findOne.mockResolvedValue({
        ...mockPrescriptionEntity,
        status: PrescriptionStatus.REVIEWED,
      } as PrescriptionEntity)

      await expect(service.review(1, reviewDto, 2)).rejects.toThrow(BusinessException)
      await expect(service.review(1, reviewDto, 2)).rejects.toThrow('处方已审核')
    })

    it('should throw error when prescription not found', async () => {
      const reviewDto: ReviewPrescriptionDto = {
        status: PrescriptionStatus.REVIEWED,
        reviewComments: '审核通过',
      }

      prescriptionRepository.findOne.mockResolvedValue(undefined)

      await expect(service.review(999, reviewDto, 2)).rejects.toThrow(BusinessException)
      await expect(service.review(999, reviewDto, 2)).rejects.toThrow('数据不存在')
    })
  })

  describe('dispense', () => {
    it('should dispense prescription successfully', async () => {
      // Mock prescription with reviewed status
      mockPrescriptionRepository.findOne.mockResolvedValue({
        ...mockPrescriptionEntity,
        status: PrescriptionStatus.REVIEWED,
      } as PrescriptionEntity)

      await service.dispense(1)

      expect(dataSource.transaction).toHaveBeenCalled()
    })

    it('should throw error when prescription not approved', async () => {
      // Mock prescription with pending review status
      mockPrescriptionRepository.findOne.mockResolvedValue({
        ...mockPrescriptionEntity,
        status: PrescriptionStatus.PENDING_REVIEW,
      } as PrescriptionEntity)

      await expect(service.dispense(1)).rejects.toThrow(BusinessException)
      await expect(service.dispense(1)).rejects.toThrow('处方未审核通过')
    })

    it('should throw error when inventory is insufficient', async () => {
      // Mock prescription with reviewed status
      mockPrescriptionRepository.findOne.mockResolvedValue({
        ...mockPrescriptionEntity,
        status: PrescriptionStatus.REVIEWED,
      } as PrescriptionEntity)

      // Mock insufficient inventory
      mockInventoryRepository.findOne.mockResolvedValue({
        ...mockInventoryEntity,
        quantity: 10,
      } as InventoryEntity)

      // Update transaction mock to use insufficient inventory
      mockDataSource.transaction.mockImplementation((callback) => {
        const mockManager = {
          save: vi.fn(),
          create: vi.fn(),
          findOne: vi
            .fn()
            .mockResolvedValue({ ...mockInventoryEntity, quantity: 10 } as InventoryEntity),
        }
        return callback(mockManager)
      })

      await expect(service.dispense(1)).rejects.toThrow(BusinessException)
      await expect(service.dispense(1)).rejects.toThrow('库存不足')
    })

    it('should throw error when prescription not found', async () => {
      prescriptionRepository.findOne.mockResolvedValue(undefined)

      await expect(service.dispense(999)).rejects.toThrow(BusinessException)
      await expect(service.dispense(999)).rejects.toThrow('数据不存在')
    })
  })

  describe('cancel', () => {
    it('should cancel pending review prescription successfully', async () => {
      // Mock prescription with pending review status
      mockPrescriptionRepository.findOne.mockResolvedValue({
        ...mockPrescriptionEntity,
        status: PrescriptionStatus.PENDING_REVIEW,
      } as PrescriptionEntity)

      await service.cancel(1, '患者要求取消')

      expect(prescriptionRepository.save).toHaveBeenCalled()
    })

    it('should cancel reviewed prescription successfully', async () => {
      // Mock prescription with reviewed status
      mockPrescriptionRepository.findOne.mockResolvedValue({
        ...mockPrescriptionEntity,
        status: PrescriptionStatus.REVIEWED,
      } as PrescriptionEntity)

      await service.cancel(1, '医生要求取消')

      expect(prescriptionRepository.save).toHaveBeenCalled()
    })

    it('should throw error when trying to cancel dispensed prescription', async () => {
      // Mock prescription with dispensed status
      mockPrescriptionRepository.findOne.mockResolvedValue({
        ...mockPrescriptionEntity,
        status: PrescriptionStatus.DISPENSED,
      } as PrescriptionEntity)

      await expect(service.cancel(1, '想取消已发药处方')).rejects.toThrow(BusinessException)
      await expect(service.cancel(1, '想取消已发药处方')).rejects.toThrow('已发药处方无法取消')
    })

    it('should throw error when prescription not found', async () => {
      prescriptionRepository.findOne.mockResolvedValue(undefined)

      await expect(service.cancel(999, '取消处方')).rejects.toThrow(BusinessException)
      await expect(service.cancel(999, '取消处方')).rejects.toThrow('数据不存在')
    })
  })

  describe('getPendingReview', () => {
    it('should return pending review prescriptions for a pharmacy', async () => {
      const result = await service.getPendingReview(1)

      expect(result).toBeDefined()
      expect(result).toHaveLength(1)
      expect(prescriptionRepository.find).toHaveBeenCalled()
    })
  })

  describe('getStats', () => {
    it('should return prescription stats', async () => {
      const startDate = '2026-01-01'
      const endDate = '2026-01-31'

      const result = await service.getStats(startDate, endDate)

      expect(result).toBeDefined()
      expect(result).toHaveLength(1)
      expect(prescriptionRepository.createQueryBuilder).toHaveBeenCalled()
    })

    it('should return prescription stats filtered by doctorId', async () => {
      const startDate = '2026-01-01'
      const endDate = '2026-01-31'
      const doctorId = 1

      const result = await service.getStats(startDate, endDate, doctorId)

      expect(result).toBeDefined()
      expect(prescriptionRepository.createQueryBuilder).toHaveBeenCalled()
    })
  })
})
