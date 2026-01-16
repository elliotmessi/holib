import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { BusinessException } from '~/common/exceptions/biz.exception'
import { ErrorEnum } from '~/constants/error-code.constant'

import { HospitalEntity } from './hospital.entity'
import { CreateHospitalDto, UpdateHospitalDto, HospitalQueryDto } from './hospital.dto'
import { HospitalService } from './hospital.service'

describe('HospitalService', () => {
  let service: HospitalService
  let hospitalRepository: Mocked<Repository<HospitalEntity>>

  const mockHospitalEntity: Partial<HospitalEntity> = {
    id: 1,
    hospitalCode: 'HOS001',
    name: '人民医院',
    level: '三级甲等',
    address: '北京市朝阳区',
    phone: '010-12345678',
    departments: [],
    pharmacies: [],
  }

  const mockHospitalWithDepartments: Partial<HospitalEntity> = {
    ...mockHospitalEntity,
    departments: [{ id: 1, name: '内科' } as any],
  }

  const mockHospitalWithPharmacies: Partial<HospitalEntity> = {
    ...mockHospitalEntity,
    pharmacies: [{ id: 1, name: '药房' } as any],
  }

  const mockHospitalRepository = {
    findOneBy: vi.fn().mockResolvedValue(undefined),
    create: vi.fn().mockReturnValue(mockHospitalEntity as HospitalEntity),
    save: vi.fn().mockResolvedValue(mockHospitalEntity as HospitalEntity),
    createQueryBuilder: vi.fn().mockReturnValue({
      andWhere: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnThis(),
      take: vi.fn().mockReturnThis(),
      skip: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      offset: vi.fn().mockReturnThis(),
      getMany: vi.fn().mockResolvedValue([mockHospitalEntity as HospitalEntity]),
      getManyAndCount: vi.fn().mockResolvedValue([[mockHospitalEntity as HospitalEntity], 1]),
    }),
    findOne: vi.fn().mockResolvedValue(mockHospitalEntity as HospitalEntity),
    delete: vi.fn().mockResolvedValue({ affected: 1 }),
  }

  beforeEach(async () => {
    vi.clearAllMocks()

    // Reset the mock functions to their default behavior
    mockHospitalRepository.findOne.mockResolvedValue(mockHospitalEntity as HospitalEntity)
    mockHospitalRepository.findOneBy.mockResolvedValue(undefined)

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HospitalService,
        {
          provide: getRepositoryToken(HospitalEntity),
          useValue: mockHospitalRepository,
        },
      ],
    }).compile()

    service = module.get<HospitalService>(HospitalService)
    hospitalRepository = module.get(getRepositoryToken(HospitalEntity)) as Mocked<
      Repository<HospitalEntity>
    >
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('should create a new hospital successfully', async () => {
      const createDto: CreateHospitalDto = {
        hospitalCode: 'HOS001',
        name: '人民医院',
        level: '三级甲等',
        address: '北京市朝阳区',
        phone: '010-12345678',
        contactPerson: '张三',
      }

      const result = await service.create(createDto)

      expect(result).toBeDefined()
      expect(result.id).toBe(1)
      expect(hospitalRepository.create).toHaveBeenCalled()
      expect(hospitalRepository.save).toHaveBeenCalled()
    })

    it('should throw error when hospital code already exists', async () => {
      const createDto: CreateHospitalDto = {
        hospitalCode: 'HOS001',
        name: '人民医院',
        level: '三级甲等',
        address: '北京市朝阳区',
        phone: '010-12345678',
        contactPerson: '张三',
      }

      hospitalRepository.findOneBy.mockResolvedValue(mockHospitalEntity as HospitalEntity)

      await expect(service.create(createDto)).rejects.toThrow(BusinessException)
      await expect(service.create(createDto)).rejects.toThrow('数据已存在')
    })
  })

  describe('findAll', () => {
    it('should return all hospitals', async () => {
      const query: HospitalQueryDto = {}

      const result = await service.findAll(query)

      expect(result).toBeDefined()
      expect(result.items).toHaveLength(1)
      expect(hospitalRepository.createQueryBuilder).toHaveBeenCalled()
    })

    it('should return filtered hospitals by name', async () => {
      const query: HospitalQueryDto = {
        name: '人民医院',
      }

      const result = await service.findAll(query)

      expect(result).toBeDefined()
      expect(hospitalRepository.createQueryBuilder).toHaveBeenCalled()
    })

    it('should return filtered hospitals by hospitalCode', async () => {
      const query: HospitalQueryDto = {
        hospitalCode: 'HOS001',
      }

      const result = await service.findAll(query)

      expect(result).toBeDefined()
      expect(hospitalRepository.createQueryBuilder).toHaveBeenCalled()
    })

    it('should return filtered hospitals by level', async () => {
      const query: HospitalQueryDto = {
        level: '三级甲等',
      }

      const result = await service.findAll(query)

      expect(result).toBeDefined()
      expect(hospitalRepository.createQueryBuilder).toHaveBeenCalled()
    })
  })

  describe('findOne', () => {
    it('should return hospital by id with relations', async () => {
      const result = await service.findOne(1)

      expect(result).toBeDefined()
      expect(result.id).toBe(1)
      expect(result.departments).toBeDefined()
      expect(result.pharmacies).toBeDefined()
      expect(hospitalRepository.findOne).toHaveBeenCalled()
    })

    it('should throw error when hospital not found', async () => {
      hospitalRepository.findOne.mockResolvedValue(undefined)

      await expect(service.findOne(999)).rejects.toThrow(BusinessException)
      await expect(service.findOne(999)).rejects.toThrow('数据不存在')
    })
  })

  describe('update', () => {
    it('should update hospital successfully', async () => {
      const updateDto: UpdateHospitalDto = {
        hospitalCode: 'HOS001',
        name: '人民医院（更新）',
        level: '三级甲等',
        address: '北京市朝阳区',
        phone: '010-87654321',
        contactPerson: '张三',
      }

      await service.update(1, updateDto)

      expect(hospitalRepository.findOne).toHaveBeenCalled()
      expect(hospitalRepository.save).toHaveBeenCalled()
    })

    it('should throw error when updating non-existent hospital', async () => {
      hospitalRepository.findOne.mockResolvedValue(undefined)

      const updateDto: UpdateHospitalDto = {
        hospitalCode: 'HOS001',
        name: '人民医院（更新）',
        level: '三级甲等',
        address: '北京市朝阳区',
        phone: '010-87654321',
        contactPerson: '张三',
      }

      await expect(service.update(999, updateDto)).rejects.toThrow(BusinessException)
      await expect(service.update(999, updateDto)).rejects.toThrow('数据不存在')
    })

    it('should throw error when hospital code already exists', async () => {
      const updateDto: UpdateHospitalDto = {
        hospitalCode: 'HOS002',
        name: '人民医院（更新）',
        level: '三级甲等',
        address: '北京市朝阳区',
        phone: '010-87654321',
        contactPerson: '张三',
      }

      // Mock existing hospital with the new hospital code
      hospitalRepository.findOne.mockResolvedValue(mockHospitalEntity as HospitalEntity)
      hospitalRepository.findOneBy.mockResolvedValue(mockHospitalEntity as HospitalEntity)

      await expect(service.update(1, updateDto)).rejects.toThrow(BusinessException)
      await expect(service.update(1, updateDto)).rejects.toThrow('数据已存在')
    })

    it('should update hospital without changing hospitalCode', async () => {
      const updateDto: UpdateHospitalDto = {
        hospitalCode: 'HOS001',
        name: '人民医院（更新）',
        level: '三级甲等',
        address: '北京市朝阳区',
        phone: '010-87654321',
        contactPerson: '张三',
      }

      hospitalRepository.findOne.mockResolvedValue(mockHospitalEntity as HospitalEntity)
      hospitalRepository.findOneBy.mockResolvedValue(undefined)

      await service.update(1, updateDto)

      expect(hospitalRepository.findOne).toHaveBeenCalled()
      expect(hospitalRepository.save).toHaveBeenCalled()
    })
  })

  describe('remove', () => {
    it('should delete hospital successfully', async () => {
      await service.remove(1)

      expect(hospitalRepository.findOne).toHaveBeenCalled()
      expect(hospitalRepository.delete).toHaveBeenCalled()
    })

    it('should throw error when deleting non-existent hospital', async () => {
      hospitalRepository.findOne.mockResolvedValue(undefined)

      await expect(service.remove(999)).rejects.toThrow(BusinessException)
      await expect(service.remove(999)).rejects.toThrow('数据不存在')
    })

    it('should throw error when hospital has departments', async () => {
      hospitalRepository.findOne.mockResolvedValue(mockHospitalWithDepartments as HospitalEntity)

      await expect(service.remove(1)).rejects.toThrow(BusinessException)
      await expect(service.remove(1)).rejects.toThrow('数据存在关联子项，无法删除')
    })

    it('should throw error when hospital has pharmacies', async () => {
      hospitalRepository.findOne.mockResolvedValue(mockHospitalWithPharmacies as HospitalEntity)

      await expect(service.remove(1)).rejects.toThrow(BusinessException)
      await expect(service.remove(1)).rejects.toThrow('数据存在关联子项，无法删除')
    })
  })
})
