import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'

import { EntityManager, In, Like, Repository } from 'typeorm'

import { ROOT_ROLE_ID } from '~/constants/system.constant'

import { MenuEntity } from '../menu/menu.entity'

import { RoleEntity } from './role.entity'
import { RoleService } from './role.service'

describe('RoleService', () => {
  let service: RoleService
  let roleRepository: jest.Mocked<Repository<RoleEntity>>
  let menuRepository: jest.Mocked<Repository<MenuEntity>>
  let entityManager: jest.Mocked<EntityManager>

  const mockRoleEntity: Partial<RoleEntity> = {
    id: 1,
    name: '测试角色',
    value: 'test_role',
    status: 1,
    remark: '测试角色描述',
    createdAt: new Date(),
    updatedAt: new Date(),
    menus: [
      {
        id: 1,
        name: '菜单1',
        path: '/menu1',
        parentId: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any,
    ],
    users: [],
  }

  const mockMenuEntity: Partial<MenuEntity> = {
    id: 1,
    name: '菜单1',
    path: '/menu1',
    parentId: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    roles: [],
  }

  // 创建一个完整的mockQueryBuilder，包含所有必要的方法
  const mockQueryBuilder = {
    where: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    offset: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    getOne: jest.fn().mockResolvedValue(mockRoleEntity),
    getManyAndCount: jest.fn().mockResolvedValue([[mockRoleEntity], 1]),
  }

  // 为了处理paginate函数的instanceof检查，我们需要让mockRoleRepository同时支持Repository和QueryBuilder接口
  const mockRoleRepository = {
    // Repository方法
    find: jest.fn().mockResolvedValue([mockRoleEntity]),
    count: jest.fn().mockResolvedValue(1),
    findOne: jest.fn().mockResolvedValue(mockRoleEntity),
    findOneBy: jest.fn().mockResolvedValue(mockRoleEntity),
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
    save: jest.fn().mockResolvedValue(mockRoleEntity),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
    findBy: jest.fn().mockResolvedValue([mockRoleEntity]),
    exist: jest.fn().mockResolvedValue(false),
    // QueryBuilder方法（用于处理paginate函数将其视为QueryBuilder的情况）
    where: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    offset: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn().mockResolvedValue([[mockRoleEntity], 1]),
  }

  const mockMenuRepository = {
    find: jest.fn().mockResolvedValue([{ id: 1 } as MenuEntity]),
    findBy: jest.fn().mockResolvedValue([mockMenuEntity]),
  }

  const mockEntityManager = {
    transaction: jest.fn().mockImplementation(async (callback) => {
      return callback({
        save: jest.fn().mockResolvedValue(undefined),
      } as any)
    }),
  }

  beforeEach(async () => {
    jest.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        {
          provide: getRepositoryToken(RoleEntity),
          useValue: mockRoleRepository,
        },
        {
          provide: getRepositoryToken(MenuEntity),
          useValue: mockMenuRepository,
        },
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
      ],
    }).compile()

    service = module.get<RoleService>(RoleService)
    roleRepository = module.get(getRepositoryToken(RoleEntity)) as jest.Mocked<
      Repository<RoleEntity>
    >
    menuRepository = module.get(getRepositoryToken(MenuEntity)) as jest.Mocked<
      Repository<MenuEntity>
    >
    entityManager = module.get(EntityManager) as jest.Mocked<EntityManager>
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('findAll', () => {
    it('should return all roles with pagination', async () => {
      // 由于mockRoleRepository是普通对象，paginate函数将其视为QueryBuilder
      // 因此我们需要检查take和skip方法是否被调用
      const result = await service.findAll({ page: 1, pageSize: 10 })

      expect(result).toBeDefined()
      expect(result.items).toHaveLength(1)
      // 检查paginate函数是否正确处理了mockRoleRepository
      expect(mockRoleRepository.take).toHaveBeenCalled()
      expect(mockRoleRepository.skip).toHaveBeenCalled()
      expect(mockRoleRepository.getManyAndCount).toHaveBeenCalled()
    })
  })

  describe('list', () => {
    it('should return filtered roles with pagination', async () => {
      const result = await service.list({
        page: 1,
        pageSize: 10,
        name: '测试',
        value: 'test',
        status: 1,
      })

      expect(result).toBeDefined()
      expect(roleRepository.createQueryBuilder).toHaveBeenCalled()
    })

    it('should return all roles when no filters are provided', async () => {
      const result = await service.list({
        page: 1,
        pageSize: 10,
        name: '',
        value: '',
        remark: '',
        status: undefined,
      })

      expect(result).toBeDefined()
      expect(roleRepository.createQueryBuilder).toHaveBeenCalled()
    })
  })

  describe('info', () => {
    it('should return role info with menuIds', async () => {
      const result = await service.info(1)

      expect(result).toBeDefined()
      expect(result.id).toBe(1)
      expect(result.menuIds).toBeDefined()
      expect(result.menuIds).toEqual([1])
    })

    it('should return empty menuIds when role has no menus', async () => {
      mockMenuRepository.find.mockResolvedValue([])

      const result = await service.info(1)

      expect(result.menuIds).toEqual([])
    })
  })

  describe('delete', () => {
    it('should delete a role by id', async () => {
      await service.delete(2)

      expect(roleRepository.delete).toHaveBeenCalledWith(2)
    })

    it('should throw error when trying to delete root role', async () => {
      await expect(service.delete(ROOT_ROLE_ID)).rejects.toThrow()
      expect(roleRepository.delete).not.toHaveBeenCalled()
    })
  })

  describe('create', () => {
    it('should create a new role with menus', async () => {
      const dto = {
        name: '新角色',
        value: 'new_role',
        status: 1,
        remark: '新角色描述',
        menuIds: [1, 2],
        createBy: 1,
        updateBy: 1,
      }

      mockMenuRepository.findBy.mockResolvedValue([mockMenuEntity, { ...mockMenuEntity, id: 2 }])

      const result = await service.create(dto)

      expect(result.roleId).toBeDefined()
      expect(roleRepository.save).toHaveBeenCalled()
    })

    it('should create a new role without menus', async () => {
      const dto = {
        name: '新角色',
        value: 'new_role',
        status: 1,
        remark: '新角色描述',
        menuIds: [],
        createBy: 1,
        updateBy: 1,
      }

      mockMenuRepository.findBy.mockResolvedValue([])

      const result = await service.create(dto)

      expect(result.roleId).toBeDefined()
      expect(roleRepository.save).toHaveBeenCalled()
    })
  })

  describe('update', () => {
    it('should update a role with new menus', async () => {
      const dto = {
        name: '更新后的角色',
        status: 0,
        remark: '更新后的描述',
        menuIds: [2, 3],
      }

      mockMenuRepository.findBy.mockResolvedValue([
        { ...mockMenuEntity, id: 2 },
        { ...mockMenuEntity, id: 3 },
      ])

      await service.update(1, dto)

      expect(roleRepository.update).toHaveBeenCalledWith(1, {
        name: '更新后的角色',
        status: 0,
        remark: '更新后的描述',
      })
      expect(entityManager.transaction).toHaveBeenCalled()
    })

    it('should update a role and clear menus when menuIds is empty', async () => {
      const dto = {
        name: '更新后的角色',
        menuIds: [],
      }

      await service.update(1, dto)

      expect(roleRepository.update).toHaveBeenCalledWith(1, {
        name: '更新后的角色',
      })
      expect(entityManager.transaction).toHaveBeenCalled()
    })
  })

  describe('getRoleIdsByUser', () => {
    it('should return role ids for a user', async () => {
      const result = await service.getRoleIdsByUser(1)

      expect(result).toEqual([1])
      expect(roleRepository.find).toHaveBeenCalled()
    })

    it('should return empty array when user has no roles', async () => {
      mockRoleRepository.find.mockResolvedValue([])

      const result = await service.getRoleIdsByUser(999)

      expect(result).toEqual([])
    })
  })

  describe('getRoleValues', () => {
    it('should return role values for given role ids', async () => {
      const result = await service.getRoleValues([1, 2])

      expect(result).toEqual(['test_role'])
      expect(roleRepository.findBy).toHaveBeenCalledWith({ id: In([1, 2]) })
    })

    it('should return empty array when no role ids are provided', async () => {
      mockRoleRepository.findBy.mockResolvedValue([])

      const result = await service.getRoleValues([])

      expect(result).toEqual([])
    })
  })

  describe('isAdminRoleByUser', () => {
    it('should return true when user has admin role', async () => {
      mockRoleRepository.find.mockResolvedValue([{ ...mockRoleEntity, id: ROOT_ROLE_ID }])

      const result = await service.isAdminRoleByUser(1)

      expect(result).toBe(true)
    })

    it('should return false when user does not have admin role', async () => {
      mockRoleRepository.find.mockResolvedValue([{ ...mockRoleEntity, id: 2 }])

      const result = await service.isAdminRoleByUser(1)

      expect(result).toBe(false)
    })

    it('should return false when user has no roles', async () => {
      mockRoleRepository.find.mockResolvedValue([])

      const result = await service.isAdminRoleByUser(999)

      expect(result).toBe(false)
    })
  })

  describe('hasAdminRole', () => {
    it('should return true when role ids include admin role', () => {
      const result = service.hasAdminRole([2, ROOT_ROLE_ID, 3])

      expect(result).toBe(true)
    })

    it('should return false when role ids do not include admin role', () => {
      const result = service.hasAdminRole([2, 3, 4])

      expect(result).toBe(false)
    })

    it('should return false when role ids is empty', () => {
      const result = service.hasAdminRole([])

      expect(result).toBe(false)
    })
  })

  describe('checkUserByRoleId', () => {
    it('should return false when role has no users', async () => {
      const result = await service.checkUserByRoleId(1)

      expect(result).toBe(false)
      expect(roleRepository.exist).toHaveBeenCalled()
    })

    it('should return true when role has users', async () => {
      mockRoleRepository.exist.mockResolvedValue(true)

      const result = await service.checkUserByRoleId(1)

      expect(result).toBe(true)
    })
  })
})
