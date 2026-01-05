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
            find: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            findBy: jest.fn(),
            findOneBy: jest.fn(),
            createQueryBuilder: jest.fn(() => ({
              innerJoinAndSelect: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              getMany: jest.fn(),
            })),
            findOne: jest.fn(),
            delete: jest.fn(),
          } as any,
        },
        {
          provide: RoleService,
          useValue: {
            getRoleIdsByUser: jest.fn(),
            hasAdminRole: jest.fn(),
          } as Partial<RoleService>,
        },
        {
          provide: SseService,
          useValue: {
            noticeClientToUpdateMenusByMenuIds: jest.fn(),
            noticeClientToUpdateMenusByUserIds: jest.fn(),
          } as Partial<SseService>,
        },
        {
          provide: require('~/common/decorators/inject-redis.decorator').REDIS_CLIENT,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            keys: jest.fn(),
          } as Partial<Redis>,
        },
      ],
    }).compile()

    service = module.get<MenuService>(MenuService)
    menuRepository = module.get<Repository<MenuEntity>>(getRepositoryToken(MenuEntity))
    roleService = module.get<RoleService>(RoleService)
    sseService = module.get<SseService>(SseService)
    redis = module.get<Redis>(require('~/common/decorators/inject-redis.decorator').REDIS_CLIENT)
  })

  describe('list', () => {
    it('should return menu list with tree structure', async () => {
      jest.spyOn(menuRepository, 'find').mockResolvedValue([mockMenu as MenuEntity])

      const result = await service.list({} as MenuQueryDto)
      expect(result).toBeDefined()
      expect(menuRepository.find).toHaveBeenCalled()
    })

    it('should return raw menu list when tree structure is empty', async () => {
      jest.spyOn(menuRepository, 'find').mockResolvedValue([])

      const result = await service.list({} as MenuQueryDto)
      expect(result).toEqual([])
    })

    it('should return menu list with filters', async () => {
      jest.spyOn(menuRepository, 'find').mockResolvedValue([mockMenu as MenuEntity])

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
      jest.spyOn(menuRepository, 'save').mockResolvedValue({ ...mockMenu, id: 1 } as MenuEntity)
      jest.spyOn(sseService, 'noticeClientToUpdateMenusByMenuIds').mockResolvedValue()

      await service.create(mockMenu as MenuDto)
      expect(menuRepository.save).toHaveBeenCalled()
      expect(sseService.noticeClientToUpdateMenusByMenuIds).toHaveBeenCalledWith([1])
    })
  })

  describe('update', () => {
    it('should update menu successfully', async () => {
      jest
        .spyOn(menuRepository, 'update')
        .mockResolvedValue({ affected: 1, raw: {}, generatedMaps: [] } as any)
      jest.spyOn(sseService, 'noticeClientToUpdateMenusByMenuIds').mockResolvedValue()

      await service.update(1, { name: '更新菜单' } as MenuUpdateDto)
      expect(menuRepository.update).toHaveBeenCalledWith(1, { name: '更新菜单' })
      expect(sseService.noticeClientToUpdateMenusByMenuIds).toHaveBeenCalledWith([1])
    })
  })

  describe('getMenus', () => {
    it('should return all menus for admin role', async () => {
      jest.spyOn(roleService, 'getRoleIdsByUser').mockResolvedValue([1])
      jest.spyOn(roleService, 'hasAdminRole').mockReturnValue(true)
      jest.spyOn(menuRepository, 'find').mockResolvedValue([mockMenu as MenuEntity])

      const result = await service.getMenus(1)
      expect(result).toBeDefined()
    })

    it('should return menus for non-admin role', async () => {
      jest.spyOn(roleService, 'getRoleIdsByUser').mockResolvedValue([2])
      jest.spyOn(roleService, 'hasAdminRole').mockReturnValue(false)
      jest.spyOn(menuRepository, 'createQueryBuilder').mockReturnValue({
        innerJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockMenu as MenuEntity]),
      } as any)

      const result = await service.getMenus(1)
      expect(result).toBeDefined()
    })

    it('should return empty array when no role ids', async () => {
      jest.spyOn(roleService, 'getRoleIdsByUser').mockResolvedValue([])

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
      jest.spyOn(service, 'getMenuItemInfo').mockResolvedValue({ type: 1 } as MenuEntity)

      await expect(service.check({ type: 1, parentId: 1 } as Partial<MenuDto>)).rejects.toThrow(
        BusinessException,
      )
      await expect(service.check({ type: 1, parentId: 1 } as Partial<MenuDto>)).rejects.toThrow(
        '非法操作：该节点仅支持目录类型父节点',
      )
    })

    it('should not throw exception when creating menu with directory parent', async () => {
      jest.spyOn(service, 'getMenuItemInfo').mockResolvedValue({ type: 0 } as MenuEntity)

      await expect(
        service.check({ type: 1, parentId: 1 } as Partial<MenuDto>),
      ).resolves.not.toThrow()
    })
  })

  describe('findChildMenus', () => {
    it('should return child menus recursively', async () => {
      jest
        .spyOn(menuRepository, 'findBy')
        .mockResolvedValueOnce([{ id: 2, parentId: 1, type: 0 } as MenuEntity])
        .mockResolvedValueOnce([{ id: 3, parentId: 2, type: 1 } as MenuEntity])
        .mockResolvedValueOnce([])

      const result = await service.findChildMenus(1)
      expect(result).toBeDefined()
    })

    it('should return empty array when no child menus', async () => {
      jest.spyOn(menuRepository, 'findBy').mockResolvedValue([])

      const result = await service.findChildMenus(1)
      expect(result).toEqual([])
    })
  })

  describe('getMenuItemInfo', () => {
    it('should return menu info when menu exists', async () => {
      jest.spyOn(menuRepository, 'findOneBy').mockResolvedValue(mockMenu as MenuEntity)

      const result = await service.getMenuItemInfo(1)
      expect(result).toEqual(mockMenu as MenuEntity)
    })

    it('should return null when menu not exists', async () => {
      jest.spyOn(menuRepository, 'findOneBy').mockResolvedValue(null)

      const result = await service.getMenuItemInfo(1)
      expect(result).toBeNull()
    })
  })

  describe('getMenuItemAndParentInfo', () => {
    it('should return menu and parent info when menu exists with parent', async () => {
      jest
        .spyOn(menuRepository, 'findOneBy')
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
      jest.spyOn(menuRepository, 'findOneBy').mockResolvedValueOnce(mockMenu as MenuEntity)

      const result = await service.getMenuItemAndParentInfo(1)
      expect(result).toBeDefined()
      expect(result.menu).toBeDefined()
      expect(result.parentMenu).toBeUndefined()
    })
  })

  describe('findRouterExist', () => {
    it('should return true when router exists', async () => {
      jest.spyOn(menuRepository, 'findOneBy').mockResolvedValue(mockMenu as MenuEntity)

      const result = await service.findRouterExist('/test')
      expect(result).toBe(true)
    })

    it('should return false when router not exists', async () => {
      jest.spyOn(menuRepository, 'findOneBy').mockResolvedValue(null)

      const result = await service.findRouterExist('/not-exist')
      expect(result).toBe(false)
    })
  })

  describe('getPermissions', () => {
    it('should return all permissions for admin role', async () => {
      jest.spyOn(roleService, 'getRoleIdsByUser').mockResolvedValue([1])
      jest.spyOn(roleService, 'hasAdminRole').mockReturnValue(true)
      jest
        .spyOn(menuRepository, 'findBy')
        .mockResolvedValue([
          { permission: 'test:create,test:update' } as MenuEntity,
          { permission: 'test:delete' } as MenuEntity,
        ])

      const result = await service.getPermissions(1)
      expect(result).toEqual(['test:create', 'test:update', 'test:delete'])
    })

    it('should return permissions for non-admin role', async () => {
      jest.spyOn(roleService, 'getRoleIdsByUser').mockResolvedValue([2])
      jest.spyOn(roleService, 'hasAdminRole').mockReturnValue(false)
      jest.spyOn(menuRepository, 'createQueryBuilder').mockReturnValue({
        innerJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([{ permission: 'test:create' } as MenuEntity]),
      } as any)

      const result = await service.getPermissions(1)
      expect(result).toEqual(['test:create'])
    })

    it('should return empty array when no role ids', async () => {
      jest.spyOn(roleService, 'getRoleIdsByUser').mockResolvedValue([])

      const result = await service.getPermissions(1)
      expect(result).toEqual([])
    })
  })

  describe('deleteMenuItem', () => {
    it('should delete menu items successfully', async () => {
      jest.spyOn(menuRepository, 'delete').mockResolvedValue({ affected: 2, raw: {} })

      await service.deleteMenuItem([1, 2])
      expect(menuRepository.delete).toHaveBeenCalledWith([1, 2])
    })
  })

  describe('refreshPerms', () => {
    it('should refresh permissions for online user', async () => {
      jest.spyOn(roleService, 'getRoleIdsByUser').mockResolvedValue([1])
      jest.spyOn(roleService, 'hasAdminRole').mockReturnValue(true)
      jest
        .spyOn(menuRepository, 'findBy')
        .mockResolvedValue([{ permission: 'test:create' } as MenuEntity])
      jest.spyOn(redis, 'get').mockResolvedValue('online')
      jest.spyOn(redis, 'set').mockResolvedValue('OK')
      jest.spyOn(sseService, 'noticeClientToUpdateMenusByUserIds').mockResolvedValue()

      await service.refreshPerms(1)
      expect(redis.set).toHaveBeenCalled()
      expect(sseService.noticeClientToUpdateMenusByUserIds).toHaveBeenCalledWith([1])
    })

    it('should not refresh permissions for offline user', async () => {
      jest.spyOn(roleService, 'getRoleIdsByUser').mockResolvedValue([1])
      jest.spyOn(roleService, 'hasAdminRole').mockReturnValue(true)
      jest.spyOn(redis, 'get').mockResolvedValue(null)

      await service.refreshPerms(1)
      expect(redis.set).not.toHaveBeenCalled()
    })
  })

  describe('refreshOnlineUserPerms', () => {
    it('should refresh permissions for all online users', async () => {
      // 使用正确的Redis键格式 'auth:token:'
      jest.spyOn(redis, 'keys').mockResolvedValue(['auth:token:1', 'auth:token:2'])
      jest.spyOn(roleService, 'getRoleIdsByUser').mockResolvedValue([1])
      jest.spyOn(roleService, 'hasAdminRole').mockReturnValue(true)
      jest
        .spyOn(menuRepository, 'findBy')
        .mockResolvedValue([{ permission: 'test:create' } as MenuEntity])
      jest.spyOn(redis, 'set').mockResolvedValue('OK')
      jest.spyOn(sseService, 'noticeClientToUpdateMenusByUserIds').mockResolvedValue()

      await service.refreshOnlineUserPerms()
      expect(redis.keys).toHaveBeenCalled()
      // 验证redis.set被调用
      expect(redis.set).toHaveBeenCalled()
      expect(sseService.noticeClientToUpdateMenusByUserIds).toHaveBeenCalled()
    })

    it('should do nothing when no online users', async () => {
      jest.spyOn(redis, 'keys').mockResolvedValue([])

      await service.refreshOnlineUserPerms()
      expect(menuRepository.findBy).not.toHaveBeenCalled()
    })
  })

  describe('checkRoleByMenuId', () => {
    it('should return true when menu is associated with role', async () => {
      jest.spyOn(menuRepository, 'findOne').mockResolvedValue(mockMenu as MenuEntity)

      const result = await service.checkRoleByMenuId(1)
      expect(result).toBe(true)
    })

    it('should return false when menu is not associated with role', async () => {
      jest.spyOn(menuRepository, 'findOne').mockResolvedValue(null)

      const result = await service.checkRoleByMenuId(1)
      expect(result).toBe(false)
    })
  })
})
