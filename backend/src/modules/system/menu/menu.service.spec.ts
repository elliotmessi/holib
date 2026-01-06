import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import Redis from 'ioredis'
import { Repository } from 'typeorm'

import { MenuEntity } from './menu.entity'
import { MenuService } from './menu.service'
import { MenuDto, MenuQueryDto, MenuUpdateDto } from './menu.dto'
import { RoleService } from '../role/role.service'
import { SseService } from '~/modules/sse/sse.service'
import { BusinessException } from '~/common/exceptions/biz.exception'
import { ErrorEnum } from '~/constants/error-code.constant'
import { REDIS_CLIENT } from '~/common/decorators/inject-redis.decorator'

describe('MenuService', () => {
  let service: MenuService
  let menuRepository: Repository<MenuEntity>
  let roleService: RoleService
  let sseService: SseService
  let redis: Redis

  const mockMenu: Partial<MenuEntity> = {
    id: 1,
    name: '测试菜单',
    path: '/test',
    component: 'TestComponent',
    type: 0,
    parentId: null,
    orderNo: 1,
    status: 1,
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MenuService,
        {
          provide: getRepositoryToken(MenuEntity),
          useValue: {
            find: vi.fn(),
            save: vi.fn(),
            update: vi.fn(),
            findBy: vi.fn(),
            findOneBy: vi.fn(),
            createQueryBuilder: vi.fn(() => ({
              innerJoinAndSelect: vi.fn().mockReturnThis(),
              andWhere: vi.fn().mockReturnThis(),
              orderBy: vi.fn().mockReturnThis(),
              getMany: vi.fn(),
            })),
            findOne: vi.fn(),
            delete: vi.fn(),
          } as any,
        },
        {
          provide: RoleService,
          useValue: {
            getRoleIdsByUser: vi.fn(),
            hasAdminRole: vi.fn(),
          } as Partial<RoleService>,
        },
        {
          provide: SseService,
          useValue: {
            noticeClientToUpdateMenusByMenuIds: vi.fn(),
            noticeClientToUpdateMenusByUserIds: vi.fn(),
          } as Partial<SseService>,
        },
        {
          provide: REDIS_CLIENT,
          useValue: {
            get: vi.fn(),
            set: vi.fn(),
            keys: vi.fn(),
          } as Partial<Redis>,
        },
      ],
    }).compile()

    service = module.get<MenuService>(MenuService)
    menuRepository = module.get<Repository<MenuEntity>>(getRepositoryToken(MenuEntity))
    roleService = module.get<RoleService>(RoleService)
    sseService = module.get<SseService>(SseService)
    redis = module.get<Redis>(REDIS_CLIENT)
  })

  describe('list', () => {
    it('should return menu list with tree structure', async () => {
      vi.spyOn(menuRepository, 'find').mockResolvedValue([mockMenu as MenuEntity])

      const result = await service.list({} as MenuQueryDto)
      expect(result).toBeDefined()
      expect(menuRepository.find).toHaveBeenCalled()
    })

    it('should return raw menu list when tree structure is empty', async () => {
      vi.spyOn(menuRepository, 'find').mockResolvedValue([])

      const result = await service.list({} as MenuQueryDto)
      expect(result).toEqual([])
    })

    it('should return menu list with filters', async () => {
      vi.spyOn(menuRepository, 'find').mockResolvedValue([mockMenu as MenuEntity])

      const result = await service.list({
        name: '测试',
        path: '/test',
        permission: 'test:perm',
        component: 'TestComponent',
        status: 1,
      } as MenuQueryDto)
      expect(result).toBeDefined()
    })
  })

  describe('create', () => {
    it('should create menu successfully', async () => {
      vi.spyOn(menuRepository, 'save').mockResolvedValue({ ...mockMenu, id: 1 } as MenuEntity)
      vi.spyOn(sseService, 'noticeClientToUpdateMenusByMenuIds').mockResolvedValue()

      await service.create(mockMenu as MenuDto)
      expect(menuRepository.save).toHaveBeenCalled()
      expect(sseService.noticeClientToUpdateMenusByMenuIds).toHaveBeenCalledWith([1])
    })
  })

  describe('update', () => {
    it('should update menu successfully', async () => {
      vi.spyOn(menuRepository, 'update').mockResolvedValue({
        affected: 1,
        raw: {},
        generatedMaps: [],
      } as any)
      vi.spyOn(sseService, 'noticeClientToUpdateMenusByMenuIds').mockResolvedValue()

      await service.update(1, { name: '更新菜单' } as MenuUpdateDto)
      expect(menuRepository.update).toHaveBeenCalledWith(1, { name: '更新菜单' })
      expect(sseService.noticeClientToUpdateMenusByMenuIds).toHaveBeenCalledWith([1])
    })
  })

  describe('getMenus', () => {
    it('should return all menus for admin role', async () => {
      vi.spyOn(roleService, 'getRoleIdsByUser').mockResolvedValue([1])
      vi.spyOn(roleService, 'hasAdminRole').mockReturnValue(true)
      vi.spyOn(menuRepository, 'find').mockResolvedValue([mockMenu as MenuEntity])

      const result = await service.getMenus(1)
      expect(result).toBeDefined()
    })

    it('should return menus for non-admin role', async () => {
      vi.spyOn(roleService, 'getRoleIdsByUser').mockResolvedValue([2])
      vi.spyOn(roleService, 'hasAdminRole').mockReturnValue(false)
      vi.spyOn(menuRepository, 'createQueryBuilder').mockReturnValue({
        innerJoinAndSelect: vi.fn().mockReturnThis(),
        andWhere: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        getMany: vi.fn().mockResolvedValue([mockMenu as MenuEntity]),
      } as any)

      const result = await service.getMenus(1)
      expect(result).toBeDefined()
    })

    it('should return empty array when no role ids', async () => {
      vi.spyOn(roleService, 'getRoleIdsByUser').mockResolvedValue([])

      const result = await service.getMenus(1)
      expect(result).toBeDefined()
    })
  })

  describe('check', () => {
    it('should throw exception when creating permission without parent', async () => {
      await expect(service.check({ type: 2, parentId: null } as Partial<MenuDto>)).rejects.toThrow(
        BusinessException,
      )
      await expect(service.check({ type: 2, parentId: null } as Partial<MenuDto>)).rejects.toThrow(
        '权限必须包含父节点',
      )
    })

    it('should throw exception when creating menu with menu parent', async () => {
      vi.spyOn(service, 'getMenuItemInfo').mockResolvedValue({ type: 1 } as MenuEntity)

      await expect(service.check({ type: 1, parentId: 1 } as Partial<MenuDto>)).rejects.toThrow(
        BusinessException,
      )
      await expect(service.check({ type: 1, parentId: 1 } as Partial<MenuDto>)).rejects.toThrow(
        '非法操作：该节点仅支持目录类型父节点',
      )
    })

    it('should not throw exception when creating menu with directory parent', async () => {
      vi.spyOn(service, 'getMenuItemInfo').mockResolvedValue({ type: 0 } as MenuEntity)

      await expect(
        service.check({ type: 1, parentId: 1 } as Partial<MenuDto>),
      ).resolves.not.toThrow()
    })
  })

  describe('findChildMenus', () => {
    it('should return child menus recursively', async () => {
      vi.spyOn(menuRepository, 'findBy')
        .mockResolvedValueOnce([{ id: 2, parentId: 1, type: 0 } as MenuEntity])
        .mockResolvedValueOnce([{ id: 3, parentId: 2, type: 1 } as MenuEntity])
        .mockResolvedValueOnce([])

      const result = await service.findChildMenus(1)
      expect(result).toBeDefined()
    })

    it('should return empty array when no child menus', async () => {
      vi.spyOn(menuRepository, 'findBy').mockResolvedValue([])

      const result = await service.findChildMenus(1)
      expect(result).toEqual([])
    })
  })

  describe('getMenuItemInfo', () => {
    it('should return menu info when menu exists', async () => {
      vi.spyOn(menuRepository, 'findOneBy').mockResolvedValue(mockMenu as MenuEntity)

      const result = await service.getMenuItemInfo(1)
      expect(result).toEqual(mockMenu as MenuEntity)
    })

    it('should return null when menu not exists', async () => {
      vi.spyOn(menuRepository, 'findOneBy').mockResolvedValue(null)

      const result = await service.getMenuItemInfo(1)
      expect(result).toBeNull()
    })
  })

  describe('getMenuItemAndParentInfo', () => {
    it('should return menu and parent info when menu exists with parent', async () => {
      vi.spyOn(menuRepository, 'findOneBy')
        .mockResolvedValueOnce({
          ...mockMenu,
          id: 2,
          parentId: 1,
        } as MenuEntity)
        .mockResolvedValueOnce(mockMenu as MenuEntity)

      const result = await service.getMenuItemAndParentInfo(2)
      expect(result).toBeDefined()
      expect(result.menu).toBeDefined()
      expect(result.parentMenu).toBeDefined()
    })

    it('should return menu without parent info when menu has no parent', async () => {
      vi.spyOn(menuRepository, 'findOneBy').mockResolvedValueOnce(mockMenu as MenuEntity)

      const result = await service.getMenuItemAndParentInfo(1)
      expect(result).toBeDefined()
      expect(result.menu).toBeDefined()
      expect(result.parentMenu).toBeUndefined()
    })
  })

  describe('findRouterExist', () => {
    it('should return true when router exists', async () => {
      vi.spyOn(menuRepository, 'findOneBy').mockResolvedValue(mockMenu as MenuEntity)

      const result = await service.findRouterExist('/test')
      expect(result).toBe(true)
    })

    it('should return false when router not exists', async () => {
      vi.spyOn(menuRepository, 'findOneBy').mockResolvedValue(null)

      const result = await service.findRouterExist('/not-exist')
      expect(result).toBe(false)
    })
  })

  describe('getPermissions', () => {
    it('should return all permissions for admin role', async () => {
      vi.spyOn(roleService, 'getRoleIdsByUser').mockResolvedValue([1])
      vi.spyOn(roleService, 'hasAdminRole').mockReturnValue(true)
      vi.spyOn(menuRepository, 'findBy').mockResolvedValue([
        { permission: 'test:create,test:update' } as MenuEntity,
        { permission: 'test:delete' } as MenuEntity,
      ])

      const result = await service.getPermissions(1)
      expect(result).toEqual(['test:create', 'test:update', 'test:delete'])
    })

    it('should return permissions for non-admin role', async () => {
      vi.spyOn(roleService, 'getRoleIdsByUser').mockResolvedValue([2])
      vi.spyOn(roleService, 'hasAdminRole').mockReturnValue(false)
      vi.spyOn(menuRepository, 'createQueryBuilder').mockReturnValue({
        innerJoinAndSelect: vi.fn().mockReturnThis(),
        andWhere: vi.fn().mockReturnThis(),
        getMany: vi.fn().mockResolvedValue([{ permission: 'test:create' } as MenuEntity]),
      } as any)

      const result = await service.getPermissions(1)
      expect(result).toEqual(['test:create'])
    })

    it('should return empty array when no role ids', async () => {
      vi.spyOn(roleService, 'getRoleIdsByUser').mockResolvedValue([])

      const result = await service.getPermissions(1)
      expect(result).toEqual([])
    })
  })

  describe('deleteMenuItem', () => {
    it('should delete menu items successfully', async () => {
      vi.spyOn(menuRepository, 'delete').mockResolvedValue({ affected: 2, raw: {} })

      await service.deleteMenuItem([1, 2])
      expect(menuRepository.delete).toHaveBeenCalledWith([1, 2])
    })
  })

  describe('refreshPerms', () => {
    it('should refresh permissions for online user', async () => {
      vi.spyOn(roleService, 'getRoleIdsByUser').mockResolvedValue([1])
      vi.spyOn(roleService, 'hasAdminRole').mockReturnValue(true)
      vi.spyOn(menuRepository, 'findBy').mockResolvedValue([
        { permission: 'test:create' } as MenuEntity,
      ])
      vi.spyOn(redis, 'get').mockResolvedValue('online')
      vi.spyOn(redis, 'set').mockResolvedValue('OK')
      vi.spyOn(sseService, 'noticeClientToUpdateMenusByUserIds').mockResolvedValue()

      await service.refreshPerms(1)
      expect(redis.set).toHaveBeenCalled()
      expect(sseService.noticeClientToUpdateMenusByUserIds).toHaveBeenCalledWith([1])
    })

    it('should not refresh permissions for offline user', async () => {
      vi.spyOn(roleService, 'getRoleIdsByUser').mockResolvedValue([1])
      vi.spyOn(roleService, 'hasAdminRole').mockReturnValue(true)
      vi.spyOn(redis, 'get').mockResolvedValue(null)

      await service.refreshPerms(1)
      expect(redis.set).not.toHaveBeenCalled()
    })
  })

  describe('refreshOnlineUserPerms', () => {
    it('should refresh permissions for all online users', async () => {
      vi.spyOn(redis, 'keys').mockResolvedValue(['auth:token:1', 'auth:token:2'])
      vi.spyOn(roleService, 'getRoleIdsByUser').mockResolvedValue([1])
      vi.spyOn(roleService, 'hasAdminRole').mockReturnValue(true)
      vi.spyOn(menuRepository, 'findBy').mockResolvedValue([
        { permission: 'test:create' } as MenuEntity,
      ])
      vi.spyOn(redis, 'set').mockResolvedValue('OK')
      vi.spyOn(sseService, 'noticeClientToUpdateMenusByUserIds').mockResolvedValue()

      await service.refreshOnlineUserPerms()
      expect(redis.keys).toHaveBeenCalled()
      // 验证redis.set被调用
      expect(redis.set).toHaveBeenCalled()
      expect(sseService.noticeClientToUpdateMenusByUserIds).toHaveBeenCalled()
    })

    it('should do nothing when no online users', async () => {
      vi.spyOn(redis, 'keys').mockResolvedValue([])

      await service.refreshOnlineUserPerms()
      expect(menuRepository.findBy).not.toHaveBeenCalled()
    })
  })

  describe('checkRoleByMenuId', () => {
    it('should return true when menu is associated with role', async () => {
      vi.spyOn(menuRepository, 'findOne').mockResolvedValue(mockMenu as MenuEntity)

      const result = await service.checkRoleByMenuId(1)
      expect(result).toBe(true)
    })

    it('should return false when menu is not associated with role', async () => {
      vi.spyOn(menuRepository, 'findOne').mockResolvedValue(null)

      const result = await service.checkRoleByMenuId(1)
      expect(result).toBe(false)
    })
  })
})
