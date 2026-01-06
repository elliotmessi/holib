import { Test, TestingModule } from '@nestjs/testing'
import { Redis } from 'ioredis'

import { REDIS_CLIENT } from '~/common/decorators/inject-redis.decorator'
import { BusinessException } from '~/common/exceptions/biz.exception'
import { AppConfig, ISecurityConfig, SecurityConfig } from '~/config'
import { AuthService } from '~/modules/auth/auth.service'
import { TokenService } from '~/modules/auth/services/token.service'
import { LoginLogService } from '~/modules/system/log/services/login-log.service'
import { MenuService } from '~/modules/system/menu/menu.service'
import { RoleService } from '~/modules/system/role/role.service'
import { UserEntity } from '~/modules/user/user.entity'
import { UserService } from '~/modules/user/user.service'

describe('authService', () => {
  let service: AuthService
  let userService: UserService
  let roleService: RoleService
  let menuService: MenuService
  let tokenService: TokenService
  let loginLogService: LoginLogService
  let redis: Mocked<Redis>

  const mockUser: Partial<UserEntity> & { psalt: string } = {
    id: 1,
    username: 'admin',
    password: '207acd61a3c1bd506d7e9a4535359f8a',
    psalt: 'salt',
    status: 1,
    nickname: '管理员',
    email: 'admin@example.com',
  }

  const mockRedis = {
    get: vi.fn(),
    set: vi.fn(),
    del: vi.fn(),
  }

  const mockSecurityConfig: ISecurityConfig = {
    jwtSecret: 'test-secret',
    jwtExprire: 86400,
    refreshSecret: 'refresh-secret',
    refreshExpire: 604800,
  }

  const mockAppConfig = {
    multiDeviceLogin: false,
  }

  const mockTokenService = {
    generateAccessToken: vi.fn().mockResolvedValue({
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
    }),
    removeAccessToken: vi.fn().mockResolvedValue(undefined),
  }

  const mockRoleService = {
    getRoleIdsByUser: vi.fn().mockResolvedValue([1]),
    getRoleValues: vi.fn().mockResolvedValue(['admin']),
  }

  const mockMenuService = {
    getPermissions: vi.fn().mockResolvedValue(['sys:user:list', 'sys:user:create']),
  }

  const mockUserService = {
    findUserByUserName: vi.fn(),
    forbidden: vi.fn().mockResolvedValue(undefined),
    forceUpdatePassword: vi.fn().mockResolvedValue(undefined),
  }

  const mockLoginLogService = {
    create: vi.fn().mockResolvedValue(undefined),
  }

  beforeEach(async () => {
    vi.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: REDIS_CLIENT,
          useValue: mockRedis,
        },
        {
          provide: SecurityConfig.KEY,
          useValue: mockSecurityConfig,
        },
        {
          provide: AppConfig.KEY,
          useValue: mockAppConfig,
        },
        {
          provide: TokenService,
          useValue: mockTokenService,
        },
        {
          provide: RoleService,
          useValue: mockRoleService,
        },
        {
          provide: MenuService,
          useValue: mockMenuService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: LoginLogService,
          useValue: mockLoginLogService,
        },
      ],
    }).compile()

    service = module.get<AuthService>(AuthService)
    userService = module.get<UserService>(UserService)
    roleService = module.get<RoleService>(RoleService)
    menuService = module.get<MenuService>(MenuService)
    tokenService = module.get<TokenService>(TokenService)
    loginLogService = module.get<LoginLogService>(LoginLogService)
    redis = module.get(REDIS_CLIENT)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('login', () => {
    it('should return access token on successful login', async () => {
      mockUserService.findUserByUserName.mockResolvedValue(mockUser as UserEntity)
      mockRedis.get.mockResolvedValue(null)

      const result = await service.login('admin', '123456', '127.0.0.1', 'Mozilla/5.0')

      expect(result).toBe('mock-access-token')
      expect(mockUserService.findUserByUserName).toHaveBeenCalledWith('admin')
      expect(mockTokenService.generateAccessToken).toHaveBeenCalledWith(1, ['admin'])
      expect(mockRedis.set).toHaveBeenCalled()
      expect(mockLoginLogService.create).toHaveBeenCalled()
    })

    it('should throw error when user not found', async () => {
      mockUserService.findUserByUserName.mockResolvedValue(undefined)

      await expect(
        service.login('nonexistent', '123456', '127.0.0.1', 'Mozilla/5.0'),
      ).rejects.toThrow(BusinessException)
      expect(mockUserService.findUserByUserName).toHaveBeenCalledWith('nonexistent')
    })

    it('should throw error when password is incorrect', async () => {
      mockUserService.findUserByUserName.mockResolvedValue(mockUser as UserEntity)

      await expect(
        service.login('admin', 'wrongpassword', '127.0.0.1', 'Mozilla/5.0'),
      ).rejects.toThrow(BusinessException)
      expect(mockUserService.findUserByUserName).toHaveBeenCalledWith('admin')
    })
  })

  describe('validateUser', () => {
    it('should return user info when credentials are valid', async () => {
      mockUserService.findUserByUserName.mockResolvedValue(mockUser as UserEntity)

      const result = await service.validateUser('admin', '123456')

      expect(result).toBeDefined()
      expect(result.username).toBe('admin')
      expect((result as any).password).toBeUndefined()
    })

    it('should throw error when user not found', async () => {
      mockUserService.findUserByUserName.mockResolvedValue(undefined)

      await expect(service.validateUser('nonexistent', '123456')).rejects.toThrow(BusinessException)
    })

    it('should throw error when password is incorrect', async () => {
      mockUserService.findUserByUserName.mockResolvedValue(mockUser as UserEntity)

      await expect(service.validateUser('admin', 'wrongpassword')).rejects.toThrow(
        BusinessException,
      )
    })
  })

  describe('checkPassword', () => {
    it('should not throw error when password is correct', async () => {
      mockUserService.findUserByUserName.mockResolvedValue(mockUser as UserEntity)

      await expect(service.checkPassword('admin', '123456')).resolves.not.toThrow()
    })

    it('should throw error when password is incorrect', async () => {
      mockUserService.findUserByUserName.mockResolvedValue(mockUser as UserEntity)

      await expect(service.checkPassword('admin', 'wrongpassword')).rejects.toThrow(
        BusinessException,
      )
    })
  })

  describe('getPermissions', () => {
    it('should return permissions from menu service', async () => {
      const permissions = ['sys:user:list', 'sys:user:create']
      mockMenuService.getPermissions.mockResolvedValue(permissions)

      const result = await service.getPermissions(1)

      expect(result).toEqual(permissions)
      expect(mockMenuService.getPermissions).toHaveBeenCalledWith(1)
    })
  })

  describe('getMenus', () => {
    it('should return menus from menu service', async () => {
      const mockMenus = [{ id: 1, name: '系统管理' }]
      menuService.getMenus = vi.fn().mockResolvedValue(mockMenus as any)

      const result = await service.getMenus(1)

      expect(result).toEqual(mockMenus)
      expect(menuService.getMenus).toHaveBeenCalledWith(1)
    })
  })

  describe('getPermissionsCache', () => {
    it('should return cached permissions from redis', async () => {
      const cachedPermissions = JSON.stringify(['sys:user:list', 'sys:user:create'])
      mockRedis.get.mockResolvedValue(cachedPermissions)

      const result = await service.getPermissionsCache(1)

      expect(result).toEqual(['sys:user:list', 'sys:user:create'])
    })

    it('should return empty array when no cached permissions', async () => {
      mockRedis.get.mockResolvedValue(null)

      const result = await service.getPermissionsCache(1)

      expect(result).toEqual([])
    })
  })

  describe('setPermissionsCache', () => {
    it('should set permissions in redis', async () => {
      const permissions = ['sys:user:list', 'sys:user:create']

      await service.setPermissionsCache(1, permissions)

      expect(mockRedis.set).toHaveBeenCalled()
    })
  })

  describe('getPasswordVersionByUid', () => {
    it('should return password version from redis', async () => {
      mockRedis.get.mockResolvedValue('1')

      const result = await service.getPasswordVersionByUid(1)

      expect(result).toBe('1')
    })
  })

  describe('getTokenByUid', () => {
    it('should return token from redis', async () => {
      mockRedis.get.mockResolvedValue('mock-token')

      const result = await service.getTokenByUid(1)

      expect(result).toBe('mock-token')
    })
  })

  describe('clearLoginStatus', () => {
    it('should clear login status when multiDeviceLogin is false', async () => {
      const mockAuthUser = {
        uid: 1,
        pv: 1,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 86400,
        roles: ['admin'],
      }

      await service.clearLoginStatus(mockAuthUser as any, 'mock-access-token')

      expect(mockRedis.set).toHaveBeenCalled()
      expect(mockUserService.forbidden).toHaveBeenCalledWith(1, 'mock-access-token')
    })
  })

  describe('loginLog', () => {
    it('should create login log', async () => {
      await service.loginLog(1, '127.0.0.1', 'Mozilla/5.0')

      expect(mockLoginLogService.create).toHaveBeenCalledWith(1, '127.0.0.1', 'Mozilla/5.0')
    })
  })

  describe('resetPassword', () => {
    it('should reset user password', async () => {
      mockUserService.findUserByUserName.mockResolvedValue(mockUser as UserEntity)
      mockUserService.forceUpdatePassword = vi.fn().mockResolvedValue(undefined)

      await service.resetPassword('admin', 'NewPassword123')

      expect(mockUserService.findUserByUserName).toHaveBeenCalledWith('admin')
      expect(mockUserService.forceUpdatePassword).toHaveBeenCalledWith(1, 'NewPassword123')
    })
  })
})
