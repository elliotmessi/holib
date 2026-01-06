import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { vi, afterEach, beforeEach, describe, expect, it } from 'vitest'

import { PatientController } from './patient.controller'
import { PatientEntity } from './patient.entity'
import { CreatePatientDto, UpdatePatientDto, PatientQueryDto } from './patient.dto'
import { PatientService } from './patient.service'
import { AllExceptionsFilter } from '~/common/filters/any-exception.filter'
import { BusinessException } from '~/common/exceptions/biz.exception'
import { ErrorEnum } from '~/constants/error-code.constant'

describe('PatientController', () => {
  let app: INestApplication
  let patientService: any

  const mockPatientService = {
    findAll: vi.fn().mockResolvedValue([]),
    findByMedicalRecordNumber: vi.fn().mockResolvedValue({ id: 1, name: '张三' } as PatientEntity),
    findByIdCard: vi.fn().mockResolvedValue({ id: 1, name: '张三' } as PatientEntity),
    create: vi.fn().mockResolvedValue({ id: 1, name: '张三' } as PatientEntity),
    findOne: vi.fn().mockResolvedValue({ id: 1, name: '张三' } as PatientEntity),
    update: vi.fn().mockResolvedValue(undefined),
    updateDiagnosis: vi.fn().mockResolvedValue(undefined),
    updateAllergyHistory: vi.fn().mockResolvedValue(undefined),
    remove: vi.fn().mockResolvedValue(undefined),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PatientController],
      providers: [
        {
          provide: PatientService,
          useValue: mockPatientService,
        },
        {
          provide: getRepositoryToken(PatientEntity),
          useValue: {
            find: vi.fn(),
            save: vi.fn(),
            findOne: vi.fn(),
            delete: vi.fn(),
          } as Partial<Repository<PatientEntity>>,
        },
      ],
    }).compile()

    app = module.createNestApplication()

    app.useGlobalPipes(
      new (require('@nestjs/common').ValidationPipe)({
        transform: true,
        whitelist: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    )

    app.useGlobalFilters(new AllExceptionsFilter())

    await app.init()

    patientService = module.get(PatientService)
  })

  afterEach(async () => {
    if (app) {
      await app.close()
    }
    vi.clearAllMocks()
  })

  describe('GET /patients', () => {
    it('should return all patients', async () => {
      const mockPatients = [
        { id: 1, name: '张三' } as PatientEntity,
        { id: 2, name: '李四' } as PatientEntity,
      ]
      patientService.findAll.mockResolvedValue(mockPatients)

      const response = await request(app.getHttpServer()).get('/patients').expect(200)

      expect(response.body).toBeDefined()
      expect(patientService.findAll).toHaveBeenCalled()
    })

    it('should return patients with query parameters', async () => {
      const mockPatients = [{ id: 1, name: '张三' } as PatientEntity]
      patientService.findAll.mockResolvedValue(mockPatients)

      const query: PatientQueryDto = { name: '张三' }
      const response = await request(app.getHttpServer()).get('/patients').query(query).expect(200)

      expect(response.body).toBeDefined()
      expect(patientService.findAll).toHaveBeenCalledWith(query)
    })

    it('should handle service errors', async () => {
      patientService.findAll.mockRejectedValue(new BusinessException(ErrorEnum.SERVER_ERROR))

      await request(app.getHttpServer()).get('/patients').expect(500)
    })
  })

  describe('GET /patients/by-mrn/:medicalRecordNumber', () => {
    it('should return patient by medical record number', async () => {
      const mockPatient = { id: 1, name: '张三' } as PatientEntity
      patientService.findByMedicalRecordNumber.mockResolvedValue(mockPatient)

      const response = await request(app.getHttpServer()).get('/patients/by-mrn/MRN001').expect(200)

      expect(response.body).toBeDefined()
      expect(response.body.id).toBe(1)
      expect(patientService.findByMedicalRecordNumber).toHaveBeenCalledWith('MRN001')
    })

    it('should handle patient not found', async () => {
      patientService.findByMedicalRecordNumber.mockRejectedValue(
        new BusinessException(ErrorEnum.DATA_NOT_FOUND),
      )

      await request(app.getHttpServer()).get('/patients/by-mrn/MRN999').expect(404)
    })

    it('should handle service errors', async () => {
      patientService.findByMedicalRecordNumber.mockRejectedValue(
        new BusinessException(ErrorEnum.SERVER_ERROR),
      )

      await request(app.getHttpServer()).get('/patients/by-mrn/MRN001').expect(500)
    })
  })

  describe('GET /patients/by-id-card/:idCard', () => {
    it('should return patient by id card', async () => {
      const mockPatient = { id: 1, name: '张三' } as PatientEntity
      patientService.findByIdCard.mockResolvedValue(mockPatient)

      const response = await request(app.getHttpServer())
        .get('/patients/by-id-card/1234567890123456789')
        .expect(200)

      expect(response.body).toBeDefined()
      expect(response.body.id).toBe(1)
      expect(patientService.findByIdCard).toHaveBeenCalledWith('1234567890123456789')
    })

    it('should handle patient not found', async () => {
      patientService.findByIdCard.mockRejectedValue(new BusinessException(ErrorEnum.DATA_NOT_FOUND))

      await request(app.getHttpServer())
        .get('/patients/by-id-card/999999999999999999999')
        .expect(404)
    })

    it('should handle service errors', async () => {
      patientService.findByIdCard.mockRejectedValue(new BusinessException(ErrorEnum.SERVER_ERROR))

      await request(app.getHttpServer()).get('/patients/by-id-card/1234567890123456789').expect(500)
    })
  })

  describe('POST /patients', () => {
    it('should create a new patient', async () => {
      const createDto: CreatePatientDto = {
        medicalRecordNumber: 'MRN001',
        name: '张三',
        gender: '男',
        age: 30,
      }

      const response = await request(app.getHttpServer())
        .post('/patients')
        .send(createDto)
        .expect(201)

      expect(response.body).toBeDefined()
      expect(patientService.create).toHaveBeenCalled()
      const callArgs = patientService.create.mock.calls[0][0]
      expect(callArgs).toHaveProperty('name', createDto.name)
      expect(callArgs).toHaveProperty('createBy', 1)
    })

    it('should handle validation errors', async () => {
      const createDto = {
        name: '张三',
      }

      await request(app.getHttpServer()).post('/patients').send(createDto).expect(400)
    })

    it('should handle duplicate medical record number', async () => {
      const createDto: CreatePatientDto = {
        medicalRecordNumber: 'MRN001',
        name: '张三',
        gender: '男',
        age: 30,
      }

      patientService.create.mockRejectedValue(new BusinessException(ErrorEnum.DATA_ALREADY_EXISTS))

      await request(app.getHttpServer()).post('/patients').send(createDto).expect(409)
    })
  })

  describe('GET /patients/:id', () => {
    it('should return patient by id', async () => {
      const mockPatient = { id: 1, name: '张三' } as PatientEntity
      patientService.findOne.mockResolvedValue(mockPatient)

      const response = await request(app.getHttpServer()).get('/patients/1').expect(200)

      expect(response.body).toBeDefined()
      expect(response.body.id).toBe(1)
      expect(patientService.findOne).toHaveBeenCalledWith(1)
    })

    it('should return 404 when patient not found', async () => {
      patientService.findOne.mockRejectedValue(new BusinessException(ErrorEnum.DATA_NOT_FOUND))

      await request(app.getHttpServer()).get('/patients/999').expect(404)
    })

    it('should handle invalid id', async () => {
      patientService.findOne.mockRejectedValue(new BusinessException(ErrorEnum.DATA_NOT_FOUND))

      await request(app.getHttpServer()).get('/patients/invalid').expect(404)
    })
  })

  describe('PUT /patients/:id', () => {
    it('should update patient successfully', async () => {
      const updateDto: UpdatePatientDto = {
        medicalRecordNumber: 'MRN001',
        name: '张三（更新）',
        gender: '男',
        age: 31,
      }

      const response = await request(app.getHttpServer())
        .put('/patients/1')
        .send(updateDto)
        .expect(200)

      expect(response.body).toBeDefined()
      expect(patientService.update).toHaveBeenCalled()
      expect(patientService.update.mock.calls[0][0]).toBe(1)
      const callArgs = patientService.update.mock.calls[0][1]
      expect(callArgs).toHaveProperty('name', updateDto.name)
      expect(callArgs).toHaveProperty('updateBy', 1)
    })

    it('should handle non-existent patient', async () => {
      const updateDto: UpdatePatientDto = {
        medicalRecordNumber: 'MRN001',
        name: '张三（更新）',
        gender: '男',
        age: 31,
      }

      patientService.update.mockRejectedValue(new BusinessException(ErrorEnum.DATA_NOT_FOUND))

      await request(app.getHttpServer()).put('/patients/999').send(updateDto).expect(404)
    })

    it('should handle duplicate medical record number', async () => {
      const updateDto: UpdatePatientDto = {
        medicalRecordNumber: 'MRN002',
        name: '李四',
        gender: '女',
        age: 25,
      }

      patientService.update.mockRejectedValue(new BusinessException(ErrorEnum.DATA_ALREADY_EXISTS))

      await request(app.getHttpServer()).put('/patients/1').send(updateDto).expect(409)
    })
  })

  describe('PUT /patients/:id/diagnosis', () => {
    it('should update patient diagnosis successfully', async () => {
      const diagnosis = '感冒'

      const response = await request(app.getHttpServer())
        .put('/patients/1/diagnosis')
        .send({ diagnosis })
        .expect(200)

      expect(response.body).toBeDefined()
      expect(patientService.updateDiagnosis).toHaveBeenCalledWith(1, diagnosis)
    })

    it('should handle non-existent patient', async () => {
      const diagnosis = '感冒'

      patientService.updateDiagnosis.mockRejectedValue(
        new BusinessException(ErrorEnum.DATA_NOT_FOUND),
      )

      await request(app.getHttpServer())
        .put('/patients/999/diagnosis')
        .send({ diagnosis })
        .expect(404)
    })
  })

  describe('PUT /patients/:id/allergy', () => {
    it('should update patient allergy history successfully', async () => {
      const allergyHistory = '青霉素过敏'

      const response = await request(app.getHttpServer())
        .put('/patients/1/allergy')
        .send({ allergyHistory })
        .expect(200)

      expect(response.body).toBeDefined()
      expect(patientService.updateAllergyHistory).toHaveBeenCalledWith(1, allergyHistory)
    })

    it('should handle non-existent patient', async () => {
      const allergyHistory = '青霉素过敏'

      patientService.updateAllergyHistory.mockRejectedValue(
        new BusinessException(ErrorEnum.DATA_NOT_FOUND),
      )

      await request(app.getHttpServer())
        .put('/patients/999/allergy')
        .send({ allergyHistory })
        .expect(404)
    })
  })

  describe('DELETE /patients/:id', () => {
    it('should delete patient successfully', async () => {
      const response = await request(app.getHttpServer()).delete('/patients/1').expect(200)

      expect(response.body).toBeDefined()
      expect(patientService.remove).toHaveBeenCalled()
      expect(patientService.remove.mock.calls[0][0]).toBe(1)
    })

    it('should handle non-existent patient', async () => {
      patientService.remove.mockRejectedValue(new BusinessException(ErrorEnum.DATA_NOT_FOUND))

      await request(app.getHttpServer()).delete('/patients/999').expect(404)
    })

    it('should handle invalid id', async () => {
      patientService.remove.mockRejectedValue(new BusinessException(ErrorEnum.DATA_NOT_FOUND))

      await request(app.getHttpServer()).delete('/patients/invalid').expect(404)
    })
  })
})
