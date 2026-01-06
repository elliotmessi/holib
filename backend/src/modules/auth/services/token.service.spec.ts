import { JwtService } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'

import { Repository } from 'typeorm'
import { REDIS_CLIENT } from '~/common/decorators/inject-redis.decorator'
import { ISecurityConfig, SecurityConfig } from '~/config'
import { AccessTokenEntity } from '~/modules/auth/entities/access-token.entity'
import { TokenService } from '~/modules/auth/services/token.service'
import { RoleService } from '~/modules/system/role/role.service'

describe('tokenService', () => {
  let service: TokenService
  let accessTokenRepository: Mocked<Repository<AccessTokenEntity>>

  const mockSecurityConfig: ISecurityConfig = {
    jwtSecret: 'test-secret',
    jwtExprire: 86400,
    refreshSecret: 'refresh-secret',
    refreshExpire: 604800,
  }

  const mockJwtService = {
    sign: vi.fn().mockReturnValue('mock-jwt-token'),
    signAsync: vi.fn().mockResolvedValue('mock-jwt-token'),
    verifyAsync: vi.fn(),
  }

  const mockAccessTokenRepository = {
    findOne: vi.fn().mockResolvedValue(null),
    delete: vi.fn().mockResolvedValue({ affected: 1 } as any),
  }

  const mockRoleService = {
    getRoleIdsByUser: vi.fn(),
    getRoleValues: vi.fn(),
  }

  const mockRedis = {
    get: vi.fn(),
    set: vi.fn(),
    del: vi.fn(),
  }

  beforeEach(async () => {
    vi.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: SecurityConfig.KEY,
          useValue: mockSecurityConfig,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: getRepositoryToken(AccessTokenEntity),
          useValue: mockAccessTokenRepository,
        },
        {
          provide: RoleService,
          useValue: mockRoleService,
        },
        {
          provide: REDIS_CLIENT,
          useValue: mockRedis,
        },
      ],
    }).compile()

    service = module.get<TokenService>(TokenService)
    accessTokenRepository = module.get(getRepositoryToken(AccessTokenEntity))
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('generateJwtSign', () => {
    it('should sign jwt with payload', () => {
      const payload = { uid: 1, pv: 1, roles: ['admin'] }

      const result = service.generateJwtSign(payload)

      expect(result).toBe('mock-jwt-token')
      expect(mockJwtService.sign).toHaveBeenCalledWith(payload)
    })
  })

  describe('verifyAccessToken', () => {
    it('should verify access token and return payload', async () => {
      const mockPayload = { uid: 1, pv: 1, roles: ['admin'] }
      mockJwtService.verifyAsync.mockResolvedValue(mockPayload)

      const result = await service.verifyAccessToken('valid-token')

      expect(result).toEqual(mockPayload)
    })

    it('should throw error for invalid token', async () => {
      mockJwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'))

      await expect(service.verifyAccessToken('invalid-token')).rejects.toThrow('Invalid token')
    })
  })
})
