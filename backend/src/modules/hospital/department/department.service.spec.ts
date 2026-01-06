import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { TreeRepository, DataSource } from 'typeorm'

import { BusinessException } from '~/common/exceptions/biz.exception'
import { ErrorEnum } from '~/constants/error-code.constant'

import { DepartmentEntity, DepartmentType } from './department.entity'
import { CreateDepartmentDto, UpdateDepartmentDto, DepartmentQueryDto } from './department.dto'
import { DepartmentService } from './department.service'

describe('DepartmentService', () => {
  let service: DepartmentService
  let departmentRepository: Mocked<TreeRepository<DepartmentEntity>>
  let dataSource: Mocked<DataSource>

  const mockDepartmentEntity: Partial<DepartmentEntity> = {
    id: 1,
    departmentCode: 'DEPT001',
    name: '内科',
    type: DepartmentType.CLINICAL,
    hospitalId: 1,
    parentId: null,
    hospital: { id: 1, name: '人民医院' } as any,
  }

  const mockDataSource = {
    manager: {
      findOneBy: vi.fn().mockResolvedValue({ id: 1, name: '人民医院' }),
    },
  }

  const mockDepartmentRepository = {
    findOneBy: vi.fn().mockResolvedValue(mockDepartmentEntity as DepartmentEntity),
    create: vi.fn().mockReturnValue(mockDepartmentEntity as DepartmentEntity),
    save: vi.fn().mockResolvedValue(mockDepartmentEntity as DepartmentEntity),
    find: vi.fn().mockResolvedValue([mockDepartmentEntity as DepartmentEntity]),
    createQueryBuilder: vi.fn().mockReturnValue({
      leftJoinAndSelect: vi.fn().mockReturnThis(),
      andWhere: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnThis(),
      getMany: vi.fn().mockResolvedValue([mockDepartmentEntity as DepartmentEntity]),
    }),
    findOne: vi.fn().mockResolvedValue(mockDepartmentEntity as DepartmentEntity),
    findDescendants: vi.fn().mockResolvedValue([mockDepartmentEntity as DepartmentEntity]),
    delete: vi.fn().mockResolvedValue({ affected: 1 }),
  }

  beforeEach(async () => {
    vi.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DepartmentService,
        {
          provide: getRepositoryToken(DepartmentEntity),
          useValue: mockDepartmentRepository,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile()

    service = module.get<DepartmentService>(DepartmentService)
    departmentRepository = module.get(getRepositoryToken(DepartmentEntity)) as Mocked<
      TreeRepository<DepartmentEntity>
    >
    dataSource = module.get(DataSource) as Mocked<DataSource>

    departmentRepository.findOne.mockResolvedValue(mockDepartmentEntity as DepartmentEntity)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('should create a new department successfully', async () => {
      const createDto: CreateDepartmentDto = {
        departmentCode: 'DEPT001',
        name: '内科',
        type: DepartmentType.CLINICAL,
        hospitalId: 1,
      }

      departmentRepository.findOneBy.mockResolvedValue(undefined)
      mockDataSource.manager.findOneBy.mockResolvedValue({ id: 1, name: '人民医院' })

      const result = await service.create(createDto)

      expect(result).toBeDefined()
      expect(departmentRepository.create).toHaveBeenCalled()
      expect(departmentRepository.save).toHaveBeenCalled()
      expect(result.id).toBe(1)
    })

    it('should throw error when department code already exists', async () => {
      const createDto: CreateDepartmentDto = {
        departmentCode: 'DEPT001',
        name: '内科',
        type: DepartmentType.CLINICAL,
        hospitalId: 1,
      }

      departmentRepository.findOneBy.mockResolvedValue(mockDepartmentEntity as DepartmentEntity)

      await expect(service.create(createDto)).rejects.toThrow(BusinessException)
      await expect(service.create(createDto)).rejects.toThrow('数据已存在')
    })

    it('should throw error when parent department not found', async () => {
      const createDto: CreateDepartmentDto = {
        departmentCode: 'DEPT002',
        name: '内科',
        type: DepartmentType.CLINICAL,
        hospitalId: 1,
        parentId: 999,
      }

      departmentRepository.findOneBy.mockResolvedValue(undefined)

      await expect(service.create(createDto)).rejects.toThrow(BusinessException)
      await expect(service.create(createDto)).rejects.toThrow('数据不存在')
    })

    it('should throw error when hospital not found', async () => {
      const createDto: CreateDepartmentDto = {
        departmentCode: 'DEPT002',
        name: '内科',
        type: DepartmentType.CLINICAL,
        hospitalId: 999,
      }

      departmentRepository.findOneBy.mockResolvedValue(undefined)
      mockDataSource.manager.findOneBy.mockResolvedValue(undefined)

      await expect(service.create(createDto)).rejects.toThrow(BusinessException)
      await expect(service.create(createDto)).rejects.toThrow('数据不存在')
    })

    it('should create department with parent successfully', async () => {
      const createDto: CreateDepartmentDto = {
        departmentCode: 'DEPT002',
        name: '心内科',
        type: DepartmentType.CLINICAL,
        hospitalId: 1,
        parentId: 1,
      }

      mockDataSource.manager.findOneBy.mockResolvedValue({ id: 1, name: '人民医院' })
      departmentRepository.findOneBy.mockResolvedValueOnce(undefined)
      departmentRepository.findOneBy.mockResolvedValueOnce(mockDepartmentEntity as DepartmentEntity)

      const result = await service.create(createDto)

      expect(result).toBeDefined()
      expect(departmentRepository.create).toHaveBeenCalled()
      expect(departmentRepository.save).toHaveBeenCalled()
    })
  })

  describe('findAll', () => {
    it('should return all departments with pagination', async () => {
      const query: DepartmentQueryDto = {}

      const result = await service.findAll(query)

      expect(result).toBeDefined()
      expect(result).toHaveLength(1)
      expect(departmentRepository.createQueryBuilder).toHaveBeenCalled()
    })

    it('should return filtered departments by name', async () => {
      const query: DepartmentQueryDto = {
        name: '内科',
      }

      const result = await service.findAll(query)

      expect(result).toBeDefined()
      expect(departmentRepository.createQueryBuilder).toHaveBeenCalled()
    })

    it('should return filtered departments by type', async () => {
      const query: DepartmentQueryDto = {
        type: DepartmentType.CLINICAL,
      }

      const result = await service.findAll(query)

      expect(result).toBeDefined()
      expect(departmentRepository.createQueryBuilder).toHaveBeenCalled()
    })

    it('should return filtered departments by hospitalId', async () => {
      const query: DepartmentQueryDto = {
        hospitalId: 1,
      }

      const result = await service.findAll(query)

      expect(result).toBeDefined()
      expect(departmentRepository.createQueryBuilder).toHaveBeenCalled()
    })

    it('should return filtered departments by parentId', async () => {
      const query: DepartmentQueryDto = {
        parentId: 1,
      }

      const result = await service.findAll(query)

      expect(result).toBeDefined()
      expect(departmentRepository.createQueryBuilder).toHaveBeenCalled()
    })
  })

  describe('findTree', () => {
    it('should return department tree structure', async () => {
      const mockDepartmentWithChildren: Partial<DepartmentEntity> = {
        ...mockDepartmentEntity,
        children: [],
      }
      ;(departmentRepository.createQueryBuilder as unknown as Mocked<any>).mockReturnValue({
        leftJoinAndSelect: vi.fn().mockReturnThis(),
        andWhere: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        getMany: vi.fn().mockResolvedValue([mockDepartmentWithChildren as DepartmentEntity]),
      })

      const result = await service.findTree(1)

      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBeTruthy()
      expect(departmentRepository.createQueryBuilder).toHaveBeenCalled()
    })

    it('should return department tree without hospitalId', async () => {
      const mockDepartmentWithChildren: Partial<DepartmentEntity> = {
        ...mockDepartmentEntity,
        children: [],
      }
      ;(departmentRepository.createQueryBuilder as unknown as Mocked<any>).mockReturnValue({
        leftJoinAndSelect: vi.fn().mockReturnThis(),
        andWhere: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        getMany: vi.fn().mockResolvedValue([mockDepartmentWithChildren as DepartmentEntity]),
      })

      const result = await service.findTree()

      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBeTruthy()
      expect(departmentRepository.createQueryBuilder).toHaveBeenCalled()
    })
  })

  describe('findOne', () => {
    it('should return department by id', async () => {
      const result = await service.findOne(1)

      expect(result).toBeDefined()
      expect(result.id).toBe(1)
      expect(departmentRepository.findOne).toHaveBeenCalled()
    })

    it('should throw error when department not found', async () => {
      departmentRepository.findOne.mockResolvedValue(undefined)

      await expect(service.findOne(999)).rejects.toThrow(BusinessException)
      await expect(service.findOne(999)).rejects.toThrow('数据不存在')
    })
  })

  describe('update', () => {
    it('should update department successfully', async () => {
      const updateDto: UpdateDepartmentDto = {
        departmentCode: 'DEPT001',
        name: '内科（更新）',
        type: DepartmentType.CLINICAL,
        hospitalId: 1,
      }

      await service.update(1, updateDto)

      expect(departmentRepository.findOne).toHaveBeenCalled()
      expect(departmentRepository.save).toHaveBeenCalled()
    })

    it('should throw error when updating non-existent department', async () => {
      departmentRepository.findOne.mockResolvedValue(undefined)

      const updateDto: UpdateDepartmentDto = {
        departmentCode: 'DEPT001',
        name: '内科（更新）',
        type: DepartmentType.CLINICAL,
        hospitalId: 1,
      }

      await expect(service.update(999, updateDto)).rejects.toThrow(BusinessException)
      await expect(service.update(999, updateDto)).rejects.toThrow('数据不存在')
    })

    it('should throw error when department code already exists', async () => {
      const updateDto: UpdateDepartmentDto = {
        departmentCode: 'DEPT002',
        name: '内科（更新）',
        type: DepartmentType.CLINICAL,
        hospitalId: 1,
      }

      departmentRepository.findOneBy.mockResolvedValue(mockDepartmentEntity as DepartmentEntity)

      await expect(service.update(1, updateDto)).rejects.toThrow(BusinessException)
      await expect(service.update(1, updateDto)).rejects.toThrow('数据已存在')
    })

    it('should update department with new parent', async () => {
      const updateDto: UpdateDepartmentDto = {
        departmentCode: 'DEPT001',
        name: '内科（更新）',
        type: DepartmentType.CLINICAL,
        hospitalId: 1,
        parentId: 2,
      }

      departmentRepository.findOneBy.mockResolvedValue(undefined)
      departmentRepository.findOneBy.mockResolvedValue(mockDepartmentEntity as DepartmentEntity)

      await service.update(1, updateDto)

      expect(departmentRepository.findOne).toHaveBeenCalled()
      expect(departmentRepository.save).toHaveBeenCalled()
    })

    it('should remove parent from department', async () => {
      const updateDto: UpdateDepartmentDto = {
        departmentCode: 'DEPT001',
        name: '内科（更新）',
        type: DepartmentType.CLINICAL,
        hospitalId: 1,
        parentId: null,
      }

      await service.update(1, updateDto)

      expect(departmentRepository.findOne).toHaveBeenCalled()
      expect(departmentRepository.save).toHaveBeenCalled()
    })
  })

  describe('remove', () => {
    it('should delete department successfully', async () => {
      departmentRepository.findDescendants.mockResolvedValue([
        mockDepartmentEntity as DepartmentEntity,
      ])

      await service.remove(1)

      expect(departmentRepository.findOne).toHaveBeenCalled()
      expect(departmentRepository.delete).toHaveBeenCalled()
    })

    it('should throw error when deleting department with children', async () => {
      const childDepartment: Partial<DepartmentEntity> = {
        ...mockDepartmentEntity,
        id: 2,
      }
      departmentRepository.findDescendants.mockResolvedValue([
        mockDepartmentEntity as DepartmentEntity,
        childDepartment as DepartmentEntity,
      ])

      await expect(service.remove(1)).rejects.toThrow(BusinessException)
      await expect(service.remove(1)).rejects.toThrow('数据存在关联子项，无法删除')
    })

    it('should throw error when deleting non-existent department', async () => {
      departmentRepository.findOne.mockResolvedValue(undefined)

      await expect(service.remove(999)).rejects.toThrow(BusinessException)
      await expect(service.remove(999)).rejects.toThrow('数据不存在')
    })
  })
})
