import { Test, TestingModule } from '@nestjs/testing'
import { getEntityManagerToken, getRepositoryToken } from '@nestjs/typeorm'
import { Redis } from 'ioredis'

import { Repository } from 'typeorm'
import { REDIS_CLIENT } from '~/common/decorators/inject-redis.decorator'
import { BusinessException } from '~/common/exceptions/biz.exception'
import { ParamConfigService } from '~/modules/system/param-config/param-config.service'

import { RoleEntity } from '~/modules/system/role/role.entity'
import { QQService } from '~/shared/helper/qq.service'
import { PasswordUpdateDto } from './dto/password.dto'
import { UserEntity } from './user.entity'
import { UserService } from './user.service'

describe('userService', () => {
  let service: UserService
  let userRepository: Repository<UserEntity>
  let roleRepository: Repository<RoleEntity>
  let redis: jest.Mocked<Redis>

  const mockUser: Partial<UserEntity> & { psalt: string } = {
    id: 1,
    username: 'admin',
    password: '207acd61a3c1bd506d7e9a4535359f8a',
    psalt: 'salt',
    status: 1,
    nickname: '管理员',
    email: 'admin@example.com',
    phone: '13800138000',
  }

  const mockRedis = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  }

  const mockQQService = {
    getAvater: jest.fn().mockResolvedValue('https://example.com/avatar.jpg'),
  }

  const mockParamConfigService = {
    findValueByKey: jest.fn().mockResolvedValue('123456'),
  }

  beforeEach(async () => {
    jest.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOneBy: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            findBy: jest.fn(),
            save: jest.fn().mockResolvedValue({ id: 3 }),
            create: jest.fn().mockReturnValue({ id: 3 }),
            update: jest.fn().mockResolvedValue({ affected: 1 } as any),
            delete: jest.fn().mockResolvedValue({ affected: 1 } as any),
            createQueryBuilder: jest.fn(() => ({
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              take: jest.fn().mockReturnThis(),
              skip: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(mockUser),
              getMany: jest.fn().mockResolvedValue([mockUser]),
            })),
          },
        },
        {
          provide: getRepositoryToken(RoleEntity),
          useValue: {
            findBy: jest.fn().mockResolvedValue([]),
          },
        },
        {
          provide: getEntityManagerToken(),
          useValue: {
            transaction: jest.fn().mockImplementation(async (_, callback) => {
              const txEntityManager = {
                create: jest.fn().mockReturnValue({}),
                save: jest.fn().mockResolvedValue({ id: 1 }),
                update: jest.fn().mockResolvedValue(undefined),
              }
              return callback(txEntityManager)
            }),
            createQueryBuilder: jest.fn().mockReturnValue({
              relation: jest.fn().mockReturnValue({
                of: jest.fn().mockReturnValue({
                  addAndRemove: jest.fn().mockResolvedValue(undefined),
                }),
              }),
            }),
          },
        },
        {
          provide: REDIS_CLIENT,
          useValue: mockRedis,
        },
        {
          provide: ParamConfigService,
          useValue: mockParamConfigService,
        },
        {
          provide: QQService,
          useValue: mockQQService,
        },
      ],
    }).compile()

    service = module.get<UserService>(UserService)
    userRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity))
    roleRepository = module.get<Repository<RoleEntity>>(getRepositoryToken(RoleEntity))
    redis = module.get(REDIS_CLIENT)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('findUserById', () => {
    it('should return user when user exists and is enabled', async () => {
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockUser),
      }
      userRepository.createQueryBuilder = jest.fn().mockReturnValue(mockQueryBuilder)

      const result = await service.findUserById(1)

      expect(result).toBeDefined()
      expect(result?.username).toBe('admin')
    })

    it('should return undefined when user not found', async () => {
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(undefined),
      }
      userRepository.createQueryBuilder = jest.fn().mockReturnValue(mockQueryBuilder)

      const result = await service.findUserById(999)

      expect(result).toBeUndefined()
    })
  })

  describe('findUserByUserName', () => {
    it('should return user when username exists and is enabled', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockUser),
      }
      userRepository.createQueryBuilder = jest.fn().mockReturnValue(mockQueryBuilder)

      const result = await service.findUserByUserName('admin')

      expect(result).toBeDefined()
      expect(result?.username).toBe('admin')
    })

    it('should return undefined when username not found', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(undefined),
      }
      userRepository.createQueryBuilder = jest.fn().mockReturnValue(mockQueryBuilder)

      const result = await service.findUserByUserName('nonexistent')

      expect(result).toBeUndefined()
    })
  })

  describe('getAccountInfo', () => {
    it('should return account info when user exists', async () => {
      const userWithRoles = { ...mockUser, roles: [] }
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(userWithRoles),
      }
      userRepository.createQueryBuilder = jest.fn().mockReturnValue(mockQueryBuilder)

      const result = await service.getAccountInfo(1)

      expect(result).toBeDefined()
      expect(result.username).toBe('admin')
    })

    it('should throw error when user not found', async () => {
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(undefined),
      }
      userRepository.createQueryBuilder = jest.fn().mockReturnValue(mockQueryBuilder)

      await expect(service.getAccountInfo(999))
        .rejects
        .toThrow(BusinessException)
    })
  })

  describe('updatePassword', () => {
    it('should update password successfully when old password is correct', async () => {
      userRepository.findOneBy = jest.fn().mockResolvedValue(mockUser)
      userRepository.update = jest.fn().mockResolvedValue({ affected: 1 } as any)
      mockRedis.get.mockResolvedValue('1')
      mockRedis.set.mockResolvedValue('1')

      const dto: PasswordUpdateDto = {
        oldPassword: '123456',
        newPassword: 'NewTest123',
      }

      await expect(service.updatePassword(1, dto)).resolves.not.toThrow()
    })

    it('should throw error when old password is incorrect', async () => {
      userRepository.findOneBy = jest.fn().mockResolvedValue(mockUser)

      const dto: PasswordUpdateDto = {
        oldPassword: 'wrongpassword',
        newPassword: 'NewTest123',
      }

      await expect(service.updatePassword(1, dto))
        .rejects
        .toThrow(BusinessException)
    })
  })

  describe('exist', () => {
    it('should return true when user exists', async () => {
      userRepository.findOneBy = jest.fn().mockResolvedValue(mockUser)

      const result = await service.exist('admin')

      expect(result).toBe(true)
    })

    it('should throw error when user does not exist', async () => {
      userRepository.findOneBy = jest.fn().mockResolvedValue(undefined)

      await expect(service.exist('nonexistent'))
        .rejects
        .toThrow(BusinessException)
    })
  })
})
