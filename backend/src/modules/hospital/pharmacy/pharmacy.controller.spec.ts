import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { vi, afterEach, beforeEach, describe, expect, it } from 'vitest'

import { BusinessException } from '~/common/exceptions/biz.exception'
import { ErrorEnum } from '~/constants/error-code.constant'
import { AllExceptionsFilter } from '~/common/filters/any-exception.filter'

import { PharmacyController } from './pharmacy.controller'
import { PharmacyEntity } from './pharmacy.entity'
import { PharmacyType } from './pharmacy.entity'
import { CreatePharmacyDto, UpdatePharmacyDto, PharmacyQueryDto } from './pharmacy.dto'
import { PharmacyService } from './pharmacy.service'

describe('PharmacyController', () => {
  let app: INestApplication
  let pharmacyService: any

  const mockPharmacyService = {
    findAll: vi.fn().mockResolvedValue([]),
    create: vi.fn().mockResolvedValue({ id: 1, name: '门诊药房' } as PharmacyEntity),
    findOne: vi.fn().mockResolvedValue({ id: 1, name: '门诊药房' } as PharmacyEntity),
    update: vi.fn().mockResolvedValue(undefined),
    remove: vi.fn().mockResolvedValue(undefined),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PharmacyController],
      providers: [
        {
          provide: PharmacyService,
          useValue: mockPharmacyService,
        },
        {
          provide: getRepositoryToken(PharmacyEntity),
          useValue: {
            find: vi.fn(),
            save: vi.fn(),
            findOne: vi.fn(),
            delete: vi.fn(),
          } as Partial<Repository<PharmacyEntity>>,
        },
      ],
    }).compile()

    app = module.createNestApplication()

    const { ValidationPipe } = await import('@nestjs/common')
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    )

    app.useGlobalFilters(new AllExceptionsFilter())

    await app.init()

    pharmacyService = module.get(PharmacyService)
  })

  afterEach(async () => {
    if (app) {
      await app.close()
    }
    vi.clearAllMocks()
  })

  describe('GET /pharmacies', () => {
    it('should return all pharmacies', async () => {
      const mockPharmacies = [
        { id: 1, name: '门诊药房' } as PharmacyEntity,
        { id: 2, name: '中药房' } as PharmacyEntity,
      ]
      pharmacyService.findAll.mockResolvedValue(mockPharmacies)

      const response = await request(app.getHttpServer()).get('/pharmacies').expect(200)

      expect(response.body).toBeDefined()
      expect(pharmacyService.findAll).toHaveBeenCalled()
    })

    it('should return pharmacies with query parameters', async () => {
      const mockPharmacies = [{ id: 1, name: '门诊药房' } as PharmacyEntity]
      pharmacyService.findAll.mockResolvedValue(mockPharmacies)

      const query: PharmacyQueryDto = {
        name: '门诊药房',
        pharmacyType: PharmacyType.WESTERN_MEDICINE,
      }
      const response = await request(app.getHttpServer())
        .get('/pharmacies')
        .query(query)
        .expect(200)

      expect(response.body).toBeDefined()
      expect(pharmacyService.findAll).toHaveBeenCalledWith(expect.objectContaining({
        name: '门诊药房',
        pharmacyType: PharmacyType.WESTERN_MEDICINE,
      }))
    })

    it('should handle service errors', async () => {
      pharmacyService.findAll.mockRejectedValue(new BusinessException(ErrorEnum.SERVER_ERROR))

      await request(app.getHttpServer()).get('/pharmacies').expect(500)
    })
  })

  describe('POST /pharmacies', () => {
    it('should create a new pharmacy', async () => {
      const createDto: CreatePharmacyDto = {
        pharmacyCode: 'PH001',
        name: '门诊药房',
        hospitalId: 1,
        pharmacyType: PharmacyType.WESTERN_MEDICINE,
        floor: '一楼',
        contactPerson: '李医生',
        phone: '010-12345678',
      }

      const response = await request(app.getHttpServer())
        .post('/pharmacies')
        .send(createDto)
        .expect(201)

      expect(response.body).toBeDefined()
      expect(pharmacyService.create).toHaveBeenCalled()
    })

    it('should handle validation errors', async () => {
      const invalidDto = {
        name: '门诊药房',
      }

      await request(app.getHttpServer()).post('/pharmacies').send(invalidDto).expect(400)
    })

    it('should handle duplicate pharmacy code', async () => {
      const createDto: CreatePharmacyDto = {
        pharmacyCode: 'PH001',
        name: '门诊药房',
        hospitalId: 1,
        pharmacyType: PharmacyType.WESTERN_MEDICINE,
      }

      pharmacyService.create.mockRejectedValue(
        new BusinessException(ErrorEnum.PHARMACY_CODE_EXISTS),
      )

      await request(app.getHttpServer()).post('/pharmacies').send(createDto).expect(409)
    })
  })

  describe('GET /pharmacies/:id', () => {
    it('should return pharmacy by id', async () => {
      const mockPharmacy = { id: 1, name: '门诊药房' } as PharmacyEntity
      pharmacyService.findOne.mockResolvedValue(mockPharmacy)

      const response = await request(app.getHttpServer()).get('/pharmacies/1').expect(200)

      expect(response.body).toBeDefined()
      expect(response.body.id).toBe(1)
      expect(pharmacyService.findOne).toHaveBeenCalledWith(1)
    })

    it('should return 404 when pharmacy not found', async () => {
      pharmacyService.findOne.mockRejectedValue(new BusinessException(ErrorEnum.DATA_NOT_FOUND))

      await request(app.getHttpServer()).get('/pharmacies/999').expect(404)
    })
  })

  describe('PUT /pharmacies/:id', () => {
    it('should update pharmacy successfully', async () => {
      const updateDto: UpdatePharmacyDto = {
        pharmacyCode: 'PH001',
        name: '门诊药房（更新）',
        hospitalId: 1,
        pharmacyType: PharmacyType.WESTERN_MEDICINE,
        floor: '二楼',
      }

      const response = await request(app.getHttpServer())
        .put('/pharmacies/1')
        .send(updateDto)
        .expect(200)

      expect(response.body).toBeDefined()
      expect(pharmacyService.update).toHaveBeenCalled()
    })

    it('should handle non-existent pharmacy', async () => {
      const updateDto: UpdatePharmacyDto = {
        pharmacyCode: 'PH002',
        name: '中药房',
        hospitalId: 1,
        pharmacyType: PharmacyType.CHINESE_MEDICINE,
      }

      pharmacyService.update.mockRejectedValue(new BusinessException(ErrorEnum.DATA_NOT_FOUND))

      await request(app.getHttpServer()).put('/pharmacies/999').send(updateDto).expect(404)
    })

    it('should handle duplicate pharmacy code', async () => {
      const updateDto: UpdatePharmacyDto = {
        pharmacyCode: 'PH999',
        name: '中药房',
        hospitalId: 1,
        pharmacyType: PharmacyType.CHINESE_MEDICINE,
      }

      pharmacyService.update.mockRejectedValue(
        new BusinessException(ErrorEnum.PHARMACY_CODE_EXISTS),
      )

      await request(app.getHttpServer()).put('/pharmacies/1').send(updateDto).expect(409)
    })
  })

  describe('DELETE /pharmacies/:id', () => {
    it('should delete pharmacy successfully', async () => {
      const response = await request(app.getHttpServer()).delete('/pharmacies/1').expect(200)

      expect(response.body).toBeDefined()
      expect(pharmacyService.remove).toHaveBeenCalled()
    })

    it('should handle non-existent pharmacy', async () => {
      pharmacyService.remove.mockRejectedValue(new BusinessException(ErrorEnum.DATA_NOT_FOUND))

      await request(app.getHttpServer()).delete('/pharmacies/999').expect(404)
    })

    it('should handle pharmacy with associated data', async () => {
      pharmacyService.remove.mockRejectedValue(
        new BusinessException(ErrorEnum.DATA_HAS_ASSOCIATED_CHILDREN),
      )

      await request(app.getHttpServer()).delete('/pharmacies/1').expect(409)
    })
  })
})
