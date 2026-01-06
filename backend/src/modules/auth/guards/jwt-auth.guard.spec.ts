import { ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import Redis from 'ioredis'

import { BusinessException } from '~/common/exceptions/biz.exception'
import { AuthService } from '../auth.service'
import { AuthStrategy, PUBLIC_KEY } from '../auth.constant'
import { TokenService } from '../services/token.service'
import { JwtAuthGuard } from './jwt-auth.guard'

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard
  let reflector: Reflector
  let authService: AuthService
  let tokenService: TokenService
  let redis: Redis

  beforeEach(() => {
    reflector = {
      getAllAndOverride: vi.fn(),
    } as any

    authService = {
      getPasswordVersionByUid: vi.fn(),
      getTokenByUid: vi.fn(),
    } as any

    tokenService = {
      checkAccessToken: vi.fn(),
    } as any

    redis = {
      get: vi.fn(),
    } as any

    guard = new JwtAuthGuard(reflector, authService, tokenService, redis, {
      multiDeviceLogin: false,
    } as any)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('handleRequest', () => {
    it('should return user when no error and user exists', () => {
      const user = { uid: 1, pv: 1 }
      const result = guard.handleRequest(null, user, null)
      expect(result).toEqual(user)
    })

    it('should throw error when error exists', () => {
      const error = new Error('Auth error')
      expect(() => guard.handleRequest(error, null, null)).toThrow(error)
    })

    it('should throw UnauthorizedException when user is null', () => {
      expect(() => guard.handleRequest(null, null, null)).toThrow(UnauthorizedException)
    })
  })
})
