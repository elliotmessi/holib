import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { EntityManager, Repository, TreeRepository } from 'typeorm'

import { BusinessException } from '~/common/exceptions/biz.exception'
import { ErrorEnum } from '~/constants/error-code.constant'
import { DeptEntity } from './dept.entity'
import { DeptService } from './dept.service'
import { UserEntity } from '../../user/user.entity'
import { DeptDto, DeptQueryDto, MoveDept } from './dept.dto'

describe('DeptService', () => {
  let service: DeptService
  let deptRepository: TreeRepository<DeptEntity>
  let userRepository: Repository<UserEntity>
  let entityManager: EntityManager

  const mockDept: Partial<DeptEntity> = {
    id: 1,
    name: '测试部门',
    orderNo: 1,
    parent: null,
    children: [],
  }

  const mockUser: Partial<UserEntity> = {
    id: 1,
    username: 'test',
    password: 'test',
    dept: mockDept as DeptEntity,
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeptService,
        {
          provide: getRepositoryToken(DeptEntity),
          useValue: {
            find: vi.fn(),
            createQueryBuilder: vi.fn(),
            save: vi.fn(),
            delete: vi.fn(),
            findOneBy: vi.fn(),
            countDescendants: vi.fn(),
            findTrees: vi.fn(),
            findDescendantsTree: vi.fn(),
          } as any,
        },
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            countBy: vi.fn(),
          } as Partial<Repository<UserEntity>>,
        },
        {
          provide: EntityManager,
          useValue: {
            transaction: vi.fn(async (runInTransaction) => {
              return runInTransaction({
                save: vi.fn(),
              } as any)
            }),
          } as any,
        },
      ],
    }).compile()

    service = module.get<DeptService>(DeptService)
    deptRepository = module.get<TreeRepository<DeptEntity>>(getRepositoryToken(DeptEntity))
    userRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity))
    entityManager = module.get<EntityManager>(EntityManager)
  })

  describe('list', () => {
    it('should return dept list', async () => {
      const mockDeptList = [mockDept as DeptEntity]
      vi.spyOn(deptRepository, 'find').mockResolvedValue(mockDeptList)

      const result = await service.list()
      expect(result).toEqual(mockDeptList)
      expect(deptRepository.find).toHaveBeenCalledWith({ order: { orderNo: 'DESC' } })
    })
  })

  describe('info', () => {
    it('should return dept info when dept exists', async () => {
      vi.spyOn(deptRepository, 'createQueryBuilder').mockReturnValue({
        leftJoinAndSelect: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        getOne: vi.fn().mockResolvedValue(mockDept as DeptEntity),
      } as any)

      const result = await service.info(1)
      expect(result).toEqual(mockDept as DeptEntity)
    })

    it('should throw exception when dept not found', async () => {
      vi.spyOn(deptRepository, 'createQueryBuilder').mockReturnValue({
        leftJoinAndSelect: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        getOne: vi.fn().mockResolvedValue(null),
      } as any)

      await expect(service.info(1)).rejects.toThrow(BusinessException)
      await expect(service.info(1)).rejects.toThrow('部门不存在')
    })
  })

  describe('create', () => {
    it('should create dept successfully', async () => {
      vi.spyOn(deptRepository, 'createQueryBuilder').mockReturnValue({
        where: vi.fn().mockReturnThis(),
        getOne: vi.fn().mockResolvedValue(mockDept as DeptEntity),
      } as any)
      vi.spyOn(deptRepository, 'save').mockResolvedValue(mockDept as DeptEntity)

      await service.create({ parentId: 1, name: '测试部门', orderNo: 1 })
      expect(deptRepository.save).toHaveBeenCalled()
    })

    it('should create dept with null parent successfully', async () => {
      vi.spyOn(deptRepository, 'createQueryBuilder').mockReturnValue({
        where: vi.fn().mockReturnThis(),
        getOne: vi.fn().mockResolvedValue(null),
      } as any)
      vi.spyOn(deptRepository, 'save').mockResolvedValue(mockDept as DeptEntity)

      await service.create({ parentId: null, name: '测试部门', orderNo: 1 })
      expect(deptRepository.save).toHaveBeenCalled()
    })
  })

  describe('update', () => {
    it('should update dept successfully', async () => {
      vi.spyOn(deptRepository, 'createQueryBuilder')
        .mockReturnValueOnce({
          where: vi.fn().mockReturnThis(),
          getOne: vi.fn().mockResolvedValue(mockDept as DeptEntity),
        } as any)
        .mockReturnValueOnce({
          where: vi.fn().mockReturnThis(),
          getOne: vi.fn().mockResolvedValue(mockDept as DeptEntity),
        } as any)
      vi.spyOn(deptRepository, 'save').mockResolvedValue(mockDept as DeptEntity)

      await service.update(1, { parentId: 1, name: '更新部门', orderNo: 2 })
      expect(deptRepository.save).toHaveBeenCalled()
    })
  })

  describe('delete', () => {
    it('should delete dept successfully', async () => {
      vi.spyOn(deptRepository, 'delete').mockResolvedValue({ affected: 1, raw: {} })

      await service.delete(1)
      expect(deptRepository.delete).toHaveBeenCalledWith(1)
    })
  })

  describe('move', () => {
    it('should move dept successfully', async () => {
      const mockMoveDept: MoveDept[] = [{ id: 1, parentId: 1 }]
      await service.move(mockMoveDept)
      expect(entityManager.transaction).toHaveBeenCalled()
    })
  })

  describe('countUserByDeptId', () => {
    it('should return user count', async () => {
      vi.spyOn(userRepository, 'countBy').mockResolvedValue(1)

      const result = await service.countUserByDeptId(1)
      expect(result).toBe(1)
      expect(userRepository.countBy).toHaveBeenCalledWith({ dept: { id: 1 } })
    })

    it('should return 0 when no user found', async () => {
      vi.spyOn(userRepository, 'countBy').mockResolvedValue(0)

      const result = await service.countUserByDeptId(1)
      expect(result).toBe(0)
      expect(userRepository.countBy).toHaveBeenCalledWith({ dept: { id: 1 } })
    })
  })

  describe('countChildDept', () => {
    it('should return child dept count', async () => {
      vi.spyOn(deptRepository, 'findOneBy').mockResolvedValue(mockDept as DeptEntity)
      vi.spyOn(deptRepository, 'countDescendants').mockResolvedValue(2)

      const result = await service.countChildDept(1)
      expect(result).toBe(1)
      expect(deptRepository.countDescendants).toHaveBeenCalledWith(mockDept as DeptEntity)
    })

    it('should return 0 when no child dept found', async () => {
      vi.spyOn(deptRepository, 'findOneBy').mockResolvedValue(mockDept as DeptEntity)
      vi.spyOn(deptRepository, 'countDescendants').mockResolvedValue(1)

      const result = await service.countChildDept(1)
      expect(result).toBe(0)
    })
  })

  describe('getDeptTree', () => {
    it('should return dept tree with name filter', async () => {
      vi.spyOn(deptRepository, 'createQueryBuilder').mockReturnValue({
        where: vi.fn().mockReturnThis(),
        getMany: vi.fn().mockResolvedValue([mockDept as DeptEntity]),
      } as any)
      vi.spyOn(deptRepository, 'findDescendantsTree').mockResolvedValue(mockDept as any)

      const result = await service.getDeptTree(1, { name: '测试' })
      expect(result).toBeDefined()
    })

    it('should return dept tree without name filter', async () => {
      vi.spyOn(deptRepository, 'findTrees').mockResolvedValue([mockDept as DeptEntity])

      const result = await service.getDeptTree(1, { name: '' })
      expect(result).toBeDefined()
      expect(deptRepository.findTrees).toHaveBeenCalled()
    })
  })
})
