import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { BusinessException } from '~/common/exceptions/biz.exception'
import { ErrorEnum } from '~/constants/error-code.constant'

import { PharmacyEntity, PharmacyType } from './pharmacy.entity'
import { CreatePharmacyDto, UpdatePharmacyDto, PharmacyQueryDto } from './pharmacy.dto'
import { PharmacyService } from './pharmacy.service'

describe('PharmacyService', () => {
  let service: PharmacyService
  let pharmacyRepository: Mocked<Repository<PharmacyEntity>>

  const mockPharmacyEntity: Partial<PharmacyEntity> = {
    id: 1,
    pharmacyCode: 'PHARMA001',
    name: '西药房',
    hospitalId: 1,
    pharmacyType: PharmacyType.WESTERN_MEDICINE,
    departmentId: 2,
    floor: '1楼',
    contactPerson: '张三',
    phone: '13800138000',
    description: '医院西药房',
    hospital: { id: 1, name: '人民医院' } as any,
    department: { id: 2, name: '药剂科' } as any,
  }

  const mockPharmacyRepository = {
    findOneBy: vi.fn().mockResolvedValue(undefined),
    create: vi.fn().mockReturnValue(mockPharmacyEntity as PharmacyEntity),
    save: vi.fn().mockResolvedValue(mockPharmacyEntity as PharmacyEntity),
    findOne: vi.fn().mockResolvedValue(mockPharmacyEntity as PharmacyEntity),
    createQueryBuilder: vi.fn().mockReturnValue({
      leftJoinAndSelect: vi.fn().mockReturnThis(),
      andWhere: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnThis(),
      take: vi.fn().mockReturnThis(),
      skip: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      offset: vi.fn().mockReturnThis(),
      getMany: vi.fn().mockResolvedValue([mockPharmacyEntity as PharmacyEntity]),
      getManyAndCount: vi.fn().mockResolvedValue([[mockPharmacyEntity as PharmacyEntity], 1]),
    }),
    update: vi.fn().mockResolvedValue({ affected: 1 }),
    delete: vi.fn().mockResolvedValue({ affected: 1 }),
  }

  beforeEach(async () => {
    vi.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PharmacyService,
        {
          provide: getRepositoryToken(PharmacyEntity),
          useValue: mockPharmacyRepository,
        },
      ],
    }).compile()

    service = module.get<PharmacyService>(PharmacyService)
    pharmacyRepository = module.get(getRepositoryToken(PharmacyEntity)) as Mocked<
      Repository<PharmacyEntity>
    >

    // 设置默认返回值
    pharmacyRepository.findOne.mockResolvedValue(mockPharmacyEntity as PharmacyEntity)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('should create a new pharmacy successfully', async () => {
      const createDto: CreatePharmacyDto = {
        pharmacyCode: 'PHARMA001',
        name: '西药房',
        hospitalId: 1,
        pharmacyType: PharmacyType.WESTERN_MEDICINE,
        departmentId: 2,
        floor: '1楼',
        contactPerson: '张三',
        phone: '13800138000',
        description: '医院西药房',
      }

      const result = await service.create(createDto)

      expect(result).toBeDefined()
      expect(pharmacyRepository.findOneBy).toHaveBeenCalledWith({ pharmacyCode: 'PHARMA001' })
      expect(pharmacyRepository.create).toHaveBeenCalled()
      expect(pharmacyRepository.save).toHaveBeenCalled()
      expect(result.id).toBe(1)
    })

    it('should throw error when pharmacy code already exists', async () => {
      pharmacyRepository.findOneBy.mockResolvedValue(mockPharmacyEntity as PharmacyEntity)

      const createDto: CreatePharmacyDto = {
        pharmacyCode: 'PHARMA001',
        name: '西药房',
        hospitalId: 1,
        pharmacyType: PharmacyType.WESTERN_MEDICINE,
      }

      await expect(service.create(createDto)).rejects.toThrow(BusinessException)
      await expect(service.create(createDto)).rejects.toThrow('数据已存在')
    })
  })

  describe('findAll', () => {
    it('should return all pharmacies with pagination', async () => {
      const query: PharmacyQueryDto = {}

      const result = await service.findAll(query)

      expect(result).toBeDefined()
      expect(result.items).toHaveLength(1)
      expect(pharmacyRepository.createQueryBuilder).toHaveBeenCalled()
    })

    it('should return filtered pharmacies by name', async () => {
      const query: PharmacyQueryDto = {
        name: '西药',
      }

      const result = await service.findAll(query)

      expect(result).toBeDefined()
      expect(pharmacyRepository.createQueryBuilder).toHaveBeenCalled()
    })

    it('should return filtered pharmacies by pharmacyType', async () => {
      const query: PharmacyQueryDto = {
        pharmacyType: PharmacyType.WESTERN_MEDICINE,
      }

      const result = await service.findAll(query)

      expect(result).toBeDefined()
      expect(pharmacyRepository.createQueryBuilder).toHaveBeenCalled()
    })

    it('should return filtered pharmacies by hospitalId', async () => {
      const query: PharmacyQueryDto = {
        hospitalId: 1,
      }

      const result = await service.findAll(query)

      expect(result).toBeDefined()
      expect(pharmacyRepository.createQueryBuilder).toHaveBeenCalled()
    })

    it('should return filtered pharmacies by departmentId', async () => {
      const query: PharmacyQueryDto = {
        departmentId: 2,
      }

      const result = await service.findAll(query)

      expect(result).toBeDefined()
      expect(pharmacyRepository.createQueryBuilder).toHaveBeenCalled()
    })
  })

  describe('findOne', () => {
    it('should return pharmacy when id exists', async () => {
      const result = await service.findOne(1)

      expect(result).toBeDefined()
      expect(result.id).toBe(1)
      expect(pharmacyRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['hospital', 'department'],
      })
    })

    it('should throw error when pharmacy not found', async () => {
      pharmacyRepository.findOne.mockResolvedValue(undefined)

      await expect(service.findOne(999)).rejects.toThrow(BusinessException)
      await expect(service.findOne(999)).rejects.toThrow('数据不存在')
    })
  })

  describe('update', () => {
    it('should update pharmacy successfully', async () => {
      const updateDto: UpdatePharmacyDto = {
        pharmacyCode: 'PHARMA001',
        name: '西药房',
        hospitalId: 1,
        pharmacyType: PharmacyType.WESTERN_MEDICINE,
        departmentId: 2,
        floor: '2楼',
        contactPerson: '李四',
        phone: '13900139000',
        description: '医院西药房（更新）',
      }

      await service.update(1, updateDto)

      expect(pharmacyRepository.findOne).toHaveBeenCalled()
      expect(pharmacyRepository.save).toHaveBeenCalled()
    })

    it('should throw error when updating non-existent pharmacy', async () => {
      pharmacyRepository.findOne.mockResolvedValue(undefined)

      const updateDto: UpdatePharmacyDto = {
        pharmacyCode: 'PHARMA001',
        name: '西药房',
        hospitalId: 1,
        pharmacyType: PharmacyType.WESTERN_MEDICINE,
      }

      await expect(service.update(999, updateDto)).rejects.toThrow(BusinessException)
      await expect(service.update(999, updateDto)).rejects.toThrow('数据不存在')
    })

    it('should throw error when pharmacy code already exists', async () => {
      pharmacyRepository.findOneBy.mockResolvedValue(mockPharmacyEntity as PharmacyEntity)

      const updateDto: UpdatePharmacyDto = {
        pharmacyCode: 'PHARMA002',
        name: '西药房',
        hospitalId: 1,
        pharmacyType: PharmacyType.WESTERN_MEDICINE,
      }

      await expect(service.update(1, updateDto)).rejects.toThrow(BusinessException)
      await expect(service.update(1, updateDto)).rejects.toThrow('数据已存在')
    })
  })

  describe('remove', () => {
    it('should delete pharmacy successfully', async () => {
      await service.remove(1)

      expect(pharmacyRepository.findOne).toHaveBeenCalled()
      expect(pharmacyRepository.delete).toHaveBeenCalledWith(1)
    })

    it('should throw error when deleting non-existent pharmacy', async () => {
      pharmacyRepository.findOne.mockResolvedValue(undefined)

      await expect(service.remove(999)).rejects.toThrow(BusinessException)
      await expect(service.remove(999)).rejects.toThrow('数据不存在')
    })
  })
})
