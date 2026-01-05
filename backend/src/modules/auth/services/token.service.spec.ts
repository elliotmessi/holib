import { JwtService } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'

import { Repository } from 'typeorm'
import { REDIS_CLIENT } from '~/common/decorators/inject-redis.decorator'
import { ISecurityConfig, SecurityConfig } from '~/config'
import { AccessTokenEntity } from '../entities/tokens.entity'
import { TokenService } from '~/modules/auth/services/token.service'
import { RoleService } from '~/modules/system/role/role.service'

describe('tokenService', () => {
  let service: TokenService
  let accessTokenRepository: jest.Mocked<Repository<AccessTokenEntity>>

  const mockSecurityConfig: ISecurityConfig = {
    jwtSecret: 'test-secret',
    jwtExprire: 86400,
    refreshSecret: 'refresh-secret',
    refreshExpire: 604800,
  }

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock-jwt-token'),
    signAsync: jest.fn().mockResolvedValue('mock-jwt-token'),
    verifyAsync: jest.fn(),
  }

  const mockAccessTokenRepository = {
    findOne: jest.fn().mockResolvedValue(null),
    delete: jest.fn().mockResolvedValue({ affected: 1 } as any),
  }

  const mockRoleService = {
    getRoleIdsByUser: jest.fn(),
    getRoleValues: jest.fn(),
  }

  const mockRedis = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  }

  beforeEach(async () => {
    jest.clearAllMocks()

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
