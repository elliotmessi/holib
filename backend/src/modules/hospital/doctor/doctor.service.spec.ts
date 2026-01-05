import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { BusinessException } from '~/common/exceptions/biz.exception'
import { ErrorEnum } from '~/constants/error-code.constant'

import { DoctorEntity } from './doctor.entity'
import { CreateDoctorDto, UpdateDoctorDto, DoctorQueryDto, ChangePasswordDto } from './doctor.dto'
import { DoctorService } from './doctor.service'

describe('DoctorService', () => {
  let service: DoctorService
  let doctorRepository: jest.Mocked<Repository<DoctorEntity>>

  const mockDoctorEntity: Partial<DoctorEntity> = {
    id: 1,
    doctorCode: 'DOC001',
    name: '张三',
    gender: '男',
    title: '主任医师',
    practiceType: '临床',
    practiceScope: '内科',
    departmentId: 1,
    department: { id: 1, name: '内科' } as any,
    phone: '13800138000',
    email: 'zhangsan@example.com',
    passwordHash: 'hashed_password',
    salt: 'test_salt',
    status: 'active',
  }

  const mockDoctorRepository = {
    findOneBy: jest.fn().mockResolvedValue(undefined),
    create: jest.fn().mockReturnValue(mockDoctorEntity as DoctorEntity),
    save: jest.fn().mockResolvedValue(mockDoctorEntity as DoctorEntity),
    createQueryBuilder: jest.fn().mockReturnValue({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([mockDoctorEntity as DoctorEntity]),
    }),
    findOne: jest.fn().mockResolvedValue(mockDoctorEntity as DoctorEntity),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
  }

  beforeEach(async () => {
    jest.clearAllMocks()

    // Reset the mock functions to their default behavior
    mockDoctorRepository.findOne.mockResolvedValue(mockDoctorEntity as DoctorEntity)
    mockDoctorRepository.findOneBy.mockResolvedValue(undefined)

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DoctorService,
        {
          provide: getRepositoryToken(DoctorEntity),
          useValue: mockDoctorRepository,
        },
      ],
    }).compile()

    service = module.get<DoctorService>(DoctorService)
    doctorRepository = module.get(getRepositoryToken(DoctorEntity)) as jest.Mocked<
      Repository<DoctorEntity>
    >
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('should create a new doctor successfully with default password', async () => {
      const createDto: CreateDoctorDto = {
        doctorCode: 'DOC001',
        name: '张三',
        gender: '男',
        title: '主任医师',
        practiceType: '临床',
        practiceScope: '内科',
        departmentId: 1,
      }

      const result = await service.create(createDto)

      expect(result).toBeDefined()
      expect(doctorRepository.create).toHaveBeenCalled()
      expect(doctorRepository.save).toHaveBeenCalled()
      expect(result.doctorCode).toBe('DOC001')
    })

    it('should create a new doctor successfully with custom password', async () => {
      const createDto: CreateDoctorDto = {
        doctorCode: 'DOC001',
        name: '张三',
        gender: '男',
        title: '主任医师',
        practiceType: '临床',
        practiceScope: '内科',
        departmentId: 1,
        password: 'custom123',
      }

      const result = await service.create(createDto)

      expect(result).toBeDefined()
      expect(doctorRepository.create).toHaveBeenCalled()
      expect(doctorRepository.save).toHaveBeenCalled()
    })

    it('should throw error when doctor code already exists', async () => {
      const createDto: CreateDoctorDto = {
        doctorCode: 'DOC001',
        name: '张三',
        gender: '男',
        title: '主任医师',
        practiceType: '临床',
        practiceScope: '内科',
        departmentId: 1,
      }

      doctorRepository.findOneBy.mockResolvedValue(mockDoctorEntity as DoctorEntity)

      await expect(service.create(createDto)).rejects.toThrow(BusinessException)
      await expect(service.create(createDto)).rejects.toThrow('数据已存在')
    })
  })

  describe('findAll', () => {
    it('should return all doctors', async () => {
      const query: DoctorQueryDto = {}

      const result = await service.findAll(query)

      expect(result).toBeDefined()
      expect(result).toHaveLength(1)
      expect(doctorRepository.createQueryBuilder).toHaveBeenCalled()
    })

    it('should return filtered doctors by name', async () => {
      const query: DoctorQueryDto = {
        name: '张三',
      }

      const result = await service.findAll(query)

      expect(result).toBeDefined()
      expect(doctorRepository.createQueryBuilder).toHaveBeenCalled()
    })

    it('should return filtered doctors by doctorCode', async () => {
      const query: DoctorQueryDto = {
        doctorCode: 'DOC001',
      }

      const result = await service.findAll(query)

      expect(result).toBeDefined()
      expect(doctorRepository.createQueryBuilder).toHaveBeenCalled()
    })

    it('should return filtered doctors by departmentId', async () => {
      const query: DoctorQueryDto = {
        departmentId: 1,
      }

      const result = await service.findAll(query)

      expect(result).toBeDefined()
      expect(doctorRepository.createQueryBuilder).toHaveBeenCalled()
    })

    it('should return filtered doctors by title', async () => {
      const query: DoctorQueryDto = {
        title: '主任医师',
      }

      const result = await service.findAll(query)

      expect(result).toBeDefined()
      expect(doctorRepository.createQueryBuilder).toHaveBeenCalled()
    })

    it('should return filtered doctors by status', async () => {
      const query: DoctorQueryDto = {
        status: 'active',
      }

      const result = await service.findAll(query)

      expect(result).toBeDefined()
      expect(doctorRepository.createQueryBuilder).toHaveBeenCalled()
    })
  })

  describe('findOne', () => {
    it('should return doctor by id', async () => {
      const result = await service.findOne(1)

      expect(result).toBeDefined()
      expect(result.id).toBe(1)
      expect(result.name).toBe('张三')
      expect(doctorRepository.findOne).toHaveBeenCalled()
    })

    it('should throw error when doctor not found', async () => {
      doctorRepository.findOne.mockResolvedValue(undefined)

      await expect(service.findOne(999)).rejects.toThrow(BusinessException)
      await expect(service.findOne(999)).rejects.toThrow('数据不存在')
    })
  })

  describe('update', () => {
    it('should update doctor successfully', async () => {
      const updateDto: UpdateDoctorDto = {
        doctorCode: 'DOC001',
        name: '张三（更新）',
        gender: '男',
        title: '副主任医师',
        practiceType: '临床',
        practiceScope: '内科',
        departmentId: 2,
      }

      await service.update(1, updateDto)

      expect(doctorRepository.findOne).toHaveBeenCalled()
      expect(doctorRepository.save).toHaveBeenCalled()
    })

    it('should throw error when updating non-existent doctor', async () => {
      doctorRepository.findOne.mockResolvedValue(undefined)

      const updateDto: UpdateDoctorDto = {
        doctorCode: 'DOC001',
        name: '张三（更新）',
        gender: '男',
        title: '主任医师',
        practiceType: '临床',
        practiceScope: '内科',
        departmentId: 1,
      }

      await expect(service.update(999, updateDto)).rejects.toThrow(BusinessException)
      await expect(service.update(999, updateDto)).rejects.toThrow('数据不存在')
    })

    it('should throw error when doctor code already exists', async () => {
      const updateDto: UpdateDoctorDto = {
        doctorCode: 'DOC002',
        name: '张三',
        gender: '男',
        title: '主任医师',
        practiceType: '临床',
        practiceScope: '内科',
        departmentId: 1,
      }

      doctorRepository.findOne.mockResolvedValue(mockDoctorEntity as DoctorEntity)
      doctorRepository.findOneBy.mockResolvedValue(mockDoctorEntity as DoctorEntity)

      await expect(service.update(1, updateDto)).rejects.toThrow(BusinessException)
      await expect(service.update(1, updateDto)).rejects.toThrow('数据已存在')
    })

    it('should update doctor without changing doctorCode', async () => {
      const updateDto: UpdateDoctorDto = {
        doctorCode: 'DOC001',
        name: '张三（更新）',
        gender: '男',
        title: '主任医师',
        practiceType: '临床',
        practiceScope: '内科',
        departmentId: 1,
      }

      doctorRepository.findOne.mockResolvedValue(mockDoctorEntity as DoctorEntity)
      doctorRepository.findOneBy.mockResolvedValue(undefined)

      await service.update(1, updateDto)

      expect(doctorRepository.findOne).toHaveBeenCalled()
      expect(doctorRepository.save).toHaveBeenCalled()
    })
  })

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      const changePasswordDto: ChangePasswordDto = {
        oldPassword: 'a123456',
        newPassword: 'new123456',
      }

      // Mock the password hash to match
      jest.spyOn(service as any, 'hashPassword').mockReturnValue('hashed_password')

      await service.changePassword(1, changePasswordDto)

      expect(doctorRepository.findOne).toHaveBeenCalled()
      expect(doctorRepository.save).toHaveBeenCalled()
    })

    it('should throw error when old password is incorrect', async () => {
      const changePasswordDto: ChangePasswordDto = {
        oldPassword: 'wrong_password',
        newPassword: 'new123456',
      }

      // Mock the password hash to not match
      jest
        .spyOn(service as any, 'hashPassword')
        .mockReturnValueOnce('wrong_hash')
        .mockReturnValue('new_hash')

      await expect(service.changePassword(1, changePasswordDto)).rejects.toThrow(BusinessException)
      await expect(service.changePassword(1, changePasswordDto)).rejects.toThrow(
        '旧密码与原密码不一致',
      )
    })

    it('should throw error when doctor not found', async () => {
      doctorRepository.findOne.mockResolvedValue(undefined)

      const changePasswordDto: ChangePasswordDto = {
        oldPassword: 'a123456',
        newPassword: 'new123456',
      }

      await expect(service.changePassword(999, changePasswordDto)).rejects.toThrow(
        BusinessException,
      )
      await expect(service.changePassword(999, changePasswordDto)).rejects.toThrow('数据不存在')
    })
  })

  describe('remove', () => {
    it('should delete doctor successfully', async () => {
      await service.remove(1)

      expect(doctorRepository.findOne).toHaveBeenCalled()
      expect(doctorRepository.delete).toHaveBeenCalled()
    })

    it('should throw error when deleting non-existent doctor', async () => {
      doctorRepository.findOne.mockResolvedValue(undefined)

      await expect(service.remove(999)).rejects.toThrow(BusinessException)
      await expect(service.remove(999)).rejects.toThrow('数据不存在')
    })
  })

  describe('validatePassword', () => {
    it('should return true when password is correct', async () => {
      // Mock the password hash to match
      jest.spyOn(service as any, 'hashPassword').mockReturnValue('hashed_password')

      const result = await service.validatePassword(1, 'a123456')

      expect(result).toBeTruthy()
      expect(doctorRepository.findOne).toHaveBeenCalled()
    })

    it('should return false when password is incorrect', async () => {
      // Mock the password hash to not match
      jest.spyOn(service as any, 'hashPassword').mockReturnValue('wrong_hash')

      const result = await service.validatePassword(1, 'wrong_password')

      expect(result).toBeFalsy()
      expect(doctorRepository.findOne).toHaveBeenCalled()
    })

    it('should throw error when doctor not found', async () => {
      doctorRepository.findOne.mockResolvedValue(undefined)

      await expect(service.validatePassword(999, 'a123456')).rejects.toThrow(BusinessException)
      await expect(service.validatePassword(999, 'a123456')).rejects.toThrow('数据不存在')
    })
  })
})
