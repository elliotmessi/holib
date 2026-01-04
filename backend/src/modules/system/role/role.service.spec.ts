import { Test, TestingModule } from '@nestjs/testing'
import { getEntityManagerToken, getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { ROOT_ROLE_ID } from '~/constants/system.constant'
import { paginate } from '~/helper/paginate'
import { MenuEntity } from '~/modules/system/menu/menu.entity'

import { RoleDto, RoleQueryDto } from './role.dto'
import { RoleEntity } from './role.entity'
import { RoleService } from './role.service'

jest.mock('~/helper/paginate', () => ({
  paginate: jest.fn(),
}))

describe('roleService', () => {
  let service: RoleService
  let roleRepository: Repository<RoleEntity>
  let menuRepository: Repository<MenuEntity>

  const mockRole: Partial<RoleEntity> = {
    id: 1,
    name: '管理员',
    value: 'admin',
    remark: '超级管理员角色',
    status: 1,
    menus: [],
  }

  const mockMenu: Partial<MenuEntity> = {
    id: 1,
    name: '系统管理',
    type: 0,
  }

  beforeEach(async () => {
    jest.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        {
          provide: getRepositoryToken(RoleEntity),
          useValue: {
            createQueryBuilder: jest.fn(() => ({
              where: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              getOne: jest.fn(),
              getMany: jest.fn(),
            })),
            find: jest.fn(),
            findOne: jest.fn(),
            findOneBy: jest.fn(),
            findBy: jest.fn(),
            save: jest.fn().mockResolvedValue(mockRole),
            create: jest.fn().mockReturnValue(mockRole),
            update: jest.fn().mockResolvedValue({ affected: 1 } as any),
            delete: jest.fn().mockResolvedValue({ affected: 1 } as any),
            exist: jest.fn().mockResolvedValue(false),
          },
        },
        {
          provide: getRepositoryToken(MenuEntity),
          useValue: {
            find: jest.fn().mockResolvedValue([mockMenu]),
            findBy: jest.fn().mockResolvedValue([mockMenu]),
          },
        },
        {
          provide: getEntityManagerToken(),
          useValue: {
            transaction: jest.fn().mockImplementation(async (callback) => {
              const txEntityManager = {
                save: jest.fn().mockResolvedValue(mockRole),
              }
              return callback(txEntityManager)
            }),
          },
        },
      ],
    }).compile()

    service = module.get<RoleService>(RoleService)
    roleRepository = module.get<Repository<RoleEntity>>(getRepositoryToken(RoleEntity))
    menuRepository = module.get<Repository<MenuEntity>>(getRepositoryToken(MenuEntity))
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('findAll', () => {
    it('should return paginated roles', async () => {
      ;(paginate as jest.Mock).mockResolvedValue({
        items: [mockRole],
        total: 1,
        page: 1,
        pageSize: 20,
      } as any)

      const result = await service.findAll({ page: 1, pageSize: 20 })

      expect(result.items).toHaveLength(1)
    })
  })

  describe('list', () => {
    it('should return filtered roles', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockRole]),
      }
      roleRepository.createQueryBuilder = jest.fn().mockReturnValue(mockQueryBuilder as any)
      ;(paginate as jest.Mock).mockResolvedValue({
        items: [mockRole],
        total: 1,
        page: 1,
        pageSize: 20,
      } as any)

      const queryDto: RoleQueryDto = {
        page: 1,
        pageSize: 20,
        name: '管理员',
        value: 'admin',
      }

      const result = await service.list(queryDto)

      expect(result.items).toHaveLength(1)
    })
  })

  describe('info', () => {
    it('should return role info with menu ids', async () => {
      roleRepository.createQueryBuilder = jest.fn().mockReturnValue({
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockRole),
      } as any)
      menuRepository.find = jest.fn().mockResolvedValue([{ id: 1 }] as MenuEntity[])

      const result = await service.info(1)

      expect(result).toBeDefined()
      expect(result.menuIds).toEqual([1])
    })
  })

  describe('create', () => {
    it('should create role successfully', async () => {
      const savedRole = { ...mockRole, id: 2 }
      roleRepository.save = jest.fn().mockResolvedValue(savedRole as RoleEntity)
      menuRepository.findBy = jest.fn().mockResolvedValue([])

      const dto: RoleDto = {
        name: '测试角色',
        value: 'test',
        remark: '测试角色描述',
        status: 1,
        createBy: 1,
        updateBy: 1,
        menuIds: [1],
      }

      const result = await service.create(dto)

      expect(result.roleId).toBe(2)
    })
  })

  describe('delete', () => {
    it('should delete role successfully', async () => {
      roleRepository.delete = jest.fn().mockResolvedValue({ affected: 1 } as any)

      await expect(service.delete(2)).resolves.not.toThrow()
    })

    it('should throw error when trying to delete root role', async () => {
      await expect(service.delete(ROOT_ROLE_ID)).rejects.toThrow('不能删除超级管理员')
    })
  })

  describe('getRoleIdsByUser', () => {
    it('should return role ids for user', async () => {
      roleRepository.find = jest.fn().mockResolvedValue([{ id: 1 }, { id: 2 }] as RoleEntity[])

      const result = await service.getRoleIdsByUser(1)

      expect(result).toEqual([1, 2])
    })

    it('should return empty array when user has no roles', async () => {
      roleRepository.find = jest.fn().mockResolvedValue([])

      const result = await service.getRoleIdsByUser(999)

      expect(result).toEqual([])
    })
  })

  describe('getRoleValues', () => {
    it('should return role values by ids', async () => {
      roleRepository.findBy = jest
        .fn()
        .mockResolvedValue([{ value: 'admin' }, { value: 'user' }] as RoleEntity[])

      const result = await service.getRoleValues([1, 2])

      expect(result).toEqual(['admin', 'user'])
    })
  })

  describe('isAdminRoleByUser', () => {
    it('should return true when user has admin role', async () => {
      roleRepository.find = jest.fn().mockResolvedValue([{ id: ROOT_ROLE_ID }] as RoleEntity[])

      const result = await service.isAdminRoleByUser(1)

      expect(result).toBe(true)
    })

    it('should return false when user does not have admin role', async () => {
      roleRepository.find = jest.fn().mockResolvedValue([{ id: 2 }] as RoleEntity[])

      const result = await service.isAdminRoleByUser(1)

      expect(result).toBe(false)
    })
  })

  describe('hasAdminRole', () => {
    it('should return true when role ids include admin role', () => {
      const result = service.hasAdminRole([1, 2, ROOT_ROLE_ID])

      expect(result).toBe(true)
    })

    it('should return false when role ids do not include admin role', () => {
      const result = service.hasAdminRole([2, 3, 4])

      expect(result).toBe(false)
    })
  })

  describe('checkUserByRoleId', () => {
    it('should return true when role has associated users', async () => {
      roleRepository.exist = jest.fn().mockResolvedValue(true)

      const result = await service.checkUserByRoleId(1)

      expect(result).toBe(true)
    })

    it('should return false when role has no associated users', async () => {
      roleRepository.exist = jest.fn().mockResolvedValue(false)

      const result = await service.checkUserByRoleId(1)

      expect(result).toBe(false)
    })
  })
})
