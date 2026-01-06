import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { vi, afterEach, beforeEach, describe, expect, it } from 'vitest'

import { BusinessException } from '~/common/exceptions/biz.exception'
import { ErrorEnum } from '~/constants/error-code.constant'
import { AllExceptionsFilter } from '~/common/filters/any-exception.filter'

import { DrugController } from './drug.controller'
import { DrugEntity, DrugStatus } from './drug.entity'
import { CreateDrugDto, UpdateDrugDto, DrugQueryDto } from './drug.dto'
import { DrugService } from './drug.service'

describe('DrugController', () => {
  let app: INestApplication
  let drugService: any

  const mockDrugService = {
    findAll: vi.fn().mockResolvedValue([]),
    create: vi
      .fn()
      .mockResolvedValue({ id: 1, drugCode: 'DRUG001', genericName: '阿莫西林' } as DrugEntity),
    findOne: vi
      .fn()
      .mockResolvedValue({ id: 1, drugCode: 'DRUG001', genericName: '阿莫西林' } as DrugEntity),
    update: vi.fn().mockResolvedValue(undefined),
    updateStatus: vi.fn().mockResolvedValue(undefined),
    remove: vi.fn().mockResolvedValue(undefined),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DrugController],
      providers: [
        {
          provide: DrugService,
          useValue: mockDrugService,
        },
        {
          provide: getRepositoryToken(DrugEntity),
          useValue: {
            find: vi.fn(),
            save: vi.fn(),
            findOne: vi.fn(),
            delete: vi.fn(),
          } as Partial<Repository<DrugEntity>>,
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

    drugService = module.get(DrugService)
  })

  afterEach(async () => {
    if (app) {
      await app.close()
    }
    vi.clearAllMocks()
  })

  describe('GET /drugs', () => {
    it('should return all drugs', async () => {
      const mockDrugs = [
        { id: 1, drugCode: 'DRUG001', genericName: '阿莫西林' } as DrugEntity,
        { id: 2, drugCode: 'DRUG002', genericName: '头孢克肟' } as DrugEntity,
      ]
      drugService.findAll.mockResolvedValue(mockDrugs)

      const response = await request(app.getHttpServer()).get('/drugs').expect(200)

      expect(response.body).toBeDefined()
      expect(drugService.findAll).toHaveBeenCalled()
    })

    it('should return drugs with query parameters', async () => {
      const mockDrugs = [{ id: 1, drugCode: 'DRUG001', genericName: '阿莫西林' } as DrugEntity]
      drugService.findAll.mockResolvedValue(mockDrugs)

      const query: DrugQueryDto = { name: '阿莫西林', drugType: '抗生素' }
      const response = await request(app.getHttpServer()).get('/drugs').query(query).expect(200)

      expect(response.body).toBeDefined()
      expect(drugService.findAll).toHaveBeenCalled()
    })

    it('should handle service errors', async () => {
      drugService.findAll.mockRejectedValue(new BusinessException(ErrorEnum.SERVER_ERROR))

      await request(app.getHttpServer()).get('/drugs').expect(500)
    })
  })

  describe('POST /drugs', () => {
    it('should create a new drug', async () => {
      const createDto: CreateDrugDto = {
        drugCode: 'DRUG001',
        genericName: '阿莫西林胶囊',
        tradeName: '阿莫西林',
        specification: '0.5g*24粒',
        dosageForm: '胶囊剂',
        manufacturer: '某制药厂',
        approvalNumber: '国药准字H12345678',
        drugType: '抗生素',
        usePurpose: '消炎抗菌',
        usageMethod: '口服',
        validFrom: '2024-01-01',
        validTo: '2026-12-31',
        retailPrice: 25.0,
        wholesalePrice: 20.0,
        pharmacologicalClassId: 1,
        dosageClassId: 1,
        departmentClassId: 1,
      }

      const response = await request(app.getHttpServer()).post('/drugs').send(createDto).expect(201)

      expect(response.body).toBeDefined()
      expect(drugService.create).toHaveBeenCalled()
    })

    it('should handle validation errors', async () => {
      const invalidDto = {
        drugCode: 'DRUG001',
      }

      await request(app.getHttpServer()).post('/drugs').send(invalidDto).expect(400)
    })

    it('should handle duplicate drug code', async () => {
      const createDto: CreateDrugDto = {
        drugCode: 'DRUG001',
        genericName: '阿莫西林胶囊',
        specification: '0.5g*24粒',
        dosageForm: '胶囊剂',
        manufacturer: '某制药厂',
        approvalNumber: '国药准字H12345678',
        drugType: '抗生素',
        validFrom: '2024-01-01',
        validTo: '2026-12-31',
        retailPrice: 25.0,
        wholesalePrice: 20.0,
      }

      drugService.create.mockRejectedValue(new BusinessException(ErrorEnum.DATA_ALREADY_EXISTS))

      await request(app.getHttpServer()).post('/drugs').send(createDto).expect(409)
    })
  })

  describe('GET /drugs/:id', () => {
    it('should return drug by id', async () => {
      const mockDrug = { id: 1, drugCode: 'DRUG001', genericName: '阿莫西林' } as DrugEntity
      drugService.findOne.mockResolvedValue(mockDrug)

      const response = await request(app.getHttpServer()).get('/drugs/1').expect(200)

      expect(response.body).toBeDefined()
      expect(response.body.id).toBe(1)
      expect(drugService.findOne).toHaveBeenCalledWith(1)
    })

    it('should return 404 when drug not found', async () => {
      drugService.findOne.mockRejectedValue(new BusinessException(ErrorEnum.DATA_NOT_FOUND))

      await request(app.getHttpServer()).get('/drugs/999').expect(404)
    })
  })

  describe('PUT /drugs/:id', () => {
    it('should update drug successfully', async () => {
      const updateDto: UpdateDrugDto = {
        drugCode: 'DRUG001',
        genericName: '阿莫西林胶囊（更新）',
        specification: '0.5g*24粒',
        dosageForm: '胶囊剂',
        manufacturer: '某制药厂',
        approvalNumber: '国药准字H12345678',
        drugType: '抗生素',
        validFrom: '2024-01-01',
        validTo: '2026-12-31',
        retailPrice: 28.0,
        wholesalePrice: 22.0,
      }

      const response = await request(app.getHttpServer())
        .put('/drugs/1')
        .send(updateDto)
        .expect(200)

      expect(response.body).toBeDefined()
      expect(drugService.update).toHaveBeenCalled()
    })

    it('should handle non-existent drug', async () => {
      const updateDto: UpdateDrugDto = {
        drugCode: 'DRUG002',
        genericName: '头孢克肟',
        specification: '0.1g*12片',
        dosageForm: '片剂',
        manufacturer: '某制药厂',
        approvalNumber: '国药准字H87654321',
        drugType: '抗生素',
        validFrom: '2024-01-01',
        validTo: '2026-12-31',
        retailPrice: 35.0,
        wholesalePrice: 28.0,
      }

      drugService.update.mockRejectedValue(new BusinessException(ErrorEnum.DATA_NOT_FOUND))

      await request(app.getHttpServer()).put('/drugs/999').send(updateDto).expect(404)
    })
  })

  describe('PUT /drugs/:id/status', () => {
    it('should update drug status successfully', async () => {
      await request(app.getHttpServer())
        .put('/drugs/1/status')
        .send({ status: DrugStatus.STOPPED })
        .expect(200)

      expect(drugService.updateStatus).toHaveBeenCalledWith(1, DrugStatus.STOPPED)
    })

    it('should handle non-existent drug', async () => {
      drugService.updateStatus.mockRejectedValue(new BusinessException(ErrorEnum.DATA_NOT_FOUND))

      await request(app.getHttpServer())
        .put('/drugs/999/status')
        .send({ status: DrugStatus.STOPPED })
        .expect(404)
    })
  })

  describe('DELETE /drugs/:id', () => {
    it('should delete drug successfully', async () => {
      const response = await request(app.getHttpServer()).delete('/drugs/1').expect(200)

      expect(response.body).toBeDefined()
      expect(drugService.remove).toHaveBeenCalled()
    })

    it('should handle non-existent drug', async () => {
      drugService.remove.mockRejectedValue(new BusinessException(ErrorEnum.DATA_NOT_FOUND))

      await request(app.getHttpServer()).delete('/drugs/999').expect(404)
    })

    it('should handle drug with associated inventory', async () => {
      drugService.remove.mockRejectedValue(
        new BusinessException(ErrorEnum.CANNOT_DELETE_WITH_INVENTORY),
      )

      await request(app.getHttpServer()).delete('/drugs/1').expect(409)
    })
  })
})
