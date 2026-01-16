import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { vi, afterEach, beforeEach, describe, expect, it } from 'vitest'

import { BusinessException } from '~/common/exceptions/biz.exception'
import { ErrorEnum } from '~/constants/error-code.constant'
import { AllExceptionsFilter } from '~/common/filters/any-exception.filter'

import { DepartmentController } from './department.controller'
import { DepartmentEntity, DepartmentType } from './department.entity'
import { CreateDepartmentDto, UpdateDepartmentDto, DepartmentQueryDto } from './department.dto'
import { DepartmentService } from './department.service'

describe('DepartmentController', () => {
  let app: INestApplication
  let departmentService: any

  const mockDepartmentService = {
    findAll: vi.fn().mockResolvedValue([]),
    findTree: vi.fn().mockResolvedValue([]),
    create: vi
      .fn()
      .mockResolvedValue({ id: 1, departmentCode: 'DEP001', name: '内科' } as DepartmentEntity),
    findOne: vi
      .fn()
      .mockResolvedValue({ id: 1, departmentCode: 'DEP001', name: '内科' } as DepartmentEntity),
    update: vi.fn().mockResolvedValue(undefined),
    remove: vi.fn().mockResolvedValue(undefined),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DepartmentController],
      providers: [
        {
          provide: DepartmentService,
          useValue: mockDepartmentService,
        },
        {
          provide: getRepositoryToken(DepartmentEntity),
          useValue: {
            find: vi.fn(),
            save: vi.fn(),
            findOne: vi.fn(),
            delete: vi.fn(),
          } as Partial<Repository<DepartmentEntity>>,
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

    departmentService = module.get(DepartmentService)
  })

  afterEach(async () => {
    if (app) {
      await app.close()
    }
    vi.clearAllMocks()
  })

  describe('GET /departments', () => {
    it('should return all departments with pagination', async () => {
      const mockDepartments = {
        items: [
          { id: 1, departmentCode: 'DEP001', name: '内科' } as DepartmentEntity,
          { id: 2, departmentCode: 'DEP002', name: '外科' } as DepartmentEntity,
        ],
        total: 2,
        page: 1,
        pageSize: 10,
      }
      departmentService.findAll.mockResolvedValue(mockDepartments)

      const response = await request(app.getHttpServer()).get('/departments').expect(200)

      expect(response.body).toBeDefined()
      expect(response.body.items).toBeDefined()
      expect(departmentService.findAll).toHaveBeenCalled()
    })

    it('should return departments with query parameters', async () => {
      const mockDepartments = {
        items: [
          { id: 1, departmentCode: 'DEP001', name: '内科' } as DepartmentEntity,
        ],
        total: 1,
        page: 1,
        pageSize: 10,
      }
      departmentService.findAll.mockResolvedValue(mockDepartments)

      const query: DepartmentQueryDto = { name: '内科', type: DepartmentType.CLINICAL }
      const response = await request(app.getHttpServer())
        .get('/departments')
        .query(query)
        .expect(200)

      expect(response.body).toBeDefined()
      expect(response.body.items).toBeDefined()
      expect(departmentService.findAll).toHaveBeenCalledWith(query)
    })

    it('should handle service errors', async () => {
      departmentService.findAll.mockRejectedValue(new BusinessException(ErrorEnum.SERVER_ERROR))

      await request(app.getHttpServer()).get('/departments').expect(500)
    })
  })

  describe('GET /departments/tree', () => {
    it('should return department tree structure', async () => {
      const mockTree = [
        {
          id: 1,
          name: '内科',
          children: [{ id: 2, name: '心内科' }],
        } as DepartmentEntity,
      ]
      departmentService.findTree.mockResolvedValue(mockTree)

      const response = await request(app.getHttpServer())
        .get('/departments/tree')
        .query({ hospitalId: 1 })
        .expect(200)

      expect(response.body).toBeDefined()
      expect(departmentService.findTree).toHaveBeenCalledWith(1)
    })

    it('should return tree without hospitalId', async () => {
      const mockTree: DepartmentEntity[] = []
      departmentService.findTree.mockResolvedValue(mockTree)

      await request(app.getHttpServer()).get('/departments/tree').expect(200)

      expect(departmentService.findTree).toHaveBeenCalledWith(undefined)
    })

    it('should handle service errors', async () => {
      departmentService.findTree.mockRejectedValue(new BusinessException(ErrorEnum.SERVER_ERROR))

      await request(app.getHttpServer()).get('/departments/tree').expect(500)
    })
  })

  describe('POST /departments', () => {
    it('should create a new department', async () => {
      const createDto: CreateDepartmentDto = {
        departmentCode: 'DEP001',
        name: '内科',
        type: DepartmentType.CLINICAL,
        hospitalId: 1,
        director: '张医生',
        phone: '010-12345678',
        location: '门诊楼一楼',
        description: '内科科室',
      }

      const response = await request(app.getHttpServer())
        .post('/departments')
        .send(createDto)
        .expect(201)

      expect(response.body).toBeDefined()
      expect(departmentService.create).toHaveBeenCalled()
    })

    it('should handle validation errors', async () => {
      const invalidDto = {
        name: '内科',
      }

      await request(app.getHttpServer()).post('/departments').send(invalidDto).expect(400)
    })

    it('should handle duplicate department code', async () => {
      const createDto: CreateDepartmentDto = {
        departmentCode: 'DEP001',
        name: '内科',
        type: DepartmentType.CLINICAL,
        hospitalId: 1,
      }

      departmentService.create.mockRejectedValue(
        new BusinessException(ErrorEnum.DEPARTMENT_CODE_EXISTS),
      )

      await request(app.getHttpServer()).post('/departments').send(createDto).expect(409)
    })
  })

  describe('GET /departments/:id', () => {
    it('should return department by id', async () => {
      const mockDepartment = { id: 1, departmentCode: 'DEP001', name: '内科' } as DepartmentEntity
      departmentService.findOne.mockResolvedValue(mockDepartment)

      const response = await request(app.getHttpServer()).get('/departments/1').expect(200)

      expect(response.body).toBeDefined()
      expect(response.body.id).toBe(1)
      expect(departmentService.findOne).toHaveBeenCalledWith(1)
    })

    it('should return 404 when department not found', async () => {
      departmentService.findOne.mockRejectedValue(
        new BusinessException(ErrorEnum.DEPARTMENT_NOT_FOUND),
      )

      await request(app.getHttpServer()).get('/departments/999').expect(404)
    })
  })

  describe('PUT /departments/:id', () => {
    it('should update department successfully', async () => {
      const updateDto: UpdateDepartmentDto = {
        departmentCode: 'DEP001',
        name: '内科（更新）',
        type: DepartmentType.CLINICAL,
        hospitalId: 1,
        director: '李医生',
        phone: '010-87654321',
        location: '门诊楼二楼',
        description: '更新后的内科科室',
      }

      const response = await request(app.getHttpServer())
        .put('/departments/1')
        .send(updateDto)
        .expect(200)

      expect(response.body).toBeDefined()
      expect(departmentService.update).toHaveBeenCalled()
    })

    it('should handle non-existent department', async () => {
      const updateDto: UpdateDepartmentDto = {
        departmentCode: 'DEP002',
        name: '外科',
        type: DepartmentType.CLINICAL,
        hospitalId: 1,
      }

      departmentService.update.mockRejectedValue(
        new BusinessException(ErrorEnum.DEPARTMENT_NOT_FOUND),
      )

      await request(app.getHttpServer()).put('/departments/999').send(updateDto).expect(404)
    })
  })

  describe('DELETE /departments/:id', () => {
    it('should delete department successfully', async () => {
      const response = await request(app.getHttpServer()).delete('/departments/1').expect(200)

      expect(response.body).toBeDefined()
      expect(departmentService.remove).toHaveBeenCalled()
    })

    it('should handle non-existent department', async () => {
      departmentService.remove.mockRejectedValue(
        new BusinessException(ErrorEnum.DEPARTMENT_NOT_FOUND),
      )

      await request(app.getHttpServer()).delete('/departments/999').expect(404)
    })

    it('should handle department with associated users', async () => {
      departmentService.remove.mockRejectedValue(
        new BusinessException(ErrorEnum.DEPARTMENT_HAS_ASSOCIATED_USERS),
      )

      await request(app.getHttpServer()).delete('/departments/1').expect(409)
    })

    it('should handle department with associated roles', async () => {
      departmentService.remove.mockRejectedValue(
        new BusinessException(ErrorEnum.DEPARTMENT_HAS_ASSOCIATED_ROLES),
      )

      await request(app.getHttpServer()).delete('/departments/1').expect(409)
    })

    it('should handle department with child departments', async () => {
      departmentService.remove.mockRejectedValue(
        new BusinessException(ErrorEnum.DEPARTMENT_HAS_CHILD_DEPARTMENTS),
      )

      await request(app.getHttpServer()).delete('/departments/1').expect(409)
    })
  })
})
