import { Test, TestingModule } from '@nestjs/testing'
import { Redis } from 'ioredis'
import { REDIS_CLIENT } from '~/common/decorators/inject-redis.decorator'
import { CaptchaService } from '~/modules/auth/services/captcha.service'
import { CaptchaLogService } from '~/modules/system/log/services/captcha-log.service'

describe('captchaService', () => {
  let service: CaptchaService
  let redis: Mocked<Redis>
  let captchaLogService: Mocked<CaptchaLogService>

  const mockRedis = {
    get: vi.fn(),
    set: vi.fn(),
    del: vi.fn(),
  }

  const mockCaptchaLogService = {
    create: vi.fn(),
  }

  beforeEach(async () => {
    vi.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CaptchaService,
        {
          provide: REDIS_CLIENT,
          useValue: mockRedis,
        },
        {
          provide: CaptchaLogService,
          useValue: mockCaptchaLogService,
        },
      ],
    }).compile()

    service = module.get<CaptchaService>(CaptchaService)
    redis = module.get(REDIS_CLIENT)
    captchaLogService = module.get(CaptchaLogService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('checkImgCaptcha', () => {
    it('should pass when captcha is correct', async () => {
      const key = 'test-key'
      const value = 'abcd1234'
      mockRedis.get.mockResolvedValue(value)

      await expect(service.checkImgCaptcha(key, value)).resolves.not.toThrow()
      expect(mockRedis.get).toHaveBeenCalled()
      expect(mockRedis.del).toHaveBeenCalled()
    })

    it('should throw error when captcha is incorrect', async () => {
      const key = 'test-key'
      const value = 'wrong'
      const correctValue = 'abcd1234'
      mockRedis.get.mockResolvedValue(correctValue)

      await expect(service.checkImgCaptcha(key, value)).rejects.toThrow()
    })

    it('should throw error when captcha is expired', async () => {
      const key = 'test-key'
      const value = 'abcd1234'
      mockRedis.get.mockResolvedValue(null)

      await expect(service.checkImgCaptcha(key, value)).rejects.toThrow()
    })

    it('should be case insensitive', async () => {
      const key = 'test-key'
      const value = 'ABCD1234'
      const storedValue = 'abcd1234'
      mockRedis.get.mockResolvedValue(storedValue)

      await expect(service.checkImgCaptcha(key, value)).resolves.not.toThrow()
    })
  })

  describe('log', () => {
    it('should call captchaLogService.create with correct params', async () => {
      const account = 'test@example.com'
      const code = '123456'
      const provider: 'sms' | 'email' = 'email'
      const uid = 1

      await service.log(account, code, provider, uid)

      expect(mockCaptchaLogService.create).toHaveBeenCalledWith(account, code, provider, uid)
    })

    it('should call captchaLogService.create without uid', async () => {
      const account = '13800138000'
      const code = '123456'
      const provider: 'sms' | 'email' = 'sms'

      await service.log(account, code, provider)

      expect(mockCaptchaLogService.create).toHaveBeenCalledWith(account, code, provider, undefined)
    })
  })
})
