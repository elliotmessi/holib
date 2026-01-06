import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { vi, afterEach, beforeEach, describe, expect, it } from 'vitest'

import { BusinessException } from '~/common/exceptions/biz.exception'
import { ErrorEnum } from '~/constants/error-code.constant'
import { AllExceptionsFilter } from '~/common/filters/any-exception.filter'

import { PrescriptionController } from './prescription.controller'
import { PrescriptionService } from './prescription.service'
import { PrescriptionStatus } from './prescription.entity'
import {
  CreatePrescriptionDto,
  ReviewPrescriptionDto,
  PrescriptionQueryDto,
} from './prescription.dto'

describe('PrescriptionController', () => {
  let app: INestApplication
  let prescriptionService: any

  const mockPrescriptionService = {
    findAll: vi.fn().mockResolvedValue([]),
    getPendingReview: vi.fn().mockResolvedValue([]),
    getStats: vi.fn().mockResolvedValue({ total: 0, amount: 0 }),
    create: vi.fn().mockResolvedValue({ id: 1, prescriptionNumber: 'RX001' }),
    findOne: vi
      .fn()
      .mockResolvedValue({
        id: 1,
        prescriptionNumber: 'RX001',
        status: PrescriptionStatus.PENDING_REVIEW,
      }),
    review: vi.fn().mockResolvedValue(undefined),
    dispense: vi.fn().mockResolvedValue(undefined),
    cancel: vi.fn().mockResolvedValue(undefined),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrescriptionController],
      providers: [
        {
          provide: PrescriptionService,
          useValue: mockPrescriptionService,
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

    prescriptionService = module.get(PrescriptionService)
  })

  afterEach(async () => {
    if (app) {
      await app.close()
    }
    vi.clearAllMocks()
  })

  describe('GET /prescriptions', () => {
    it('should return all prescriptions', async () => {
      const mockPrescriptions = [
        { id: 1, prescriptionNumber: 'RX001' },
        { id: 2, prescriptionNumber: 'RX002' },
      ]
      prescriptionService.findAll.mockResolvedValue(mockPrescriptions)

      const response = await request(app.getHttpServer()).get('/prescriptions').expect(200)

      expect(response.body).toBeDefined()
      expect(prescriptionService.findAll).toHaveBeenCalled()
    })

    it('should return prescriptions with query parameters', async () => {
      const mockPrescriptions = [{ id: 1, prescriptionNumber: 'RX001' }]
      prescriptionService.findAll.mockResolvedValue(mockPrescriptions)

      const query: PrescriptionQueryDto = {
        patientId: 1,
        status: PrescriptionStatus.PENDING_REVIEW,
      }
      const response = await request(app.getHttpServer())
        .get('/prescriptions')
        .query(query)
        .expect(200)

      expect(response.body).toBeDefined()
      expect(prescriptionService.findAll).toHaveBeenCalledWith(query)
    })

    it('should handle service errors', async () => {
      prescriptionService.findAll.mockRejectedValue(new BusinessException(ErrorEnum.SERVER_ERROR))

      await request(app.getHttpServer()).get('/prescriptions').expect(500)
    })
  })

  describe('GET /prescriptions/pending-review/:pharmacyId', () => {
    it('should return pending review prescriptions', async () => {
      const mockPrescriptions = [{ id: 1, prescriptionNumber: 'RX001' }]
      prescriptionService.getPendingReview.mockResolvedValue(mockPrescriptions)

      const response = await request(app.getHttpServer())
        .get('/prescriptions/pending-review/1')
        .expect(200)

      expect(response.body).toBeDefined()
      expect(prescriptionService.getPendingReview).toHaveBeenCalledWith(1)
    })

    it('should handle service errors', async () => {
      prescriptionService.getPendingReview.mockRejectedValue(
        new BusinessException(ErrorEnum.SERVER_ERROR),
      )

      await request(app.getHttpServer()).get('/prescriptions/pending-review/1').expect(500)
    })
  })

  describe('GET /prescriptions/stats', () => {
    it('should return prescription statistics', async () => {
      const mockStats = { total: 10, amount: 1000.0 }
      prescriptionService.getStats.mockResolvedValue(mockStats)

      const response = await request(app.getHttpServer())
        .get('/prescriptions/stats')
        .query({ startDate: '2024-01-01', endDate: '2024-12-31' })
        .expect(200)

      expect(response.body).toBeDefined()
      expect(prescriptionService.getStats).toHaveBeenCalled()
    })

    it('should handle service errors', async () => {
      prescriptionService.getStats.mockRejectedValue(new BusinessException(ErrorEnum.SERVER_ERROR))

      await request(app.getHttpServer())
        .get('/prescriptions/stats')
        .query({ startDate: '2024-01-01', endDate: '2024-12-31' })
        .expect(500)
    })
  })

  describe('POST /prescriptions', () => {
    it('should create a new prescription', async () => {
      const createDto: CreatePrescriptionDto = {
        patientId: 1,
        pharmacyId: 1,
        diagnosis: '感冒',
        prescriptionDrugs: [
          {
            drugId: 1,
            dosage: 1.0,
            dosageUnit: '片',
            frequency: '每日三次',
            administrationRoute: '口服',
            duration: 7,
            quantity: 21,
            unitPrice: 10.0,
          },
        ],
        remark: '测试处方',
      }

      const response = await request(app.getHttpServer())
        .post('/prescriptions')
        .send(createDto)
        .expect(201)

      expect(response.body).toBeDefined()
      expect(prescriptionService.create).toHaveBeenCalled()
    })

    it('should handle validation errors', async () => {
      const invalidDto = {
        diagnosis: 'test',
      }

      await request(app.getHttpServer()).post('/prescriptions').send(invalidDto).expect(400)
    })

    it('should handle duplicate prescription number', async () => {
      const createDto: CreatePrescriptionDto = {
        patientId: 1,
        pharmacyId: 1,
        diagnosis: '感冒',
        prescriptionDrugs: [
          {
            drugId: 1,
            dosage: 1.0,
            dosageUnit: '片',
            frequency: '每日三次',
            administrationRoute: '口服',
            duration: 7,
            quantity: 21,
            unitPrice: 10.0,
          },
        ],
      }

      prescriptionService.create.mockRejectedValue(
        new BusinessException(ErrorEnum.DATA_ALREADY_EXISTS),
      )

      await request(app.getHttpServer()).post('/prescriptions').send(createDto).expect(409)
    })
  })

  describe('GET /prescriptions/:id', () => {
    it('should return prescription by id', async () => {
      const mockPrescription = {
        id: 1,
        prescriptionNumber: 'RX001',
        status: PrescriptionStatus.REVIEWED,
      }
      prescriptionService.findOne.mockResolvedValue(mockPrescription)

      const response = await request(app.getHttpServer()).get('/prescriptions/1').expect(200)

      expect(response.body).toBeDefined()
      expect(response.body.id).toBe(1)
      expect(prescriptionService.findOne).toHaveBeenCalledWith(1)
    })

    it('should return 404 when prescription not found', async () => {
      prescriptionService.findOne.mockRejectedValue(new BusinessException(ErrorEnum.DATA_NOT_FOUND))

      await request(app.getHttpServer()).get('/prescriptions/999').expect(404)
    })
  })

  describe('PUT /prescriptions/:id/review', () => {
    it('should review prescription successfully', async () => {
      const reviewDto: ReviewPrescriptionDto = {
        status: PrescriptionStatus.REVIEWED,
        reviewComments: '审核通过',
      }

      await request(app.getHttpServer()).put('/prescriptions/1/review').send(reviewDto).expect(200)

      expect(prescriptionService.review).toHaveBeenCalled()
    })

    it('should handle non-existent prescription', async () => {
      const reviewDto: ReviewPrescriptionDto = {
        status: PrescriptionStatus.REVIEWED,
        reviewComments: '审核通过',
      }

      prescriptionService.review.mockRejectedValue(new BusinessException(ErrorEnum.DATA_NOT_FOUND))

      await request(app.getHttpServer())
        .put('/prescriptions/999/review')
        .send(reviewDto)
        .expect(404)
    })

    it('should handle already reviewed prescription', async () => {
      const reviewDto: ReviewPrescriptionDto = {
        status: PrescriptionStatus.REJECTED,
        reviewComments: '审核不通过',
      }

      prescriptionService.review.mockRejectedValue(
        new BusinessException(ErrorEnum.PRESCRIPTION_ALREADY_REVIEWED),
      )

      await request(app.getHttpServer()).put('/prescriptions/1/review').send(reviewDto).expect(409)
    })
  })

  describe('POST /prescriptions/:id/dispense', () => {
    it('should dispense prescription successfully', async () => {
      await request(app.getHttpServer()).post('/prescriptions/1/dispense').expect(201)

      expect(prescriptionService.dispense).toHaveBeenCalledWith(1)
    })

    it('should handle non-reviewed prescription', async () => {
      prescriptionService.dispense.mockRejectedValue(
        new BusinessException(ErrorEnum.PRESCRIPTION_NOT_APPROVED),
      )

      await request(app.getHttpServer()).post('/prescriptions/1/dispense').expect(409)
    })

    it('should handle non-existent prescription', async () => {
      prescriptionService.dispense.mockRejectedValue(
        new BusinessException(ErrorEnum.DATA_NOT_FOUND),
      )

      await request(app.getHttpServer()).post('/prescriptions/999/dispense').expect(404)
    })
  })

  describe('POST /prescriptions/:id/cancel', () => {
    it('should cancel prescription successfully', async () => {
      await request(app.getHttpServer())
        .post('/prescriptions/1/cancel')
        .send({ reason: '患者要求取消' })
        .expect(201)

      expect(prescriptionService.cancel).toHaveBeenCalled()
    })

    it('should handle non-existent prescription', async () => {
      prescriptionService.cancel.mockRejectedValue(new BusinessException(ErrorEnum.DATA_NOT_FOUND))

      await request(app.getHttpServer())
        .post('/prescriptions/999/cancel')
        .send({ reason: '患者要求取消' })
        .expect(404)
    })

    it('should handle already dispensed prescription', async () => {
      prescriptionService.cancel.mockRejectedValue(
        new BusinessException(ErrorEnum.CANNOT_CANCEL_DISPENSED_PRESCRIPTION),
      )

      await request(app.getHttpServer())
        .post('/prescriptions/1/cancel')
        .send({ reason: '患者要求取消' })
        .expect(409)
    })
  })
})
