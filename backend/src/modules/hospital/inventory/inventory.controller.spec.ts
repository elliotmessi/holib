import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { vi, afterEach, beforeEach, describe, expect, it } from 'vitest'

import { BusinessException } from '~/common/exceptions/biz.exception'
import { ErrorEnum } from '~/constants/error-code.constant'
import { AllExceptionsFilter } from '~/common/filters/any-exception.filter'

import { InventoryController } from './inventory.controller'
import { InventoryEntity } from './inventory.entity'
import {
  CreateInventoryDto,
  UpdateInventoryDto,
  InventoryQueryDto,
  AdjustInventoryDto,
} from './inventory.dto'
import { InventoryService } from './inventory.service'

describe('InventoryController', () => {
  let app: INestApplication
  let inventoryService: any

  const mockInventoryService = {
    findAll: vi.fn().mockResolvedValue([]),
    getLowStock: vi.fn().mockResolvedValue([]),
    getExpiringWithinDays: vi.fn().mockResolvedValue([]),
    create: vi.fn().mockResolvedValue({
      id: 1,
      drugId: 1,
      pharmacyId: 1,
      batchNumber: 'BATCH001',
    } as InventoryEntity),
    findOne: vi.fn().mockResolvedValue({
      id: 1,
      drugId: 1,
      pharmacyId: 1,
      batchNumber: 'BATCH001',
    } as InventoryEntity),
    update: vi.fn().mockResolvedValue(undefined),
    adjustQuantity: vi.fn().mockResolvedValue({ id: 1, quantity: 100 } as InventoryEntity),
    toggleFrozen: vi.fn().mockResolvedValue(undefined),
    remove: vi.fn().mockResolvedValue(undefined),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoryController],
      providers: [
        {
          provide: InventoryService,
          useValue: mockInventoryService,
        },
        {
          provide: getRepositoryToken(InventoryEntity),
          useValue: {
            find: vi.fn(),
            save: vi.fn(),
            findOne: vi.fn(),
            delete: vi.fn(),
          } as Partial<Repository<InventoryEntity>>,
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

    inventoryService = module.get(InventoryService)
  })

  afterEach(async () => {
    if (app) {
      await app.close()
    }
    vi.clearAllMocks()
  })

  describe('GET /inventory', () => {
    it('should return all inventory records', async () => {
      const mockInventory = [
        { id: 1, drugId: 1, pharmacyId: 1, batchNumber: 'BATCH001' } as InventoryEntity,
        { id: 2, drugId: 2, pharmacyId: 1, batchNumber: 'BATCH002' } as InventoryEntity,
      ]
      inventoryService.findAll.mockResolvedValue(mockInventory)

      const response = await request(app.getHttpServer()).get('/inventory').expect(200)

      expect(response.body).toBeDefined()
      expect(inventoryService.findAll).toHaveBeenCalled()
    })

    it('should return inventory with query parameters', async () => {
      const mockInventory = [
        { id: 1, drugId: 1, pharmacyId: 1, batchNumber: 'BATCH001' } as InventoryEntity,
      ]
      inventoryService.findAll.mockResolvedValue(mockInventory)

      const query: InventoryQueryDto = { drugId: 1, pharmacyId: 1 }
      const response = await request(app.getHttpServer()).get('/inventory').query(query).expect(200)

      expect(response.body).toBeDefined()
      expect(inventoryService.findAll).toHaveBeenCalledWith(expect.objectContaining({
        drugId: 1,
        pharmacyId: 1,
      }))
    })

    it('should handle service errors', async () => {
      inventoryService.findAll.mockRejectedValue(new BusinessException(ErrorEnum.SERVER_ERROR))

      await request(app.getHttpServer()).get('/inventory').expect(500)
    })
  })

  describe('GET /inventory/low-stock', () => {
    it('should return low stock inventory', async () => {
      const mockInventory = [{ id: 1, drugId: 1, quantity: 5 } as InventoryEntity]
      inventoryService.getLowStock.mockResolvedValue(mockInventory)

      const response = await request(app.getHttpServer()).get('/inventory/low-stock').expect(200)

      expect(response.body).toBeDefined()
      expect(inventoryService.getLowStock).toHaveBeenCalled()
    })

    it('should handle service errors', async () => {
      inventoryService.getLowStock.mockRejectedValue(new BusinessException(ErrorEnum.SERVER_ERROR))

      await request(app.getHttpServer()).get('/inventory/low-stock').expect(500)
    })
  })

  describe('GET /inventory/expiring', () => {
    it('should return expiring inventory', async () => {
      const mockInventory = [{ id: 1, drugId: 1, validTo: new Date() } as InventoryEntity]
      inventoryService.getExpiringWithinDays.mockResolvedValue(mockInventory)

      const response = await request(app.getHttpServer())
        .get('/inventory/expiring')
        .query({ days: 30 })
        .expect(200)

      expect(response.body).toBeDefined()
      expect(inventoryService.getExpiringWithinDays).toHaveBeenCalled()
    })

    it('should use default days parameter', async () => {
      const mockInventory: InventoryEntity[] = []
      inventoryService.getExpiringWithinDays.mockResolvedValue(mockInventory)

      await request(app.getHttpServer()).get('/inventory/expiring').expect(200)

      expect(inventoryService.getExpiringWithinDays).toHaveBeenCalledWith(90)
    })

    it('should handle service errors', async () => {
      inventoryService.getExpiringWithinDays.mockRejectedValue(
        new BusinessException(ErrorEnum.SERVER_ERROR),
      )

      await request(app.getHttpServer()).get('/inventory/expiring').expect(500)
    })
  })

  describe('POST /inventory', () => {
    it('should create a new inventory record', async () => {
      const createDto: CreateInventoryDto = {
        drugId: 1,
        pharmacyId: 1,
        batchNumber: 'BATCH001',
        quantity: 100,
        minimumThreshold: 10,
        maximumThreshold: 1000,
        storageLocation: 'A区-01',
        validFrom: '2024-01-01',
        validTo: '2026-12-31',
      }

      const response = await request(app.getHttpServer())
        .post('/inventory')
        .send(createDto)
        .expect(201)

      expect(response.body).toBeDefined()
      expect(inventoryService.create).toHaveBeenCalled()
    })

    it('should handle validation errors', async () => {
      const invalidDto = {
        drugId: 1,
      }

      await request(app.getHttpServer()).post('/inventory').send(invalidDto).expect(400)
    })

    it('should handle duplicate inventory', async () => {
      const createDto: CreateInventoryDto = {
        drugId: 1,
        pharmacyId: 1,
        batchNumber: 'BATCH001',
        quantity: 100,
        minimumThreshold: 10,
        maximumThreshold: 1000,
        validFrom: '2024-01-01',
        validTo: '2026-12-31',
      }

      inventoryService.create.mockRejectedValue(
        new BusinessException(ErrorEnum.DATA_ALREADY_EXISTS),
      )

      await request(app.getHttpServer()).post('/inventory').send(createDto).expect(409)
    })
  })

  describe('GET /inventory/:id', () => {
    it('should return inventory by id', async () => {
      const mockInventory = {
        id: 1,
        drugId: 1,
        pharmacyId: 1,
        batchNumber: 'BATCH001',
      } as InventoryEntity
      inventoryService.findOne.mockResolvedValue(mockInventory)

      const response = await request(app.getHttpServer()).get('/inventory/1').expect(200)

      expect(response.body).toBeDefined()
      expect(response.body.id).toBe(1)
      expect(inventoryService.findOne).toHaveBeenCalledWith(1)
    })

    it('should return 404 when inventory not found', async () => {
      inventoryService.findOne.mockRejectedValue(new BusinessException(ErrorEnum.DATA_NOT_FOUND))

      await request(app.getHttpServer()).get('/inventory/999').expect(404)
    })
  })

  describe('PUT /inventory/:id', () => {
    it('should update inventory successfully', async () => {
      const updateDto: UpdateInventoryDto = {
        drugId: 1,
        pharmacyId: 1,
        batchNumber: 'BATCH001',
        quantity: 200,
        minimumThreshold: 20,
        maximumThreshold: 2000,
        validFrom: '2024-01-01',
        validTo: '2026-12-31',
      }

      const response = await request(app.getHttpServer())
        .put('/inventory/1')
        .send(updateDto)
        .expect(200)

      expect(response.body).toBeDefined()
      expect(inventoryService.update).toHaveBeenCalled()
    })

    it('should handle non-existent inventory', async () => {
      const updateDto: UpdateInventoryDto = {
        drugId: 1,
        pharmacyId: 1,
        batchNumber: 'BATCH002',
        quantity: 200,
        minimumThreshold: 20,
        maximumThreshold: 2000,
        validFrom: '2024-01-01',
        validTo: '2026-12-31',
      }

      inventoryService.update.mockRejectedValue(new BusinessException(ErrorEnum.DATA_NOT_FOUND))

      await request(app.getHttpServer()).put('/inventory/999').send(updateDto).expect(404)
    })
  })

  describe('POST /inventory/:id/adjust', () => {
    it('should adjust inventory quantity successfully', async () => {
      const adjustDto: AdjustInventoryDto = {
        adjustment: 50,
        reason: '入库',
      }

      const response = await request(app.getHttpServer())
        .post('/inventory/1/adjust')
        .send(adjustDto)
        .expect(201)

      expect(response.body).toBeDefined()
      expect(inventoryService.adjustQuantity).toHaveBeenCalled()
    })

    it('should handle non-existent inventory', async () => {
      const adjustDto: AdjustInventoryDto = {
        adjustment: 50,
        reason: '入库',
      }

      inventoryService.adjustQuantity.mockRejectedValue(
        new BusinessException(ErrorEnum.DATA_NOT_FOUND),
      )

      await request(app.getHttpServer()).post('/inventory/999/adjust').send(adjustDto).expect(404)
    })

    it('should handle insufficient inventory', async () => {
      const adjustDto: AdjustInventoryDto = {
        adjustment: -1000,
        reason: '出库',
      }

      inventoryService.adjustQuantity.mockRejectedValue(
        new BusinessException(ErrorEnum.INSUFFICIENT_INVENTORY),
      )

      await request(app.getHttpServer()).post('/inventory/1/adjust').send(adjustDto).expect(409)
    })
  })

  describe('PUT /inventory/:id/freeze', () => {
    it('should freeze inventory successfully', async () => {
      await request(app.getHttpServer())
        .put('/inventory/1/freeze')
        .send({ isFrozen: true })
        .expect(200)

      expect(inventoryService.toggleFrozen).toHaveBeenCalledWith(1, true)
    })

    it('should unfreeze inventory successfully', async () => {
      await request(app.getHttpServer())
        .put('/inventory/1/freeze')
        .send({ isFrozen: false })
        .expect(200)

      expect(inventoryService.toggleFrozen).toHaveBeenCalledWith(1, false)
    })

    it('should handle non-existent inventory', async () => {
      inventoryService.toggleFrozen.mockRejectedValue(
        new BusinessException(ErrorEnum.DATA_NOT_FOUND),
      )

      await request(app.getHttpServer())
        .put('/inventory/999/freeze')
        .send({ isFrozen: true })
        .expect(404)
    })
  })

  describe('DELETE /inventory/:id', () => {
    it('should delete inventory successfully', async () => {
      const response = await request(app.getHttpServer()).delete('/inventory/1').expect(200)

      expect(response.body).toBeDefined()
      expect(inventoryService.remove).toHaveBeenCalled()
    })

    it('should handle non-existent inventory', async () => {
      inventoryService.remove.mockRejectedValue(new BusinessException(ErrorEnum.DATA_NOT_FOUND))

      await request(app.getHttpServer()).delete('/inventory/999').expect(404)
    })
  })
})
