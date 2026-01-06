import { Test, TestingModule } from '@nestjs/testing'

import { AuthService } from '../auth.service'
import { AuthStrategy } from '../auth.constant'
import { LocalStrategy } from './local.strategy'

describe('LocalStrategy', () => {
  let strategy: LocalStrategy
  let authService: AuthService

  beforeEach(async () => {
    authService = {
      validateUser: vi.fn(),
    } as any

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        {
          provide: AuthService,
          useValue: authService,
        },
      ],
    }).compile()

    strategy = module.get<LocalStrategy>(LocalStrategy)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('constructor', () => {
    it('should initialize with correct options', () => {
      expect(strategy).toBeInstanceOf(LocalStrategy)
    })
  })

  describe('validate', () => {
    it('should return user when validation succeeds', async () => {
      const mockUser = { uid: 1, username: 'admin', pv: 1 }
      vi.spyOn(authService, 'validateUser').mockResolvedValue(mockUser)

      const result = await strategy.validate('admin', 'password')
      expect(result).toEqual(mockUser)
      expect(authService.validateUser).toHaveBeenCalledWith('admin', 'password')
    })

    it('should return null when validation fails', async () => {
      vi.spyOn(authService, 'validateUser').mockResolvedValue(null)

      const result = await strategy.validate('invalid', 'wrong')
      expect(result).toBeNull()
      expect(authService.validateUser).toHaveBeenCalledWith('invalid', 'wrong')
    })

    it('should throw exception when authService throws', async () => {
      const error = new Error('Validation failed')
      vi.spyOn(authService, 'validateUser').mockRejectedValue(error)

      await expect(strategy.validate('test', 'password')).rejects.toThrow(error)
      expect(authService.validateUser).toHaveBeenCalledWith('test', 'password')
    })
  })
})
