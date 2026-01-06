import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'

import { Like, Repository } from 'typeorm'

import { DictTypeEntity } from './dict-type.entity'
import { DictTypeService } from './dict-type.service'

describe('DictTypeService', () => {
  let service: DictTypeService
  let dictTypeRepository: Mocked<Repository<DictTypeEntity>>

  const mockDictTypeEntity: Partial<DictTypeEntity> = {
    id: 1,
    name: '药品类型',
    code: 'drug_type',
    status: 1,
    remark: '药品的类型分类',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const mockDictTypeRepository = {
    createQueryBuilder: vi.fn().mockReturnValue({
      where: vi.fn().mockReturnThis(),
      skip: vi.fn().mockReturnThis(),
      take: vi.fn().mockReturnThis(),
      getManyAndCount: vi.fn().mockResolvedValue([[mockDictTypeEntity], 1]),
    }),
    find: vi.fn().mockResolvedValue([mockDictTypeEntity]),
    count: vi.fn().mockResolvedValue(1),
    insert: vi.fn().mockResolvedValue(undefined),
    update: vi.fn().mockResolvedValue(undefined),
    delete: vi.fn().mockResolvedValue(undefined),
    findOneBy: vi.fn().mockResolvedValue(mockDictTypeEntity),
  }

  beforeEach(async () => {
    vi.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DictTypeService,
        {
          provide: getRepositoryToken(DictTypeEntity),
          useValue: mockDictTypeRepository,
        },
      ],
    }).compile()

    service = module.get<DictTypeService>(DictTypeService)
    dictTypeRepository = module.get(getRepositoryToken(DictTypeEntity)) as Mocked<
      Repository<DictTypeEntity>
    >
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('page', () => {
    it('should return paginated dict types', async () => {
      const result = await service.page({
        page: 1,
        pageSize: 10,
        name: '',
        code: '',
      })

      expect(result).toBeDefined()
      expect(dictTypeRepository.createQueryBuilder).toHaveBeenCalled()
    })

    it('should return paginated dict types with name filter', async () => {
      const result = await service.page({
        page: 1,
        pageSize: 10,
        name: '药品',
        code: '',
      })

      expect(result).toBeDefined()
      expect(dictTypeRepository.createQueryBuilder).toHaveBeenCalled()
    })

    it('should return paginated dict types with code filter', async () => {
      const result = await service.page({
        page: 1,
        pageSize: 10,
        name: '',
        code: 'drug',
      })

      expect(result).toBeDefined()
      expect(dictTypeRepository.createQueryBuilder).toHaveBeenCalled()
    })

    it('should return paginated dict types with combined filters', async () => {
      const result = await service.page({
        page: 1,
        pageSize: 10,
        name: '药品',
        code: 'drug',
      })

      expect(result).toBeDefined()
      expect(dictTypeRepository.createQueryBuilder).toHaveBeenCalled()
    })
  })

  describe('getAll', () => {
    it('should return all dict types', async () => {
      const result = await service.getAll()

      expect(result).toEqual([mockDictTypeEntity])
      expect(dictTypeRepository.find).toHaveBeenCalled()
    })
  })

  describe('countConfigList', () => {
    it('should return the count of dict types', async () => {
      const result = await service.countConfigList()

      expect(result).toBe(1)
      expect(dictTypeRepository.count).toHaveBeenCalled()
    })
  })

  describe('create', () => {
    it('should create a new dict type', async () => {
      const dto = {
        name: '测试类型',
        code: 'test_type',
        status: 1,
        remark: '测试字典类型',
      }

      await service.create(dto)

      expect(dictTypeRepository.insert).toHaveBeenCalledWith(dto)
    })

    it('should throw error when inserting duplicate code', async () => {
      const dto = {
        name: '测试类型',
        code: 'drug_type',
        status: 1,
        remark: '测试字典类型',
      }

      dictTypeRepository.insert.mockRejectedValue(new Error('Duplicate entry'))

      await expect(service.create(dto)).rejects.toThrow()
      expect(dictTypeRepository.insert).toHaveBeenCalledWith(dto)
    })
  })

  describe('update', () => {
    it('should update an existing dict type', async () => {
      const dto = {
        name: '更新后的类型',
        remark: '更新后的备注',
      }

      await service.update(1, dto)

      expect(dictTypeRepository.update).toHaveBeenCalledWith(1, dto)
    })

    it('should handle update when dict type does not exist', async () => {
      const dto = {
        name: '更新后的类型',
      }

      dictTypeRepository.update.mockRejectedValue(new Error('Record not found'))

      await expect(service.update(999, dto)).rejects.toThrow()
      expect(dictTypeRepository.update).toHaveBeenCalledWith(999, dto)
    })
  })

  describe('delete', () => {
    it('should delete an existing dict type', async () => {
      await service.delete(1)

      expect(dictTypeRepository.delete).toHaveBeenCalledWith(1)
    })

    it('should handle delete when dict type does not exist', async () => {
      dictTypeRepository.delete.mockRejectedValue(new Error('Record not found'))

      await expect(service.delete(999)).rejects.toThrow()
      expect(dictTypeRepository.delete).toHaveBeenCalledWith(999)
    })
  })

  describe('findOne', () => {
    it('should return an existing dict type', async () => {
      const result = await service.findOne(1)

      expect(result).toEqual(mockDictTypeEntity)
      expect(dictTypeRepository.findOneBy).toHaveBeenCalledWith({ id: 1 })
    })

    it('should return undefined when dict type does not exist', async () => {
      dictTypeRepository.findOneBy.mockResolvedValue(undefined)

      const result = await service.findOne(999)

      expect(result).toBeUndefined()
      expect(dictTypeRepository.findOneBy).toHaveBeenCalledWith({ id: 999 })
    })
  })
})
