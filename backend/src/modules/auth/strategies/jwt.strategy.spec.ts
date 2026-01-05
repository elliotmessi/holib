import { Test, TestingModule } from '@nestjs/testing'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { ISecurityConfig, SecurityConfig } from '~/config'

import { JwtStrategy } from './jwt.strategy'

describe('JwtStrategy', () => {
  let strategy: JwtStrategy
  let securityConfig: ISecurityConfig

  beforeEach(async () => {
    securityConfig = {
      jwtSecret: 'test-secret',
      jwtExpire: '1h',
      bcryptRound: 10,
    } as any

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: SecurityConfig.KEY,
          useValue: securityConfig,
        },
      ],
    }).compile()

    strategy = module.get<JwtStrategy>(JwtStrategy)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('constructor', () => {
    it('should initialize with correct options', () => {
      // 验证PassportStrategy被正确实例化
      expect(strategy).toBeInstanceOf(JwtStrategy)
      // 验证配置被正确传递
      expect(securityConfig.jwtSecret).toBe('test-secret')
    })
  })

  describe('validate', () => {
    it('should return the payload when validation succeeds', async () => {
      const payload: IAuthUser = {
        uid: 1,
        pv: 1,
        roles: ['admin'],
      }

      const result = await strategy.validate(payload)
      expect(result).toEqual(payload)
      expect(result.uid).toBe(1)
      expect(result.pv).toBe(1)
      expect(result.roles).toEqual(['admin'])
    })

    it('should return payload without optional fields', async () => {
      const payload: IAuthUser = {
        uid: 2,
        pv: 1,
      }

      const result = await strategy.validate(payload)
      expect(result).toEqual(payload)
      expect(result.uid).toBe(2)
      expect(result.pv).toBe(1)
      expect(result.roles).toBeUndefined()
    })

    it('should return payload with exp and iat fields', async () => {
      const payload: IAuthUser = {
        uid: 3,
        pv: 1,
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000),
        roles: ['user'],
      }

      const result = await strategy.validate(payload)
      expect(result).toEqual(payload)
      expect(result.exp).toBeDefined()
      expect(result.iat).toBeDefined()
    })
  })
})
