import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { BusinessException } from '~/common/exceptions/biz.exception'
import { ErrorEnum } from '~/constants/error-code.constant'
import { DoctorEntity, DoctorStatus } from './doctor.entity'
import { DoctorService } from './doctor.service'
import { DoctorController } from './doctor.controller'

// Mock the DoctorService
const mockDoctorService = {
  findAll: jest.fn().mockResolvedValue([]),
  create: jest
    .fn()
    .mockResolvedValue({ id: 1, doctorCode: 'DOC001', name: '张三' } as DoctorEntity),
  findOne: jest
    .fn()
    .mockResolvedValue({ id: 1, doctorCode: 'DOC001', name: '张三' } as DoctorEntity),
  update: jest.fn().mockResolvedValue(undefined),
  changePassword: jest.fn().mockResolvedValue(undefined),
  remove: jest.fn().mockResolvedValue(undefined),
}

describe('DoctorController', () => {
  let app: INestApplication
  let doctorService: jest.Mocked<DoctorService>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DoctorController],
      providers: [
        {
          provide: DoctorService,
          useValue: mockDoctorService,
        },
        {
          provide: getRepositoryToken(DoctorEntity),
          useValue: {
            find: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
          } as Partial<Repository<DoctorEntity>>,
        },
      ],
    }).compile()

    app = module.createNestApplication()
    await app.init()

    doctorService = module.get(DoctorService) as jest.Mocked<DoctorService>
  })

  afterEach(async () => {
    await app.close()
    jest.clearAllMocks()
  })

  describe('GET /doctors', () => {
    it('should return all doctors', async () => {
      const mockDoctors = [
        { id: 1, doctorCode: 'DOC001', name: '张三', status: DoctorStatus.ACTIVE } as DoctorEntity,
        { id: 2, doctorCode: 'DOC002', name: '李四', status: DoctorStatus.ACTIVE } as DoctorEntity,
      ]
      doctorService.findAll.mockResolvedValue(mockDoctors)

      const response = await request(app.getHttpServer()).get('/doctors').expect(200)

      expect(response.body).toBeDefined()
      expect(doctorService.findAll).toHaveBeenCalled()
    })

    it('should return doctors with query parameters', async () => {
      const mockDoctors = [
        { id: 1, doctorCode: 'DOC001', name: '张三', status: DoctorStatus.ACTIVE } as DoctorEntity,
      ]
      doctorService.findAll.mockResolvedValue(mockDoctors)

      const response = await request(app.getHttpServer()).get('/doctors?name=张三').expect(200)

      expect(response.body).toBeDefined()
      expect(doctorService.findAll).toHaveBeenCalledWith(expect.objectContaining({ name: '张三' }))
    })

    it('should handle service errors', async () => {
      doctorService.findAll.mockRejectedValue(new Error('Internal server error'))

      await request(app.getHttpServer()).get('/doctors').expect(500)
    })
  })

  describe('POST /doctors', () => {
    it('should create a new doctor', async () => {
      const createDto = {
        doctorCode: 'DOC001',
        name: '张三',
        gender: '男',
        title: '主任医师',
        practiceType: '临床',
        practiceScope: '内科',
        departmentId: 1,
        contactPerson: '张三',
      }

      const response = await request(app.getHttpServer())
        .post('/doctors')
        .send(createDto)
        .expect(201)

      expect(response.body).toBeDefined()
      expect(doctorService.create).toHaveBeenCalledWith(createDto)
    })

    it('should handle validation errors', async () => {
      const createDto = {
        // Missing required fields
        name: '张三',
      }

      await request(app.getHttpServer()).post('/doctors').send(createDto).expect(400)
    })

    it('should handle duplicate doctor code', async () => {
      const createDto = {
        doctorCode: 'DOC001',
        name: '张三',
        gender: '男',
        title: '主任医师',
        practiceType: '临床',
        practiceScope: '内科',
        departmentId: 1,
        contactPerson: '张三',
      }

      doctorService.create.mockRejectedValue(new BusinessException(ErrorEnum.DATA_ALREADY_EXISTS))

      await request(app.getHttpServer()).post('/doctors').send(createDto).expect(400)
    })
  })

  describe('GET /doctors/:id', () => {
    it('should return doctor by id', async () => {
      const mockDoctor = { id: 1, doctorCode: 'DOC001', name: '张三' } as DoctorEntity
      doctorService.findOne.mockResolvedValue(mockDoctor)

      const response = await request(app.getHttpServer()).get('/doctors/1').expect(200)

      expect(response.body).toBeDefined()
      expect(response.body.id).toBe(1)
      expect(doctorService.findOne).toHaveBeenCalledWith(1)
    })

    it('should return 404 when doctor not found', async () => {
      doctorService.findOne.mockRejectedValue(new BusinessException(ErrorEnum.DATA_NOT_FOUND))

      await request(app.getHttpServer()).get('/doctors/999').expect(404)
    })

    it('should handle invalid id', async () => {
      await request(app.getHttpServer()).get('/doctors/invalid').expect(400)
    })
  })

  describe('PUT /doctors/:id', () => {
    it('should update doctor successfully', async () => {
      const updateDto = {
        doctorCode: 'DOC001',
        name: '张三（更新）',
        gender: '男',
        title: '主任医师',
        practiceType: '临床',
        practiceScope: '内科',
        departmentId: 1,
        contactPerson: '张三',
      }

      const response = await request(app.getHttpServer())
        .put('/doctors/1')
        .send(updateDto)
        .expect(200)

      expect(response.body).toBeDefined()
      expect(doctorService.update).toHaveBeenCalledWith(1, updateDto)
    })

    it('should handle non-existent doctor', async () => {
      const updateDto = {
        doctorCode: 'DOC001',
        name: '张三（更新）',
        gender: '男',
        title: '主任医师',
        practiceType: '临床',
        practiceScope: '内科',
        departmentId: 1,
        contactPerson: '张三',
      }

      doctorService.update.mockRejectedValue(new BusinessException(ErrorEnum.DATA_NOT_FOUND))

      await request(app.getHttpServer()).put('/doctors/999').send(updateDto).expect(404)
    })

    it('should handle duplicate doctor code', async () => {
      const updateDto = {
        doctorCode: 'DOC002',
        name: '张三（更新）',
        gender: '男',
        title: '主任医师',
        practiceType: '临床',
        practiceScope: '内科',
        departmentId: 1,
        contactPerson: '张三',
      }

      doctorService.update.mockRejectedValue(new BusinessException(ErrorEnum.DATA_ALREADY_EXISTS))

      await request(app.getHttpServer()).put('/doctors/1').send(updateDto).expect(400)
    })
  })

  describe('PUT /doctors/:id/password', () => {
    it('should change password successfully', async () => {
      const changePasswordDto = {
        oldPassword: 'a123456',
        newPassword: 'new123456',
      }

      const response = await request(app.getHttpServer())
        .put('/doctors/1/password')
        .send(changePasswordDto)
        .expect(200)

      expect(response.body).toBeDefined()
      expect(doctorService.changePassword).toHaveBeenCalledWith(1, changePasswordDto)
    })

    it('should handle incorrect old password', async () => {
      const changePasswordDto = {
        oldPassword: 'wrong_password',
        newPassword: 'new123456',
      }

      doctorService.changePassword.mockRejectedValue(
        new BusinessException(ErrorEnum.PASSWORD_MISMATCH),
      )

      await request(app.getHttpServer())
        .put('/doctors/1/password')
        .send(changePasswordDto)
        .expect(400)
    })

    it('should handle non-existent doctor', async () => {
      const changePasswordDto = {
        oldPassword: 'a123456',
        newPassword: 'new123456',
      }

      doctorService.changePassword.mockRejectedValue(
        new BusinessException(ErrorEnum.DATA_NOT_FOUND),
      )

      await request(app.getHttpServer())
        .put('/doctors/999/password')
        .send(changePasswordDto)
        .expect(404)
    })
  })

  describe('DELETE /doctors/:id', () => {
    it('should delete doctor successfully', async () => {
      const response = await request(app.getHttpServer()).delete('/doctors/1').expect(200)

      expect(response.body).toBeDefined()
      expect(doctorService.remove).toHaveBeenCalledWith(1)
    })

    it('should handle non-existent doctor', async () => {
      doctorService.remove.mockRejectedValue(new BusinessException(ErrorEnum.DATA_NOT_FOUND))

      await request(app.getHttpServer()).delete('/doctors/999').expect(404)
    })

    it('should handle invalid id', async () => {
      await request(app.getHttpServer()).delete('/doctors/invalid').expect(400)
    })
  })
})
