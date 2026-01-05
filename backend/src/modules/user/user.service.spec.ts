import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import Redis from 'ioredis'

import { EntityManager, In, Like, Repository } from 'typeorm'

import { md5 } from '~/utils'

import { InjectRedis, REDIS_CLIENT } from '~/common/decorators/inject-redis.decorator'
import { BusinessException } from '~/common/exceptions/biz.exception'
import { ErrorEnum } from '~/constants/error-code.constant'
import { ROOT_ROLE_ID } from '~/constants/system.constant'
import { QQService } from '~/shared/helper/qq.service'

import { AccessTokenEntity } from '../auth/entities/access-token.entity'
import { DeptEntity } from '../system/dept/dept.entity'
import { ParamConfigService } from '../system/param-config/param-config.service'
import { RoleEntity } from '../system/role/role.entity'

import { UserStatus } from './constant'
import { UserDto, UserUpdateDto } from './dto/user.dto'
import { UserEntity } from './user.entity'
import { UserService } from './user.service'

describe('UserService', () => {
  let service: UserService
  let userRepository: jest.Mocked<Repository<UserEntity>>
  let roleRepository: jest.Mocked<Repository<RoleEntity>>
  let entityManager: jest.Mocked<EntityManager>
  let redis: jest.Mocked<Redis>
  let paramConfigService: jest.Mocked<ParamConfigService>

  const mockUserEntity: Partial<UserEntity> = {
    id: 1,
    username: 'admin',
    password: '207acd61a3c1bd506d7e9a4535359f8a',
    psalt: 'salt',
    status: UserStatus.Enabled,
    nickname: '管理员',
    email: 'admin@example.com',
    phone: '13800138000',
    avatar: 'https://example.com/avatar.jpg',
    qq: '123456',
    remark: '系统管理员',
    createdAt: new Date(),
    updatedAt: new Date(),
    dept: {
      id: 1,
      name: '技术部',
      parent: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any,
    roles: [
      {
        id: ROOT_ROLE_ID,
        name: '超级管理员',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any,
    ],
  }

  const mockRedis = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  }

  const mockUserRepository = {
    createQueryBuilder: jest.fn().mockReturnValue({
      where: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      offset: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(mockUserEntity),
      getManyAndCount: jest.fn().mockResolvedValue([[mockUserEntity], 1]),
    }),
    findOneBy: jest.fn().mockResolvedValue(mockUserEntity),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
    findBy: jest.fn().mockResolvedValue([mockUserEntity.roles[0]]),
  }

  const mockRoleRepository = {
    findBy: jest.fn().mockResolvedValue([mockUserEntity.roles[0]]),
    findOneBy: jest.fn().mockResolvedValue(mockUserEntity.roles[0]),
  }

  const mockEntityManager = {
    transaction: jest.fn().mockImplementation(async (callback) => {
      return callback({
        create: jest.fn().mockReturnValue(mockUserEntity),
        save: jest.fn().mockResolvedValue(mockUserEntity),
        update: jest.fn().mockResolvedValue({ affected: 1 }),
        findOneBy: jest.fn().mockResolvedValue({ id: 1 } as any),
        createQueryBuilder: jest.fn().mockReturnValue({
          leftJoinAndSelect: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          relation: jest.fn().mockReturnValue({
            of: jest.fn().mockReturnValue({
              addAndRemove: jest.fn().mockResolvedValue(undefined),
              set: jest.fn().mockResolvedValue(undefined),
            }),
          }),
          getOne: jest.fn().mockResolvedValue(mockUserEntity),
        }),
      } as any)
    }),
  }

  const mockParamConfigService = {
    findValueByKey: jest.fn().mockResolvedValue('123456'),
  }

  const mockQQService = {
    getAvater: jest.fn().mockResolvedValue('https://example.com/qq-avatar.jpg'),
  }

  beforeEach(async () => {
    jest.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(RoleEntity),
          useValue: mockRoleRepository,
        },
        {
          provide: QQService,
          useValue: mockQQService,
        },
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
        {
          provide: REDIS_CLIENT,
          useValue: mockRedis,
        },
        {
          provide: ParamConfigService,
          useValue: mockParamConfigService,
        },
      ],
    }).compile()

    service = module.get<UserService>(UserService)
    userRepository = module.get(getRepositoryToken(UserEntity)) as jest.Mocked<
      Repository<UserEntity>
    >
    roleRepository = module.get(getRepositoryToken(RoleEntity)) as jest.Mocked<
      Repository<RoleEntity>
    >
    entityManager = module.get(EntityManager) as jest.Mocked<EntityManager>
    redis = module.get(REDIS_CLIENT) as jest.Mocked<Redis>
    paramConfigService = module.get(ParamConfigService) as jest.Mocked<ParamConfigService>
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('findUserById', () => {
    it('should return user when user exists and is enabled', async () => {
      const result = await service.findUserById(1)

      expect(result).toEqual(mockUserEntity)
      expect(userRepository.createQueryBuilder).toHaveBeenCalled()
    })

    it('should return undefined when user does not exist', async () => {
      mockUserRepository.createQueryBuilder = jest.fn().mockReturnValue({
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(undefined),
      } as any)

      const result = await service.findUserById(999)

      expect(result).toBeUndefined()
    })
  })

  describe('findUserByUserName', () => {
    it('should return user when username exists and user is enabled', async () => {
      mockUserRepository.createQueryBuilder = jest.fn().mockReturnValue({
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockUserEntity),
      } as any)

      const result = await service.findUserByUserName('admin')

      expect(result).toEqual(mockUserEntity)
      expect(userRepository.createQueryBuilder).toHaveBeenCalled()
    })

    it('should return undefined when username does not exist', async () => {
      mockUserRepository.createQueryBuilder = jest.fn().mockReturnValue({
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(undefined),
      } as any)

      const result = await service.findUserByUserName('nonexistent')

      expect(result).toBeUndefined()
    })
  })

  describe('getAccountInfo', () => {
    it('should return account info when user exists', async () => {
      mockUserRepository.createQueryBuilder = jest.fn().mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockUserEntity),
      } as any)

      const result = await service.getAccountInfo(1)

      expect(result).toBeDefined()
      expect(result.username).toBe('admin')
    })

    it('should throw error when user does not exist', async () => {
      mockUserRepository.createQueryBuilder = jest.fn().mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(undefined),
      } as any)

      await expect(service.getAccountInfo(999)).rejects.toThrow(BusinessException)
    })
  })

  describe('create', () => {
    it('should create a new user', async () => {
      const dto: UserDto = {
        username: 'testuser',
        password: 'Test123456',
        nickname: '测试用户',
        email: 'test@example.com',
        phone: '13800138000',
        status: UserStatus.Enabled,
        roleIds: [1],
        deptId: 1,
      }

      userRepository.findOneBy.mockResolvedValue(undefined)

      await service.create(dto)

      expect(entityManager.transaction).toHaveBeenCalled()
    })

    it('should throw error when username already exists', async () => {
      const dto: UserDto = {
        username: 'admin',
        password: 'Test123456',
        nickname: '测试用户',
        email: 'test@example.com',
        phone: '13800138000',
        status: UserStatus.Enabled,
        roleIds: [1],
        deptId: 1,
      }

      mockUserRepository.findOneBy.mockResolvedValue(mockUserEntity as any)

      await expect(service.create(dto)).rejects.toThrow(BusinessException)
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ username: 'admin' })
    })
  })

  describe('update', () => {
    it('should update an existing user', async () => {
      const dto: UserUpdateDto = {
        nickname: '更新后的管理员',
        email: 'updated@example.com',
        status: UserStatus.Enabled,
        roleIds: [1],
        deptId: 1,
      }

      await service.update(1, dto)

      expect(entityManager.transaction).toHaveBeenCalled()
    })

    it('should handle password update when password is provided', async () => {
      const dto: UserUpdateDto = {
        password: 'NewPassword123',
      }

      await service.update(1, dto)

      expect(entityManager.transaction).toHaveBeenCalled()
    })

    it('should forbidden user when status is set to disabled', async () => {
      const dto: UserUpdateDto = {
        status: UserStatus.Disable,
      }

      await service.update(1, dto)

      expect(entityManager.transaction).toHaveBeenCalled()
    })
  })

  describe('delete', () => {
    it('should delete users when they are not root user', async () => {
      mockUserRepository.createQueryBuilder = jest.fn().mockReturnValue({
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue({ id: 2 } as UserEntity),
      } as any)

      await service.delete([2, 3])

      expect(userRepository.delete).toHaveBeenCalledWith([2, 3])
    })

    it('should throw error when trying to delete root user', async () => {
      mockUserRepository.createQueryBuilder = jest.fn().mockReturnValue({
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockUserEntity),
      } as any)

      await expect(service.delete([1])).rejects.toThrow()
    })
  })

  describe('updatePassword', () => {
    it('should update password when old password is correct', async () => {
      mockUserRepository.findOneBy = jest
        .fn()
        .mockResolvedValue({ ...mockUserEntity, psalt: 'salt', password: md5('123456salt') })

      const dto = {
        oldPassword: '123456',
        newPassword: 'NewPassword123',
      }

      await service.updatePassword(1, dto)

      expect(userRepository.update).toHaveBeenCalled()
    })

    it('should throw error when old password is incorrect', async () => {
      mockUserRepository.findOneBy = jest
        .fn()
        .mockResolvedValue({ ...mockUserEntity, psalt: 'salt', password: md5('123456salt') })

      const dto = {
        oldPassword: 'wrongpassword',
        newPassword: 'NewPassword123',
      }

      await expect(service.updatePassword(1, dto)).rejects.toThrow(BusinessException)
    })
  })

  describe('forceUpdatePassword', () => {
    it('should update password directly without old password', async () => {
      await service.forceUpdatePassword(1, 'NewPassword123')

      expect(userRepository.update).toHaveBeenCalled()
    })
  })

  describe('list', () => {
    it('should return paginated user list', async () => {
      mockUserRepository.createQueryBuilder = jest.fn().mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[mockUserEntity], 1]),
      })

      const result = await service.list({
        page: 1,
        pageSize: 10,
      })

      expect(result).toBeDefined()
      expect(userRepository.createQueryBuilder).toHaveBeenCalled()
    })

    it('should return filtered user list by username', async () => {
      mockUserRepository.createQueryBuilder = jest.fn().mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[mockUserEntity], 1]),
      })

      const result = await service.list({
        page: 1,
        pageSize: 10,
        username: 'admin',
      })

      expect(result).toBeDefined()
      expect(userRepository.createQueryBuilder).toHaveBeenCalled()
    })

    it('should return filtered user list by department', async () => {
      mockUserRepository.createQueryBuilder = jest.fn().mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[mockUserEntity], 1]),
      })

      const result = await service.list({
        page: 1,
        pageSize: 10,
        deptId: 1,
      })

      expect(result).toBeDefined()
      expect(userRepository.createQueryBuilder).toHaveBeenCalled()
    })
  })

  describe('forbidden', () => {
    it('should forbidden a user by uid', async () => {
      await service.forbidden(1)

      expect(redis.del).toHaveBeenCalledTimes(3)
    })

    it('should forbidden a user with accessToken', async () => {
      AccessTokenEntity.findOne = jest.fn().mockResolvedValue({ id: 'token-1' } as any)
      redis.del = jest.fn().mockResolvedValue(1)

      await service.forbidden(1, 'mock-access-token')

      expect(redis.del).toHaveBeenCalled()
    })
  })

  describe('multiForbidden', () => {
    it('should forbidden multiple users at once', async () => {
      await service.multiForbidden([1, 2, 3])

      expect(redis.del).toHaveBeenCalledTimes(3)
    })

    it('should do nothing when uids is empty', async () => {
      await service.multiForbidden([])

      expect(redis.del).not.toHaveBeenCalled()
    })
  })

  describe('exist', () => {
    it('should return true when username exists', async () => {
      const result = await service.exist('admin')

      expect(result).toBe(true)
    })

    it('should throw error when username does not exist', async () => {
      userRepository.findOneBy.mockResolvedValue(undefined)

      await expect(service.exist('nonexistent')).rejects.toThrow(BusinessException)
    })
  })
})
