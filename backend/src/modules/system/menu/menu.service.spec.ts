import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Redis } from 'ioredis'

import { Repository } from 'typeorm'
import { REDIS_CLIENT } from '~/common/decorators/inject-redis.decorator'
import { BusinessException } from '~/common/exceptions/biz.exception'

import { SseService } from '~/modules/sse/sse.service'
import { RoleService } from '../role/role.service'
import { MenuDto, MenuQueryDto, MenuUpdateDto } from './menu.dto'
import { MenuEntity } from './menu.entity'
import { MenuService } from './menu.service'

describe('menuService', () => {
  let service: MenuService
  let menuRepository: Repository<MenuEntity>
  let roleService: RoleService
  let sseService: SseService
  let redis: jest.Mocked<Redis>

  const mockMenu: Partial<MenuEntity> = {
    id: 1,
    parentId: null,
    name: '系统管理',
    path: '/system',
    permission: null,
    type: 0,
    icon: 'setting',
    orderNo: 1,
    component: 'Layout',
    status: 1,
    show: 1,
    keepAlive: 1,
    isExt: false,
    extOpenMode: 1,
    activeMenu: null,
    roles: [],
  }

  const mockChildMenu: Partial<MenuEntity> = {
    id: 2,
    parentId: 1,
    name: '用户管理',
    path: 'user',
    permission: 'sys:user:list',
    type: 1,
    icon: 'user',
    orderNo: 1,
    component: '/system/user/index',
    status: 1,
    show: 1,
    keepAlive: 1,
    isExt: false,
    extOpenMode: 1,
    activeMenu: null,
    roles: [],
  }

  const mockRedis = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    keys: jest.fn(),
  }

  const mockSseService = {
    noticeClientToUpdateMenusByMenuIds: jest.fn(),
    noticeClientToUpdateMenusByUserIds: jest.fn(),
  }

  const mockRoleService = {
    getRoleIdsByUser: jest.fn(),
    hasAdminRole: jest.fn(),
  }

  beforeEach(async () => {
    jest.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MenuService,
        {
          provide: getRepositoryToken(MenuEntity),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            findBy: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnThis(),
            findOneBy: jest.fn(),
          },
        },
        {
          provide: REDIS_CLIENT,
          useValue: mockRedis,
        },
        {
          provide: RoleService,
          useValue: mockRoleService,
        },
        {
          provide: SseService,
          useValue: mockSseService,
        },
      ],
    }).compile()

    service = module.get<MenuService>(MenuService)
    menuRepository = module.get<Repository<MenuEntity>>(getRepositoryToken(MenuEntity))
    roleService = module.get<RoleService>(RoleService)
    sseService = module.get<SseService>(SseService)
    redis = module.get(REDIS_CLIENT)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('list', () => {
    it('should return filtered menus', async () => {
      const mockMenus = [mockMenu, mockChildMenu]
      menuRepository.find = jest.fn().mockResolvedValue(mockMenus as MenuEntity[])

      const queryDto: MenuQueryDto = {
        name: '系统',
      }

      const result = await service.list(queryDto)

      expect(result).toBeDefined()
      expect(menuRepository.find).toHaveBeenCalled()
    })

    it('should return all menus when no filter', async () => {
      const mockMenus = [mockMenu, mockChildMenu]
      menuRepository.find = jest.fn().mockResolvedValue(mockMenus as MenuEntity[])

      const result = await service.list({})

      expect(result).toBeDefined()
    })
  })

  describe('create', () => {
    it('should create menu successfully', async () => {
      const savedMenu = { ...mockMenu, id: 3 }
      menuRepository.save = jest.fn().mockResolvedValue(savedMenu as MenuEntity)

      const dto: MenuDto = {
        name: '新菜单',
        path: '/new',
        type: 0,
        parentId: null,
        orderNo: 1,
        isExt: false,
        extOpenMode: 1,
        show: 1,
        keepAlive: 1,
        status: 1,
        permission: undefined,
        createBy: 1,
        updateBy: 1,
      }

      await service.create(dto)

      expect(menuRepository.save).toHaveBeenCalled()
      expect(mockSseService.noticeClientToUpdateMenusByMenuIds).toHaveBeenCalled()
    })
  })

  describe('update', () => {
    it('should update menu successfully', async () => {
      menuRepository.update = jest.fn().mockResolvedValue({ affected: 1 } as any)

      const dto: MenuUpdateDto = {
        name: '更新后的菜单',
      }

      await service.update(1, dto)

      expect(menuRepository.update).toHaveBeenCalledWith(1, dto)
      expect(mockSseService.noticeClientToUpdateMenusByMenuIds).toHaveBeenCalled()
    })
  })

  describe('getMenus', () => {
    it('should return all menus for admin user', async () => {
      mockRoleService.getRoleIdsByUser.mockResolvedValue([1])
      mockRoleService.hasAdminRole.mockReturnValue(true)
      menuRepository.find = jest.fn().mockResolvedValue([mockMenu, mockChildMenu] as MenuEntity[])

      const result = await service.getMenus(1)

      expect(result).toBeDefined()
      expect(menuRepository.find).toHaveBeenCalled()
    })

    it('should return filtered menus for non-admin user', async () => {
      const mockQueryBuilder = {
        innerJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockChildMenu]),
      }
      menuRepository.createQueryBuilder = jest.fn().mockReturnValue(mockQueryBuilder as any)
      mockRoleService.getRoleIdsByUser.mockResolvedValue([1])
      mockRoleService.hasAdminRole.mockReturnValue(false)

      const result = await service.getMenus(2)

      expect(result).toBeDefined()
    })

    it('should return empty array when user has no roles', async () => {
      mockRoleService.getRoleIdsByUser.mockResolvedValue([])

      const result = await service.getMenus(999)

      expect(result).toEqual([])
    })
  })

  describe('check', () => {
    it('should throw error when creating permission without parent', async () => {
      const dto: Partial<MenuDto> = {
        type: 2,
        parentId: null,
        name: '权限',
        status: 1,
        createBy: 1,
        updateBy: 1,
      }

      await expect(service.check(dto)).rejects.toThrow(BusinessException)
    })

    it('should throw error when parent menu not found', async () => {
      const dto: Partial<MenuDto> = {
        type: 1,
        parentId: 999,
        name: '菜单',
        status: 1,
        createBy: 1,
        updateBy: 1,
      }
      menuRepository.findOneBy = jest.fn().mockResolvedValue(undefined)

      await expect(service.check(dto)).rejects.toThrow(BusinessException)
    })

    it('should throw error when parent is also a menu', async () => {
      const dto: Partial<MenuDto> = {
        type: 1,
        parentId: 1,
        name: '菜单',
        status: 1,
        createBy: 1,
        updateBy: 1,
      }
      menuRepository.findOneBy = jest.fn().mockResolvedValue({ id: 1, type: 1 } as MenuEntity)

      await expect(service.check(dto)).rejects.toThrow(BusinessException)
    })

    it('should not throw error when creating button under directory', async () => {
      const dto: Partial<MenuDto> = {
        type: 2,
        parentId: 1,
        name: '权限',
        status: 1,
        createBy: 1,
        updateBy: 1,
      }
      menuRepository.findOneBy = jest.fn().mockResolvedValue({ id: 1, type: 0 } as MenuEntity)

      await expect(service.check(dto)).resolves.not.toThrow()
    })
  })

  describe('getMenuItemInfo', () => {
    it('should return menu when found', async () => {
      menuRepository.findOneBy = jest.fn().mockResolvedValue(mockMenu as MenuEntity)

      const result = await service.getMenuItemInfo(1)

      expect(result).toBeDefined()
      expect(result?.name).toBe('系统管理')
    })

    it('should return undefined when menu not found', async () => {
      menuRepository.findOneBy = jest.fn().mockResolvedValue(undefined)

      const result = await service.getMenuItemInfo(999)

      expect(result).toBeUndefined()
    })
  })

  describe('getMenuItemAndParentInfo', () => {
    it('should return menu and parent info', async () => {
      const parentMenu = { id: 1, name: '系统管理' }
      const findOneByFn = jest.fn()
      findOneByFn
        .mockResolvedValueOnce({ ...mockChildMenu, parentId: 1 } as MenuEntity)
        .mockResolvedValueOnce(parentMenu as MenuEntity)
      menuRepository.findOneBy = findOneByFn

      const result = await service.getMenuItemInfo(2)

      expect(result).toBeDefined()
    })
  })

  describe('findRouterExist', () => {
    it('should return true when path exists', async () => {
      menuRepository.findOneBy = jest.fn().mockResolvedValue(mockMenu as MenuEntity)

      const result = await service.findRouterExist('/system')

      expect(result).toBe(true)
    })

    it('should return false when path not found', async () => {
      menuRepository.findOneBy = jest.fn().mockResolvedValue(undefined)

      const result = await service.findRouterExist('/nonexistent')

      expect(result).toBe(false)
    })
  })

  describe('getPermissions', () => {
    it('should return all permissions for admin user', async () => {
      mockRoleService.getRoleIdsByUser.mockResolvedValue([1])
      mockRoleService.hasAdminRole.mockReturnValue(true)
      menuRepository.findBy = jest
        .fn()
        .mockResolvedValue([
          { permission: 'sys:user:list' },
          { permission: 'sys:user:create,sys:user:update' },
        ] as MenuEntity[])

      const result = await service.getPermissions(1)

      expect(result).toContain('sys:user:list')
      expect(result).toContain('sys:user:create')
      expect(result).toContain('sys:user:update')
    })

    it('should return filtered permissions for non-admin user', async () => {
      const mockQueryBuilder = {
        innerJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([{ permission: 'sys:user:list' }]),
      }
      menuRepository.createQueryBuilder = jest.fn().mockReturnValue(mockQueryBuilder as any)
      mockRoleService.getRoleIdsByUser.mockResolvedValue([1])
      mockRoleService.hasAdminRole.mockReturnValue(false)

      const result = await service.getPermissions(2)

      expect(result).toContain('sys:user:list')
    })

    it('should return empty array when user has no roles', async () => {
      mockRoleService.getRoleIdsByUser.mockResolvedValue([])

      const result = await service.getPermissions(999)

      expect(result).toEqual([])
    })
  })

  describe('deleteMenuItem', () => {
    it('should delete menu items successfully', async () => {
      menuRepository.delete = jest.fn().mockResolvedValue({ affected: 2 } as any)

      await service.deleteMenuItem([1, 2])

      expect(menuRepository.delete).toHaveBeenCalledWith([1, 2])
    })
  })

  describe('refreshPerms', () => {
    it('should refresh permissions for online user', async () => {
      mockRedis.get.mockResolvedValue('mock-token')
      mockRoleService.getRoleIdsByUser.mockResolvedValue([1])
      mockRoleService.hasAdminRole.mockReturnValue(true)
      menuRepository.findBy = jest
        .fn()
        .mockResolvedValue([{ permission: 'sys:user:list' }] as MenuEntity[])

      await service.refreshPerms(1)

      expect(mockRedis.set).toHaveBeenCalled()
      expect(mockSseService.noticeClientToUpdateMenusByUserIds).toHaveBeenCalled()
    })

    it('should not refresh permissions for offline user', async () => {
      mockRedis.get.mockResolvedValue(null)

      await service.refreshPerms(999)

      expect(mockRedis.set).not.toHaveBeenCalled()
    })
  })

  describe('refreshOnlineUserPerms', () => {
    it('should refresh permissions for all online users', async () => {
      const mockKeys = ['auth:token:1', 'auth:token:2']
      mockRedis.keys = jest.fn().mockResolvedValue(mockKeys)
      mockRoleService.getRoleIdsByUser.mockResolvedValueOnce([1]).mockResolvedValueOnce([2])
      mockRoleService.hasAdminRole.mockReturnValue(false)
      menuRepository.createQueryBuilder = jest.fn().mockReturnValue({
        innerJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      } as any)

      await service.refreshOnlineUserPerms(true)

      expect(mockRedis.keys).toHaveBeenCalled()
    })

    it('should not refresh when no online users', async () => {
      mockRedis.keys = jest.fn().mockResolvedValue([])

      await service.refreshOnlineUserPerms(true)

      expect(mockRedis.set).not.toHaveBeenCalled()
    })
  })

  describe('checkRoleByMenuId', () => {
    it('should return true when menu has associated roles', async () => {
      menuRepository.findOne = jest.fn().mockResolvedValue(mockMenu as MenuEntity)

      const result = await service.checkRoleByMenuId(1)

      expect(result).toBe(true)
    })

    it('should return false when menu has no associated roles', async () => {
      menuRepository.findOne = jest.fn().mockResolvedValue(null)

      const result = await service.checkRoleByMenuId(1)

      expect(result).toBe(false)
    })
  })
})
