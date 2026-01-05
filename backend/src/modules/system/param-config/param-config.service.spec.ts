import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { ParamConfigEntity } from './param-config.entity'
import { ParamConfigService } from './param-config.service'

describe('ParamConfigService', () => {
  let service: ParamConfigService
  let paramConfigRepository: jest.Mocked<Repository<ParamConfigEntity>>

  const mockParamConfigEntity: Partial<ParamConfigEntity> = {
    id: 1,
    key: 'prescription_validity_days',
    name: '处方有效期天数',
    value: '7',
    remark: '处方的有效天数',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const mockParamConfigRepository = {
    createQueryBuilder: jest.fn().mockReturnValue({
      where: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockResolvedValue([[mockParamConfigEntity], 1]),
    }),
    count: jest.fn().mockResolvedValue(1),
    insert: jest.fn().mockResolvedValue(undefined),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
    findOneBy: jest.fn().mockResolvedValue(mockParamConfigEntity),
    findOne: jest.fn().mockResolvedValue(mockParamConfigEntity),
  }

  beforeEach(async () => {
    jest.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParamConfigService,
        {
          provide: getRepositoryToken(ParamConfigEntity),
          useValue: mockParamConfigRepository,
        },
      ],
    }).compile()

    service = module.get<ParamConfigService>(ParamConfigService)
    paramConfigRepository = module.get(getRepositoryToken(ParamConfigEntity)) as jest.Mocked<
      Repository<ParamConfigEntity>
    >
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('page', () => {
    it('should return paginated param configs', async () => {
      const result = await service.page({
        page: 1,
        pageSize: 10,
        name: '',
      })

      expect(result).toBeDefined()
      expect(paramConfigRepository.createQueryBuilder).toHaveBeenCalled()
    })

    it('should return filtered param configs by name', async () => {
      const result = await service.page({
        page: 1,
        pageSize: 10,
        name: '处方',
      })

      expect(result).toBeDefined()
      expect(paramConfigRepository.createQueryBuilder).toHaveBeenCalled()
    })
  })

  describe('countConfigList', () => {
    it('should return the count of param configs', async () => {
      const result = await service.countConfigList()

      expect(result).toBe(1)
      expect(paramConfigRepository.count).toHaveBeenCalled()
    })
  })

  describe('create', () => {
    it('should create a new param config', async () => {
      const dto = {
        key: 'new_param',
        name: '新参数',
        value: 'new_value',
        remark: '新参数描述',
        isReadonly: false,
      }

      await service.create(dto)

      expect(paramConfigRepository.insert).toHaveBeenCalledWith(dto)
    })

    it('should throw error when inserting duplicate key', async () => {
      const dto = {
        key: 'prescription_validity_days',
        name: '重复参数',
        value: '10',
        remark: '重复参数描述',
        isReadonly: false,
      }

      paramConfigRepository.insert.mockRejectedValue(new Error('Duplicate entry'))

      await expect(service.create(dto)).rejects.toThrow()
      expect(paramConfigRepository.insert).toHaveBeenCalledWith(dto)
    })
  })

  describe('update', () => {
    it('should update an existing param config', async () => {
      const dto = {
        value: '10',
        remark: '更新后的描述',
      }

      await service.update(1, dto)

      expect(paramConfigRepository.update).toHaveBeenCalledWith(1, dto)
    })

    it('should handle update when param config does not exist', async () => {
      const dto = {
        value: '10',
      }

      paramConfigRepository.update.mockResolvedValue({
        raw: {},
        generatedMaps: [],
        affected: 0,
      } as any)

      await service.update(999, dto)

      expect(paramConfigRepository.update).toHaveBeenCalledWith(999, dto)
    })
  })

  describe('delete', () => {
    it('should delete an existing param config', async () => {
      await service.delete(1)

      expect(paramConfigRepository.delete).toHaveBeenCalledWith(1)
    })

    it('should handle delete when param config does not exist', async () => {
      paramConfigRepository.delete.mockResolvedValue({
        raw: {},
        generatedMaps: [],
        affected: 0,
      } as any)

      await service.delete(999)

      expect(paramConfigRepository.delete).toHaveBeenCalledWith(999)
    })
  })

  describe('findOne', () => {
    it('should return a param config by id', async () => {
      const result = await service.findOne(1)

      expect(result).toEqual(mockParamConfigEntity)
      expect(paramConfigRepository.findOneBy).toHaveBeenCalledWith({ id: 1 })
    })

    it('should return undefined when param config does not exist', async () => {
      paramConfigRepository.findOneBy.mockResolvedValue(undefined)

      const result = await service.findOne(999)

      expect(result).toBeUndefined()
      expect(paramConfigRepository.findOneBy).toHaveBeenCalledWith({ id: 999 })
    })
  })

  describe('findValueByKey', () => {
    it('should return value for existing key', async () => {
      const result = await service.findValueByKey('prescription_validity_days')

      expect(result).toBe('7')
      expect(paramConfigRepository.findOne).toHaveBeenCalledWith({
        where: { key: 'prescription_validity_days' },
        select: ['value'],
      })
    })

    it('should return null for non-existing key', async () => {
      paramConfigRepository.findOne.mockResolvedValue(undefined)

      const result = await service.findValueByKey('non_existing_key')

      expect(result).toBeNull()
    })
  })
})
