import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { DictTypeEntity } from '../dict-type/dict-type.entity'
import { DictItemEntity } from './dict-item.entity'
import { DictItemService } from './dict-item.service'

describe('DictItemService', () => {
  let service: DictItemService
  let dictItemRepository: jest.Mocked<Repository<DictItemEntity>>

  const mockDictItemEntity: Partial<DictItemEntity> = {
    id: 1,
    label: '中药',
    value: 'chinese_medicine',
    orderNo: 0,
    status: 1,
    remark: '中药类型',
    createdAt: new Date(),
    updatedAt: new Date(),
    type: {
      id: 1,
      name: '药品类型',
      code: 'drug_type',
      status: 1,
      remark: '药品的类型分类',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any,
  }

  const mockDictItemRepository = {
    createQueryBuilder: jest.fn().mockReturnValue({
      orderBy: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockResolvedValue([[mockDictItemEntity], 1]),
    }),
    count: jest.fn().mockResolvedValue(1),
    insert: jest.fn().mockResolvedValue(undefined),
    update: jest.fn().mockResolvedValue(undefined),
    delete: jest.fn().mockResolvedValue(undefined),
    findOneBy: jest.fn().mockResolvedValue(mockDictItemEntity),
  }

  beforeEach(async () => {
    jest.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DictItemService,
        {
          provide: getRepositoryToken(DictItemEntity),
          useValue: mockDictItemRepository,
        },
      ],
    }).compile()

    service = module.get<DictItemService>(DictItemService)
    dictItemRepository = module.get(getRepositoryToken(DictItemEntity)) as jest.Mocked<
      Repository<DictItemEntity>
    >
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('page', () => {
    it('should return paginated dict items', async () => {
      const result = await service.page({
        page: 1,
        pageSize: 10,
        label: '',
        value: '',
        typeId: 1,
      })

      expect(result).toBeDefined()
      expect(dictItemRepository.createQueryBuilder).toHaveBeenCalled()
    })

    it('should return paginated dict items with label filter', async () => {
      const result = await service.page({
        page: 1,
        pageSize: 10,
        label: '药',
        value: '',
        typeId: 1,
      })

      expect(result).toBeDefined()
      expect(dictItemRepository.createQueryBuilder).toHaveBeenCalled()
    })

    it('should return paginated dict items with value filter', async () => {
      const result = await service.page({
        page: 1,
        pageSize: 10,
        label: '',
        value: 'chinese',
        typeId: 1,
      })

      expect(result).toBeDefined()
      expect(dictItemRepository.createQueryBuilder).toHaveBeenCalled()
    })

    it('should return paginated dict items with combined filters', async () => {
      const result = await service.page({
        page: 1,
        pageSize: 10,
        label: '药',
        value: 'chinese',
        typeId: 1,
      })

      expect(result).toBeDefined()
      expect(dictItemRepository.createQueryBuilder).toHaveBeenCalled()
    })
  })

  describe('countConfigList', () => {
    it('should return the count of dict items', async () => {
      const result = await service.countConfigList()

      expect(result).toBe(1)
      expect(dictItemRepository.count).toHaveBeenCalled()
    })
  })

  describe('create', () => {
    it('should create a new dict item', async () => {
      const dto = {
        label: '西药',
        value: 'western_medicine',
        typeId: 1,
        orderNo: 1,
        status: 1,
        remark: '西药类型',
      }

      await service.create(dto)

      expect(dictItemRepository.insert).toHaveBeenCalledWith({
        label: '西药',
        value: 'western_medicine',
        orderNo: 1,
        status: 1,
        remark: '西药类型',
        type: {
          id: 1,
        },
      })
    })

    it('should throw error when inserting with invalid typeId', async () => {
      const dto = {
        label: '无效类型',
        value: 'invalid_type',
        typeId: 999,
        orderNo: 0,
        status: 1,
        remark: '无效类型',
      }

      dictItemRepository.insert.mockRejectedValue(new Error('Invalid typeId'))

      await expect(service.create(dto)).rejects.toThrow()
      expect(dictItemRepository.insert).toHaveBeenCalled()
    })
  })

  describe('update', () => {
    it('should update an existing dict item', async () => {
      const dto = {
        label: '更新后的中药',
        remark: '更新后的备注',
        typeId: 1,
      }

      await service.update(1, dto)

      expect(dictItemRepository.update).toHaveBeenCalledWith(1, {
        label: '更新后的中药',
        remark: '更新后的备注',
        type: {
          id: 1,
        },
      })
    })

    it('should handle update when dict item does not exist', async () => {
      const dto = {
        label: '更新后的中药',
        typeId: 1,
      }

      dictItemRepository.update.mockRejectedValue(new Error('Record not found'))

      await expect(service.update(999, dto)).rejects.toThrow()
      expect(dictItemRepository.update).toHaveBeenCalledWith(999, {
        label: '更新后的中药',
        type: {
          id: 1,
        },
      })
    })
  })

  describe('delete', () => {
    it('should delete an existing dict item', async () => {
      await service.delete(1)

      expect(dictItemRepository.delete).toHaveBeenCalledWith(1)
    })

    it('should handle delete when dict item does not exist', async () => {
      dictItemRepository.delete.mockRejectedValue(new Error('Record not found'))

      await expect(service.delete(999)).rejects.toThrow()
      expect(dictItemRepository.delete).toHaveBeenCalledWith(999)
    })
  })

  describe('findOne', () => {
    it('should return an existing dict item', async () => {
      const result = await service.findOne(1)

      expect(result).toEqual(mockDictItemEntity)
      expect(dictItemRepository.findOneBy).toHaveBeenCalledWith({ id: 1 })
    })

    it('should return undefined when dict item does not exist', async () => {
      dictItemRepository.findOneBy.mockResolvedValue(undefined)

      const result = await service.findOne(999)

      expect(result).toBeUndefined()
      expect(dictItemRepository.findOneBy).toHaveBeenCalledWith({ id: 999 })
    })
  })
})
