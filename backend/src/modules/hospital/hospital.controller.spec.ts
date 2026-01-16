import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { vi, afterEach, beforeEach, describe, expect, it } from 'vitest'

import { BusinessException } from '~/common/exceptions/biz.exception'
import { ErrorEnum } from '~/constants/error-code.constant'
import { AllExceptionsFilter } from '~/common/filters/any-exception.filter'

import { HospitalController } from './hospital/hospital.controller'
import { HospitalEntity } from './hospital/hospital.entity'
import { CreateHospitalDto, UpdateHospitalDto, HospitalQueryDto } from './hospital/hospital.dto'
import { HospitalService } from './hospital/hospital.service'

export const permissions = {
  LIST: 'list',
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
} as const

describe('HospitalController', () => {
  let app: INestApplication
  let hospitalService: any

  const mockHospitalService = {
    findAll: vi.fn().mockResolvedValue([]),
    create: vi.fn().mockResolvedValue({ id: 1, name: '人民医院' } as HospitalEntity),
    findOne: vi.fn().mockResolvedValue({ id: 1, name: '人民医院' } as HospitalEntity),
    update: vi.fn().mockResolvedValue(undefined),
    remove: vi.fn().mockResolvedValue(undefined),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HospitalController],
      providers: [
        {
          provide: HospitalService,
          useValue: mockHospitalService,
        },
        {
          provide: getRepositoryToken(HospitalEntity),
          useValue: {
            find: vi.fn(),
            save: vi.fn(),
            findOne: vi.fn(),
            delete: vi.fn(),
          } as Partial<Repository<HospitalEntity>>,
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

    hospitalService = module.get(HospitalService)
  })

  afterEach(async () => {
    if (app) {
      await app.close()
    }
    vi.clearAllMocks()
  })

  describe('GET /hospitals', () => {
    it('should return all hospitals', async () => {
      const mockHospitals = [
        { id: 1, name: '人民医院' } as HospitalEntity,
        { id: 2, name: '中医院' } as HospitalEntity,
      ]
      hospitalService.findAll.mockResolvedValue(mockHospitals)

      const response = await request(app.getHttpServer()).get('/hospitals').expect(200)

      expect(response.body).toBeDefined()
      expect(hospitalService.findAll).toHaveBeenCalled()
    })

    it('should return hospitals with query parameters', async () => {
      const mockHospitals = [{ id: 1, name: '人民医院' } as HospitalEntity]
      hospitalService.findAll.mockResolvedValue(mockHospitals)

      const query: HospitalQueryDto = { name: '人民医院' }
      const response = await request(app.getHttpServer()).get('/hospitals').query(query).expect(200)

      expect(response.body).toBeDefined()
      expect(hospitalService.findAll).toHaveBeenCalledWith(expect.objectContaining({ name: '人民医院' }))
    })

    it('should handle service errors', async () => {
      hospitalService.findAll.mockRejectedValue(new BusinessException(ErrorEnum.SERVER_ERROR))

      await request(app.getHttpServer()).get('/hospitals').expect(500)
    })
  })

  describe('POST /hospitals', () => {
    it('should create a new hospital', async () => {
      const createDto: CreateHospitalDto = {
        hospitalCode: 'HOSP001',
        name: '人民医院',
        address: '北京市朝阳区',
        phone: '010-12345678',
        contactPerson: '张三',
      }

      const response = await request(app.getHttpServer())
        .post('/hospitals')
        .send(createDto)
        .expect(201)

      expect(response.body).toBeDefined()
      expect(hospitalService.create).toHaveBeenCalled()
      const callArgs = hospitalService.create.mock.calls[0][0]
      expect(callArgs).toHaveProperty('name', createDto.name)
      expect(callArgs).toHaveProperty('createBy', 1)
    })

    it('should handle validation errors', async () => {
      const createDto = {
        name: '人民医院',
      }

      await request(app.getHttpServer()).post('/hospitals').send(createDto).expect(400)
    })

    it('should handle duplicate hospital name', async () => {
      const createDto: CreateHospitalDto = {
        hospitalCode: 'HOSP001',
        name: '人民医院',
        address: '北京市朝阳区',
        phone: '010-12345678',
        contactPerson: '张三',
      }

      hospitalService.create.mockRejectedValue(new BusinessException(ErrorEnum.DATA_ALREADY_EXISTS))

      await request(app.getHttpServer()).post('/hospitals').send(createDto).expect(409)
    })
  })

  describe('GET /hospitals/:id', () => {
    it('should return hospital by id', async () => {
      const mockHospital = { id: 1, name: '人民医院' } as HospitalEntity
      hospitalService.findOne.mockResolvedValue(mockHospital)

      const response = await request(app.getHttpServer()).get('/hospitals/1').expect(200)

      expect(response.body).toBeDefined()
      expect(response.body.id).toBe(1)
      expect(hospitalService.findOne).toHaveBeenCalledWith(1)
    })

    it('should return 404 when hospital not found', async () => {
      hospitalService.findOne.mockRejectedValue(new BusinessException(ErrorEnum.DATA_NOT_FOUND))

      await request(app.getHttpServer()).get('/hospitals/999').expect(404)
    })

    it('should handle invalid id', async () => {
      hospitalService.findOne.mockRejectedValue(new BusinessException(ErrorEnum.DATA_NOT_FOUND))

      await request(app.getHttpServer()).get('/hospitals/invalid').expect(404)
    })
  })

  describe('PUT /hospitals/:id', () => {
    it('should update hospital successfully', async () => {
      const updateDto: UpdateHospitalDto = {
        hospitalCode: 'HOSP001',
        name: '人民医院（更新）',
        address: '北京市朝阳区',
        phone: '010-12345678',
        contactPerson: '张三',
      }

      const response = await request(app.getHttpServer())
        .put('/hospitals/1')
        .send(updateDto)
        .expect(200)

      expect(response.body).toBeDefined()
      expect(hospitalService.update).toHaveBeenCalled()
      expect(hospitalService.update.mock.calls[0][0]).toBe(1)
      const callArgs = hospitalService.update.mock.calls[0][1]
      expect(callArgs).toHaveProperty('name', updateDto.name)
      expect(callArgs).toHaveProperty('updateBy', 1)
    })

    it('should handle non-existent hospital', async () => {
      const updateDto: UpdateHospitalDto = {
        hospitalCode: 'HOSP001',
        name: '人民医院（更新）',
        address: '北京市朝阳区',
        phone: '010-12345678',
        contactPerson: '张三',
      }

      hospitalService.update.mockRejectedValue(new BusinessException(ErrorEnum.DATA_NOT_FOUND))

      await request(app.getHttpServer()).put('/hospitals/999').send(updateDto).expect(404)
    })

    it('should handle duplicate hospital name', async () => {
      const updateDto: UpdateHospitalDto = {
        hospitalCode: 'HOSP002',
        name: '中医院',
        address: '北京市朝阳区',
        phone: '010-12345678',
        contactPerson: '张三',
      }

      hospitalService.update.mockRejectedValue(new BusinessException(ErrorEnum.DATA_ALREADY_EXISTS))

      await request(app.getHttpServer()).put('/hospitals/1').send(updateDto).expect(409)
    })
  })

  describe('DELETE /hospitals/:id', () => {
    it('should delete hospital successfully', async () => {
      const response = await request(app.getHttpServer()).delete('/hospitals/1').expect(200)

      expect(response.body).toBeDefined()
      expect(hospitalService.remove).toHaveBeenCalled()
      expect(hospitalService.remove.mock.calls[0][0]).toBe(1)
    })

    it('should handle non-existent hospital', async () => {
      hospitalService.remove.mockRejectedValue(new BusinessException(ErrorEnum.DATA_NOT_FOUND))

      await request(app.getHttpServer()).delete('/hospitals/999').expect(404)
    })

    it('should handle invalid id', async () => {
      hospitalService.remove.mockRejectedValue(new BusinessException(ErrorEnum.DATA_NOT_FOUND))

      await request(app.getHttpServer()).delete('/hospitals/invalid').expect(404)
    })
  })
})
