import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { BusinessException } from '~/common/exceptions/biz.exception'
import { ErrorEnum } from '~/constants/error-code.constant'

import { DrugEntity, DrugStatus } from './drug.entity'
import { CreateDrugDto, UpdateDrugDto, DrugQueryDto } from './drug.dto'
import { DrugService } from './drug.service'

describe('DrugService', () => {
  let service: DrugService
  let drugRepository: Mocked<Repository<DrugEntity>>

  const mockDrugEntity: Partial<DrugEntity> = {
    id: 1,
    drugCode: 'DRUG001',
    genericName: '阿莫西林胶囊',
    tradeName: '阿莫仙',
    specification: '0.25g*24粒',
    dosageForm: '胶囊剂',
    manufacturer: '华北制药股份有限公司',
    approvalNumber: '国药准字H13020683',
    drugType: '化学药品',
    validFrom: new Date('2023-01-01'),
    validTo: new Date('2025-12-31'),
    retailPrice: 25.5,
    wholesalePrice: 20.0,
    medicalInsuranceRate: 0.8,
    pharmacologicalClassId: 1,
    dosageClassId: 2,
    departmentClassId: 3,
    status: DrugStatus.NORMAL,
    pharmacologicalClass: { id: 1, name: '抗生素类' } as any,
    dosageClass: { id: 2, name: '胶囊剂' } as any,
    departmentClass: { id: 3, name: '内科' } as any,
  }

  const mockDrugRepository = {
    findOneBy: vi.fn().mockResolvedValue(undefined),
    create: vi.fn().mockReturnValue(mockDrugEntity as DrugEntity),
    save: vi.fn().mockResolvedValue(mockDrugEntity as DrugEntity),
    findOne: vi.fn().mockResolvedValue(mockDrugEntity as DrugEntity),
    createQueryBuilder: vi.fn().mockReturnValue({
      leftJoinAndSelect: vi.fn().mockReturnThis(),
      andWhere: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnThis(),
      getMany: vi.fn().mockResolvedValue([mockDrugEntity as DrugEntity]),
      getManyAndCount: vi.fn().mockResolvedValue([[mockDrugEntity as DrugEntity], 1]),
    }),
    update: vi.fn().mockResolvedValue({ affected: 1 }),
    delete: vi.fn().mockResolvedValue({ affected: 1 }),
  }

  beforeEach(async () => {
    vi.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DrugService,
        {
          provide: getRepositoryToken(DrugEntity),
          useValue: mockDrugRepository,
        },
      ],
    }).compile()

    service = module.get<DrugService>(DrugService)
    drugRepository = module.get(getRepositoryToken(DrugEntity)) as Mocked<Repository<DrugEntity>>

    drugRepository.findOne.mockResolvedValue(mockDrugEntity as DrugEntity)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('should create a new drug successfully', async () => {
      const createDto: CreateDrugDto = {
        drugCode: 'DRUG001',
        genericName: '阿莫西林胶囊',
        tradeName: '阿莫仙',
        specification: '0.25g*24粒',
        dosageForm: '胶囊剂',
        manufacturer: '华北制药股份有限公司',
        approvalNumber: '国药准字H13020683',
        drugType: '化学药品',
        validFrom: '2023-01-01',
        validTo: '2025-12-31',
        retailPrice: 25.5,
        wholesalePrice: 20.0,
        medicalInsuranceRate: 0.8,
        pharmacologicalClassId: 1,
        dosageClassId: 2,
        departmentClassId: 3,
      }

      const result = await service.create(createDto)

      expect(result).toBeDefined()
      expect(drugRepository.findOneBy).toHaveBeenCalledWith({ drugCode: 'DRUG001' })
      expect(drugRepository.create).toHaveBeenCalled()
      expect(drugRepository.save).toHaveBeenCalled()
      expect(result.id).toBe(1)
    })

    it('should throw error when drug code already exists', async () => {
      mockDrugRepository.findOneBy.mockResolvedValue(mockDrugEntity as DrugEntity)

      const createDto: CreateDrugDto = {
        drugCode: 'DRUG001',
        genericName: '阿莫西林胶囊',
        tradeName: '阿莫仙',
        specification: '0.25g*24粒',
        dosageForm: '胶囊剂',
        manufacturer: '华北制药股份有限公司',
        approvalNumber: '国药准字H13020683',
        drugType: '化学药品',
        validFrom: '2023-01-01',
        validTo: '2025-12-31',
        retailPrice: 25.5,
        wholesalePrice: 20.0,
      }

      await expect(service.create(createDto)).rejects.toThrow(BusinessException)
      await expect(service.create(createDto)).rejects.toThrow('数据已存在')
    })
  })

  describe('findAll', () => {
    it('should return all drugs with pagination', async () => {
      const query: DrugQueryDto = {}

      const result = await service.findAll(query)

      expect(result).toBeDefined()
      expect(result).toHaveLength(1)
      expect(drugRepository.createQueryBuilder).toHaveBeenCalled()
    })

    it('should return filtered drugs by name', async () => {
      const query: DrugQueryDto = {
        name: '阿莫西林',
      }

      const result = await service.findAll(query)

      expect(result).toBeDefined()
      expect(drugRepository.createQueryBuilder).toHaveBeenCalled()
    })

    it('should return filtered drugs by drugCode', async () => {
      const query: DrugQueryDto = {
        drugCode: 'DRUG001',
      }

      const result = await service.findAll(query)

      expect(result).toBeDefined()
      expect(drugRepository.createQueryBuilder).toHaveBeenCalled()
    })

    it('should return filtered drugs by status', async () => {
      const query: DrugQueryDto = {
        status: DrugStatus.NORMAL,
      }

      const result = await service.findAll(query)

      expect(result).toBeDefined()
      expect(drugRepository.createQueryBuilder).toHaveBeenCalled()
    })

    it('should return filtered drugs by drugType', async () => {
      const query: DrugQueryDto = {
        drugType: '化学药品',
      }

      const result = await service.findAll(query)

      expect(result).toBeDefined()
      expect(drugRepository.createQueryBuilder).toHaveBeenCalled()
    })

    it('should return filtered drugs by dosageForm', async () => {
      const query: DrugQueryDto = {
        dosageForm: '胶囊剂',
      }

      const result = await service.findAll(query)

      expect(result).toBeDefined()
      expect(drugRepository.createQueryBuilder).toHaveBeenCalled()
    })

    it('should return filtered drugs by manufacturer', async () => {
      const query: DrugQueryDto = {
        manufacturer: '华北制药',
      }

      const result = await service.findAll(query)

      expect(result).toBeDefined()
      expect(drugRepository.createQueryBuilder).toHaveBeenCalled()
    })

    it('should return filtered drugs by pharmacologicalClassId', async () => {
      const query: DrugQueryDto = {
        pharmacologicalClassId: 1,
      }

      const result = await service.findAll(query)

      expect(result).toBeDefined()
      expect(drugRepository.createQueryBuilder).toHaveBeenCalled()
    })

    it('should return drugs with combined filter conditions', async () => {
      const query: DrugQueryDto = {
        name: '阿莫西林',
        drugType: '化学药品',
        dosageForm: '胶囊剂',
        status: DrugStatus.NORMAL,
        pharmacologicalClassId: 1,
      }

      const result = await service.findAll(query)

      expect(result).toBeDefined()
      expect(drugRepository.createQueryBuilder).toHaveBeenCalled()
    })
  })

  describe('findOne', () => {
    it('should return drug when id exists', async () => {
      const result = await service.findOne(1)

      expect(result).toBeDefined()
      expect(result.id).toBe(1)
      expect(drugRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['pharmacologicalClass', 'dosageClass', 'departmentClass'],
      })
    })

    it('should throw error when drug not found', async () => {
      drugRepository.findOne.mockResolvedValue(undefined)

      await expect(service.findOne(999)).rejects.toThrow(BusinessException)
      await expect(service.findOne(999)).rejects.toThrow('数据不存在')
    })
  })

  describe('update', () => {
    it('should update drug successfully', async () => {
      const updateDto: UpdateDrugDto = {
        drugCode: 'DRUG001',
        genericName: '阿莫西林胶囊',
        tradeName: '阿莫仙',
        specification: '0.5g*12粒',
        dosageForm: '胶囊剂',
        manufacturer: '华北制药股份有限公司',
        approvalNumber: '国药准字H13020683',
        drugType: '化学药品',
        validFrom: '2023-01-01',
        validTo: '2025-12-31',
        retailPrice: 30.0,
        wholesalePrice: 24.0,
      }

      await service.update(1, updateDto)

      expect(drugRepository.findOne).toHaveBeenCalled()
      expect(drugRepository.save).toHaveBeenCalled()
    })

    it('should throw error when updating non-existent drug', async () => {
      drugRepository.findOne.mockResolvedValue(undefined)

      const updateDto: UpdateDrugDto = {
        drugCode: 'DRUG001',
        genericName: '阿莫西林胶囊',
        tradeName: '阿莫仙',
        specification: '0.5g*12粒',
        dosageForm: '胶囊剂',
        manufacturer: '华北制药股份有限公司',
        approvalNumber: '国药准字H13020683',
        drugType: '化学药品',
        validFrom: '2023-01-01',
        validTo: '2025-12-31',
        retailPrice: 30.0,
        wholesalePrice: 24.0,
      }

      await expect(service.update(999, updateDto)).rejects.toThrow(BusinessException)
      await expect(service.update(999, updateDto)).rejects.toThrow('数据不存在')
    })

    it('should throw error when drug code already exists', async () => {
      drugRepository.findOneBy.mockResolvedValue(mockDrugEntity as DrugEntity)

      const updateDto: UpdateDrugDto = {
        drugCode: 'DRUG002',
        genericName: '阿莫西林胶囊',
        tradeName: '阿莫仙',
        specification: '0.5g*12粒',
        dosageForm: '胶囊剂',
        manufacturer: '华北制药股份有限公司',
        approvalNumber: '国药准字H13020683',
        drugType: '化学药品',
        validFrom: '2023-01-01',
        validTo: '2025-12-31',
        retailPrice: 30.0,
        wholesalePrice: 24.0,
      }

      await expect(service.update(1, updateDto)).rejects.toThrow(BusinessException)
      await expect(service.update(1, updateDto)).rejects.toThrow('数据已存在')
    })
  })

  describe('updateStatus', () => {
    it('should update drug status successfully', async () => {
      await service.updateStatus(1, DrugStatus.STOPPED)

      expect(drugRepository.findOne).toHaveBeenCalled()
      expect(drugRepository.save).toHaveBeenCalled()
    })

    it('should throw error when updating status of non-existent drug', async () => {
      drugRepository.findOne.mockResolvedValue(undefined)

      await expect(service.updateStatus(999, DrugStatus.STOPPED)).rejects.toThrow(BusinessException)
      await expect(service.updateStatus(999, DrugStatus.STOPPED)).rejects.toThrow('数据不存在')
    })
  })

  describe('update with edge cases', () => {
    it('should update drug successfully without changing drugCode', async () => {
      drugRepository.findOneBy.mockResolvedValue(undefined)

      const updateDto: UpdateDrugDto = {
        genericName: '阿莫西林胶囊',
        tradeName: '阿莫仙',
        specification: '0.25g*24粒',
        dosageForm: '胶囊剂',
        manufacturer: '华北制药股份有限公司',
        approvalNumber: '国药准字H13020683',
        drugType: '化学药品',
        retailPrice: 28.0,
        wholesalePrice: 22.0,
      }

      await service.update(1, updateDto)

      expect(drugRepository.findOne).toHaveBeenCalled()
      expect(drugRepository.save).toHaveBeenCalled()
    })

    it('should update drug successfully without providing validFrom and validTo', async () => {
      drugRepository.findOneBy.mockResolvedValue(undefined)

      const updateDto: UpdateDrugDto = {
        drugCode: 'DRUG001',
        genericName: '阿莫西林胶囊',
        specification: '0.25g*24粒',
        retailPrice: 28.0,
        wholesalePrice: 22.0,
      }

      await service.update(1, updateDto)

      expect(drugRepository.findOne).toHaveBeenCalled()
      expect(drugRepository.save).toHaveBeenCalled()
    })
  })

  describe('remove', () => {
    it('should delete drug successfully', async () => {
      await service.remove(1)

      expect(drugRepository.findOne).toHaveBeenCalled()
      expect(drugRepository.delete).toHaveBeenCalled()
    })

    it('should throw error when deleting non-existent drug', async () => {
      drugRepository.findOne.mockResolvedValue(undefined)

      await expect(service.remove(999)).rejects.toThrow(BusinessException)
      await expect(service.remove(999)).rejects.toThrow('数据不存在')
    })
  })
})
