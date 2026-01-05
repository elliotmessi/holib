import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { BusinessException } from '~/common/exceptions/biz.exception'
import { ErrorEnum } from '~/constants/error-code.constant'

import { PrescriptionDrugEntity } from './prescription-drug.entity'
import {
  CreatePrescriptionDrugDto,
  UpdatePrescriptionDrugDto,
  PrescriptionDrugQueryDto,
} from './prescription-drug.dto'
import { PrescriptionDrugService } from './prescription-drug.service'

describe('PrescriptionDrugService', () => {
  let service: PrescriptionDrugService
  let prescriptionDrugRepository: jest.Mocked<Repository<PrescriptionDrugEntity>>

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
    prescription: { id: 1, prescriptionNumber: 'PRES001' } as any,
  }

  const mockPrescriptionDrugRepository = {
    create: jest.fn().mockImplementation((data: any) => {
      return {
        ...mockPrescriptionDrugEntity,
        ...data,
        totalPrice: data.quantity * data.unitPrice,
      } as PrescriptionDrugEntity
    }),
    save: jest.fn().mockImplementation((entity: any) => {
      return Promise.resolve(entity)
    }),
    createQueryBuilder: jest.fn().mockReturnValue({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([mockPrescriptionDrugEntity as PrescriptionDrugEntity]),
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getRawOne: jest.fn().mockResolvedValue({ total: '105.00' }),
    }),
    findOne: jest.fn().mockResolvedValue(mockPrescriptionDrugEntity as PrescriptionDrugEntity),
    find: jest.fn().mockResolvedValue([mockPrescriptionDrugEntity as PrescriptionDrugEntity]),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
  }

  beforeEach(async () => {
    jest.clearAllMocks()

    // Reset the mock functions to their default behavior
    mockPrescriptionDrugRepository.findOne.mockResolvedValue(
      mockPrescriptionDrugEntity as PrescriptionDrugEntity,
    )
    mockPrescriptionDrugRepository.find.mockResolvedValue([
      mockPrescriptionDrugEntity as PrescriptionDrugEntity,
    ])

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrescriptionDrugService,
        {
          provide: getRepositoryToken(PrescriptionDrugEntity),
          useValue: mockPrescriptionDrugRepository,
        },
      ],
    }).compile()

    service = module.get<PrescriptionDrugService>(PrescriptionDrugService)
    prescriptionDrugRepository = module.get(
      getRepositoryToken(PrescriptionDrugEntity),
    ) as jest.Mocked<Repository<PrescriptionDrugEntity>>
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('should create a new prescription drug successfully', async () => {
      const createDto: CreatePrescriptionDrugDto = {
        prescriptionId: 1,
        drugId: 1,
        dosage: 0.5,
        dosageUnit: 'g',
        frequency: '3次/天',
        administrationRoute: '口服',
        duration: 7,
        quantity: 21,
        unitPrice: 5.0,
      }

      const result = await service.create(createDto)

      expect(result).toBeDefined()
      expect(result.id).toBe(1)
      expect(result.totalPrice).toBe(105.0)
      expect(prescriptionDrugRepository.create).toHaveBeenCalled()
      expect(prescriptionDrugRepository.save).toHaveBeenCalled()
    })

    it('should calculate total price correctly', async () => {
      const createDto: CreatePrescriptionDrugDto = {
        prescriptionId: 1,
        drugId: 1,
        dosage: 1.0,
        dosageUnit: 'mg',
        frequency: '2次/天',
        administrationRoute: '口服',
        duration: 5,
        quantity: 10,
        unitPrice: 2.5,
      }

      const result = await service.create(createDto)

      expect(result).toBeDefined()
      expect(result.totalPrice).toBe(25.0) // 10 * 2.5 = 25
    })
  })

  describe('findAll', () => {
    it('should return all prescription drugs', async () => {
      const query: PrescriptionDrugQueryDto = {}

      const result = await service.findAll(query)

      expect(result).toBeDefined()
      expect(result).toHaveLength(1)
      expect(prescriptionDrugRepository.createQueryBuilder).toHaveBeenCalled()
    })

    it('should return filtered prescription drugs by prescriptionId', async () => {
      const query: PrescriptionDrugQueryDto = {
        prescriptionId: 1,
      }

      const result = await service.findAll(query)

      expect(result).toBeDefined()
      expect(prescriptionDrugRepository.createQueryBuilder).toHaveBeenCalled()
    })

    it('should return filtered prescription drugs by drugId', async () => {
      const query: PrescriptionDrugQueryDto = {
        drugId: 1,
      }

      const result = await service.findAll(query)

      expect(result).toBeDefined()
      expect(prescriptionDrugRepository.createQueryBuilder).toHaveBeenCalled()
    })
  })

  describe('findOne', () => {
    it('should return prescription drug by id', async () => {
      const result = await service.findOne(1)

      expect(result).toBeDefined()
      expect(result.id).toBe(1)
      expect(result.drug).toBeDefined()
      expect(result.prescription).toBeDefined()
      expect(prescriptionDrugRepository.findOne).toHaveBeenCalled()
    })

    it('should throw error when prescription drug not found', async () => {
      prescriptionDrugRepository.findOne.mockResolvedValue(undefined)

      await expect(service.findOne(999)).rejects.toThrow(BusinessException)
      await expect(service.findOne(999)).rejects.toThrow('数据不存在')
    })
  })

  describe('findByPrescriptionId', () => {
    it('should return prescription drugs by prescriptionId', async () => {
      const result = await service.findByPrescriptionId(1)

      expect(result).toBeDefined()
      expect(result).toHaveLength(1)
      expect(result[0].prescriptionId).toBe(1)
      expect(prescriptionDrugRepository.find).toHaveBeenCalled()
    })

    it('should return empty array when no prescription drugs found', async () => {
      prescriptionDrugRepository.find.mockResolvedValue([])

      const result = await service.findByPrescriptionId(999)

      expect(result).toBeDefined()
      expect(result).toHaveLength(0)
      expect(prescriptionDrugRepository.find).toHaveBeenCalled()
    })
  })

  describe('update', () => {
    it('should update prescription drug successfully', async () => {
      const updateDto: UpdatePrescriptionDrugDto = {
        prescriptionId: 1,
        drugId: 1,
        dosage: 1.0,
        dosageUnit: 'g',
        frequency: '2次/天',
        administrationRoute: '口服',
        duration: 5,
        quantity: 10,
        unitPrice: 6.0,
      }

      await service.update(1, updateDto)

      expect(prescriptionDrugRepository.findOne).toHaveBeenCalled()
      expect(prescriptionDrugRepository.save).toHaveBeenCalled()
    })

    it('should recalculate total price when updating', async () => {
      const updateDto: UpdatePrescriptionDrugDto = {
        prescriptionId: 1,
        drugId: 1,
        dosage: 0.5,
        dosageUnit: 'g',
        frequency: '3次/天',
        administrationRoute: '口服',
        duration: 7,
        quantity: 30,
        unitPrice: 4.0,
      }

      // Mock the save method to check if totalPrice is recalculated
      const mockSave = jest.spyOn(mockPrescriptionDrugRepository, 'save')

      await service.update(1, updateDto)

      expect(prescriptionDrugRepository.findOne).toHaveBeenCalled()
      expect(mockSave).toHaveBeenCalled()
      // Check if the saved entity has the correct totalPrice (30 * 4.0 = 120)
      expect(mockSave).toHaveBeenCalledWith(expect.objectContaining({ totalPrice: 120.0 }))
    })

    it('should throw error when updating non-existent prescription drug', async () => {
      prescriptionDrugRepository.findOne.mockResolvedValue(undefined)

      const updateDto: UpdatePrescriptionDrugDto = {
        prescriptionId: 1,
        drugId: 1,
        dosage: 0.5,
        dosageUnit: 'g',
        frequency: '3次/天',
        administrationRoute: '口服',
        duration: 7,
        quantity: 30,
        unitPrice: 4.0,
      }

      await expect(service.update(999, updateDto)).rejects.toThrow(BusinessException)
      await expect(service.update(999, updateDto)).rejects.toThrow('数据不存在')
    })
  })

  describe('remove', () => {
    it('should delete prescription drug successfully', async () => {
      await service.remove(1)

      expect(prescriptionDrugRepository.findOne).toHaveBeenCalled()
      expect(prescriptionDrugRepository.delete).toHaveBeenCalled()
    })

    it('should throw error when deleting non-existent prescription drug', async () => {
      prescriptionDrugRepository.findOne.mockResolvedValue(undefined)

      await expect(service.remove(999)).rejects.toThrow(BusinessException)
      await expect(service.remove(999)).rejects.toThrow('数据不存在')
    })
  })

  describe('calculateTotalAmount', () => {
    it('should calculate total amount for a prescription', async () => {
      const result = await service.calculateTotalAmount(1)

      expect(result).toBe(105.0)
      expect(prescriptionDrugRepository.createQueryBuilder).toHaveBeenCalled()
    })

    it('should return 0 when no prescription drugs found', async () => {
      // Mock the query builder to return null total
      mockPrescriptionDrugRepository.createQueryBuilder.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({ total: null }),
      } as any)

      const result = await service.calculateTotalAmount(999)

      expect(result).toBe(0)
      expect(prescriptionDrugRepository.createQueryBuilder).toHaveBeenCalled()
    })
  })
})
