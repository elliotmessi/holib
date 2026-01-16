import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { BusinessException } from '~/common/exceptions/biz.exception'
import { ErrorEnum } from '~/constants/error-code.constant'

import { PatientEntity } from './patient.entity'
import { CreatePatientDto, UpdatePatientDto, PatientQueryDto } from './patient.dto'
import { PatientService } from './patient.service'

describe('PatientService', () => {
  let service: PatientService
  let patientRepository: Mocked<Repository<PatientEntity>>

  const mockPatientEntity: Partial<PatientEntity> = {
    id: 1,
    medicalRecordNumber: 'MRN001',
    name: '李四',
    gender: '男',
    age: 35,
    idCard: '110101198501011234',
    phone: '13900139000',
    height: 175.0,
    weight: 70.0,
    bloodType: 'A型',
    allergyHistory: '无',
    medicalHistory: '高血压',
    currentDiagnosis: '上呼吸道感染',
    remark: '无特殊',
  }

  const mockPatientRepository = {
    findOneBy: vi.fn().mockResolvedValue(undefined),
    create: vi.fn().mockReturnValue(mockPatientEntity as PatientEntity),
    save: vi.fn().mockResolvedValue(mockPatientEntity as PatientEntity),
    createQueryBuilder: vi.fn().mockReturnValue({
      andWhere: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnThis(),
      take: vi.fn().mockReturnThis(),
      skip: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      offset: vi.fn().mockReturnThis(),
      getMany: vi.fn().mockResolvedValue([mockPatientEntity as PatientEntity]),
      getManyAndCount: vi.fn().mockResolvedValue([[mockPatientEntity as PatientEntity], 1]),
    }),
    findOne: vi.fn().mockResolvedValue(mockPatientEntity as PatientEntity),
    delete: vi.fn().mockResolvedValue({ affected: 1 }),
  }

  beforeEach(async () => {
    vi.clearAllMocks()

    // Reset the mock functions to their default behavior
    mockPatientRepository.findOne.mockResolvedValue(mockPatientEntity as PatientEntity)
    mockPatientRepository.findOneBy.mockResolvedValue(undefined)

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PatientService,
        {
          provide: getRepositoryToken(PatientEntity),
          useValue: mockPatientRepository,
        },
      ],
    }).compile()

    service = module.get<PatientService>(PatientService)
    patientRepository = module.get(getRepositoryToken(PatientEntity)) as Mocked<
      Repository<PatientEntity>
    >
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('should create a new patient successfully', async () => {
      const createDto: CreatePatientDto = {
        medicalRecordNumber: 'MRN001',
        name: '李四',
        gender: '男',
        age: 35,
        idCard: '110101198501011234',
        phone: '13900139000',
      }

      const result = await service.create(createDto)

      expect(result).toBeDefined()
      expect(patientRepository.create).toHaveBeenCalled()
      expect(patientRepository.save).toHaveBeenCalled()
    })

    it('should create a new patient without idCard', async () => {
      const createDto: CreatePatientDto = {
        medicalRecordNumber: 'MRN002',
        name: '王五',
        gender: '女',
        age: 28,
        phone: '13800138000',
      }

      const result = await service.create(createDto)

      expect(result).toBeDefined()
      expect(patientRepository.create).toHaveBeenCalled()
      expect(patientRepository.save).toHaveBeenCalled()
    })

    it('should throw error when medical record number already exists', async () => {
      const createDto: CreatePatientDto = {
        medicalRecordNumber: 'MRN001',
        name: '李四',
        gender: '男',
        age: 35,
        idCard: '110101198501011234',
      }

      patientRepository.findOneBy.mockResolvedValue(mockPatientEntity as PatientEntity)

      await expect(service.create(createDto)).rejects.toThrow(BusinessException)
      await expect(service.create(createDto)).rejects.toThrow('数据已存在')
    })

    it('should throw error when idCard already exists', async () => {
      const createDto: CreatePatientDto = {
        medicalRecordNumber: 'MRN002',
        name: '王五',
        gender: '女',
        age: 28,
        idCard: '110101198501011234',
      }

      // First call: check medical record number (returns undefined)
      // Second call: check idCard (returns existing patient)
      patientRepository.findOneBy.mockImplementation((whereClause: any) => {
        if (whereClause.medicalRecordNumber) {
          return Promise.resolve(undefined)
        }
        if (whereClause.idCard) {
          return Promise.resolve(mockPatientEntity as PatientEntity)
        }
        return Promise.resolve(undefined)
      })

      await expect(service.create(createDto)).rejects.toThrow(BusinessException)
      await expect(service.create(createDto)).rejects.toThrow('数据已存在')
    })
  })

  describe('findAll', () => {
    it('should return all patients', async () => {
      const query: PatientQueryDto = {}

      const result = await service.findAll(query)

      expect(result).toBeDefined()
      expect(result.items).toHaveLength(1)
      expect(patientRepository.createQueryBuilder).toHaveBeenCalled()
    })

    it('should return filtered patients by name', async () => {
      const query: PatientQueryDto = {
        name: '李四',
      }

      const result = await service.findAll(query)

      expect(result).toBeDefined()
      expect(patientRepository.createQueryBuilder).toHaveBeenCalled()
    })

    it('should return filtered patients by medicalRecordNumber', async () => {
      const query: PatientQueryDto = {
        medicalRecordNumber: 'MRN001',
      }

      const result = await service.findAll(query)

      expect(result).toBeDefined()
      expect(patientRepository.createQueryBuilder).toHaveBeenCalled()
    })

    it('should return filtered patients by idCard', async () => {
      const query: PatientQueryDto = {
        idCard: '110101198501011234',
      }

      const result = await service.findAll(query)

      expect(result).toBeDefined()
      expect(patientRepository.createQueryBuilder).toHaveBeenCalled()
    })

    it('should return filtered patients by phone', async () => {
      const query: PatientQueryDto = {
        phone: '13900139000',
      }

      const result = await service.findAll(query)

      expect(result).toBeDefined()
      expect(patientRepository.createQueryBuilder).toHaveBeenCalled()
    })

    it('should return filtered patients by gender', async () => {
      const query: PatientQueryDto = {
        gender: '男',
      }

      const result = await service.findAll(query)

      expect(result).toBeDefined()
      expect(patientRepository.createQueryBuilder).toHaveBeenCalled()
    })

    it('should return filtered patients by minAge', async () => {
      const query: PatientQueryDto = {
        minAge: 30,
      }

      const result = await service.findAll(query)

      expect(result).toBeDefined()
      expect(patientRepository.createQueryBuilder).toHaveBeenCalled()
    })

    it('should return filtered patients by maxAge', async () => {
      const query: PatientQueryDto = {
        maxAge: 40,
      }

      const result = await service.findAll(query)

      expect(result).toBeDefined()
      expect(patientRepository.createQueryBuilder).toHaveBeenCalled()
    })

    it('should return filtered patients by age range', async () => {
      const query: PatientQueryDto = {
        minAge: 30,
        maxAge: 40,
      }

      const result = await service.findAll(query)

      expect(result).toBeDefined()
      expect(patientRepository.createQueryBuilder).toHaveBeenCalled()
    })
  })

  describe('findOne', () => {
    it('should return patient by id', async () => {
      const result = await service.findOne(1)

      expect(result).toBeDefined()
      expect(result.id).toBe(1)
      expect(result.name).toBe('李四')
      expect(patientRepository.findOne).toHaveBeenCalled()
    })

    it('should throw error when patient not found', async () => {
      patientRepository.findOne.mockResolvedValue(undefined)

      await expect(service.findOne(999)).rejects.toThrow(BusinessException)
      await expect(service.findOne(999)).rejects.toThrow('数据不存在')
    })
  })

  describe('findByMedicalRecordNumber', () => {
    it('should return patient by medical record number', async () => {
      patientRepository.findOneBy.mockResolvedValue(mockPatientEntity as PatientEntity)

      const result = await service.findByMedicalRecordNumber('MRN001')

      expect(result).toBeDefined()
      expect(result.medicalRecordNumber).toBe('MRN001')
      expect(patientRepository.findOneBy).toHaveBeenCalled()
    })

    it('should throw error when patient not found by medical record number', async () => {
      patientRepository.findOneBy.mockResolvedValue(undefined)

      await expect(service.findByMedicalRecordNumber('MRN999')).rejects.toThrow(BusinessException)
      await expect(service.findByMedicalRecordNumber('MRN999')).rejects.toThrow('数据不存在')
    })
  })

  describe('findByIdCard', () => {
    it('should return patient by idCard', async () => {
      patientRepository.findOneBy.mockResolvedValue(mockPatientEntity as PatientEntity)

      const result = await service.findByIdCard('110101198501011234')

      expect(result).toBeDefined()
      expect(result.idCard).toBe('110101198501011234')
      expect(patientRepository.findOneBy).toHaveBeenCalled()
    })

    it('should throw error when patient not found by idCard', async () => {
      patientRepository.findOneBy.mockResolvedValue(undefined)

      await expect(service.findByIdCard('999999999999999999')).rejects.toThrow(BusinessException)
      await expect(service.findByIdCard('999999999999999999')).rejects.toThrow('数据不存在')
    })
  })

  describe('update', () => {
    it('should update patient successfully', async () => {
      const updateDto: UpdatePatientDto = {
        medicalRecordNumber: 'MRN001',
        name: '李四（更新）',
        gender: '男',
        age: 36,
        idCard: '110101198501011234',
        phone: '13900139000',
        height: 175.0,
        weight: 72.0,
        bloodType: 'A型',
        medicalHistory: '高血压',
        currentDiagnosis: '上呼吸道感染',
        remark: '无特殊',
      }

      await service.update(1, updateDto)

      expect(patientRepository.findOne).toHaveBeenCalled()
      expect(patientRepository.save).toHaveBeenCalled()
    })

    it('should throw error when updating non-existent patient', async () => {
      patientRepository.findOne.mockResolvedValue(undefined)

      const updateDto: UpdatePatientDto = {
        medicalRecordNumber: 'MRN001',
        name: '李四（更新）',
        gender: '男',
        age: 36,
        idCard: '110101198501011234',
        phone: '13900139000',
        height: 175.0,
        weight: 72.0,
        bloodType: 'A型',
        medicalHistory: '高血压',
        currentDiagnosis: '上呼吸道感染',
        remark: '无特殊',
      }

      await expect(service.update(999, updateDto)).rejects.toThrow(BusinessException)
      await expect(service.update(999, updateDto)).rejects.toThrow('数据不存在')
    })

    it('should throw error when updating with duplicate medicalRecordNumber', async () => {
      patientRepository.findOneBy.mockResolvedValue(mockPatientEntity as PatientEntity)

      const updateDto: UpdatePatientDto = {
        medicalRecordNumber: 'MRN002', // This already exists in mock
        name: '李四',
        gender: '男',
        age: 35,
      }

      await expect(service.update(1, updateDto)).rejects.toThrow(BusinessException)
      await expect(service.update(1, updateDto)).rejects.toThrow('数据已存在')
    })

    it('should throw error when updating with duplicate idCard', async () => {
      // Create a mock patient with different idCard
      const mockPatientWithDifferentIdCard = {
        ...mockPatientEntity,
        idCard: '110101198501019999', // Different from the one we're testing
      } as PatientEntity

      patientRepository.findOne.mockResolvedValue(mockPatientWithDifferentIdCard)
      patientRepository.findOneBy.mockResolvedValue(mockPatientEntity as PatientEntity) // Returns existing patient for idCard check

      const updateDto: UpdatePatientDto = {
        medicalRecordNumber: 'MRN001',
        name: '李四',
        gender: '男',
        age: 35,
        idCard: '110101198501011234', // This already exists in mockPatientEntity
      }

      await expect(service.update(1, updateDto)).rejects.toThrow(BusinessException)
      await expect(service.update(1, updateDto)).rejects.toThrow('数据已存在')
    })

    it('should update patient successfully without changing medicalRecordNumber', async () => {
      patientRepository.findOneBy.mockResolvedValue(undefined)

      const updateDto = {
        name: '李四（更新）',
        gender: '男',
        age: 36,
        phone: '13900139000',
        height: 175.0,
        weight: 72.0,
      }

      await service.update(1, updateDto)

      expect(patientRepository.findOne).toHaveBeenCalled()
      expect(patientRepository.save).toHaveBeenCalled()
    })

    it('should update patient successfully without changing idCard', async () => {
      patientRepository.findOneBy.mockResolvedValue(undefined)

      const updateDto: UpdatePatientDto = {
        medicalRecordNumber: 'MRN001',
        name: '李四（更新）',
        gender: '男',
        age: 36,
        phone: '13900139000',
      }

      await service.update(1, updateDto)

      expect(patientRepository.findOne).toHaveBeenCalled()
      expect(patientRepository.save).toHaveBeenCalled()
    })

    it('should update patient successfully when not providing idCard', async () => {
      patientRepository.findOneBy.mockResolvedValue(undefined)

      const updateDto: UpdatePatientDto = {
        medicalRecordNumber: 'MRN001',
        name: '李四（更新）',
        gender: '男',
        age: 36,
        phone: '13900139000',
      }

      await service.update(1, updateDto)

      expect(patientRepository.findOne).toHaveBeenCalled()
      expect(patientRepository.save).toHaveBeenCalled()
    })

    it('should update patient successfully with new unique idCard', async () => {
      // Create a mock patient with different idCard
      const mockPatientWithDifferentIdCard = {
        ...mockPatientEntity,
        idCard: '110101198501019999', // Different from the one we're testing
      } as PatientEntity

      patientRepository.findOne.mockResolvedValue(mockPatientWithDifferentIdCard)
      patientRepository.findOneBy.mockResolvedValue(undefined) // No existing patient for the new idCard

      const updateDto: UpdatePatientDto = {
        medicalRecordNumber: 'MRN001',
        name: '李四',
        gender: '男',
        age: 35,
        idCard: '110101198501015555', // This is a new unique idCard
      }

      await service.update(1, updateDto)

      expect(patientRepository.findOne).toHaveBeenCalled()
      expect(patientRepository.findOneBy).toHaveBeenCalled()
      expect(patientRepository.save).toHaveBeenCalled()
    })

    it('should throw error when medical record number already exists', async () => {
      const updateDto: UpdatePatientDto = {
        medicalRecordNumber: 'MRN002',
        name: '李四（更新）',
        gender: '男',
        age: 36,
        idCard: '110101198501011234',
        phone: '13900139000',
        height: 175.0,
        weight: 72.0,
        bloodType: 'A型',
        medicalHistory: '高血压',
        currentDiagnosis: '上呼吸道感染',
        remark: '无特殊',
      }

      patientRepository.findOne.mockResolvedValue(mockPatientEntity as PatientEntity)
      patientRepository.findOneBy.mockResolvedValue(mockPatientEntity as PatientEntity)

      await expect(service.update(1, updateDto)).rejects.toThrow(BusinessException)
      await expect(service.update(1, updateDto)).rejects.toThrow('数据已存在')
    })

    it('should throw error when idCard already exists', async () => {
      const updateDto: UpdatePatientDto = {
        medicalRecordNumber: 'MRN001',
        name: '李四（更新）',
        gender: '男',
        age: 36,
        idCard: '110101198501011235',
        phone: '13900139000',
        height: 175.0,
        weight: 72.0,
        bloodType: 'A型',
        medicalHistory: '高血压',
        currentDiagnosis: '上呼吸道感染',
        remark: '无特殊',
      }

      patientRepository.findOne.mockResolvedValue(mockPatientEntity as PatientEntity)
      patientRepository.findOneBy.mockImplementation((whereClause: any) => {
        if (whereClause.medicalRecordNumber) {
          return Promise.resolve(undefined)
        }
        if (whereClause.idCard) {
          return Promise.resolve(mockPatientEntity as PatientEntity)
        }
        return Promise.resolve(undefined)
      })

      await expect(service.update(1, updateDto)).rejects.toThrow(BusinessException)
      await expect(service.update(1, updateDto)).rejects.toThrow('数据已存在')
    })

    it('should update patient without changing medical record number and idCard', async () => {
      const updateDto: UpdatePatientDto = {
        medicalRecordNumber: 'MRN001',
        name: '李四（更新）',
        gender: '男',
        age: 36,
        idCard: '110101198501011234',
        phone: '13900139000',
        height: 175.0,
        weight: 72.0,
        bloodType: 'A型',
        medicalHistory: '高血压',
        currentDiagnosis: '上呼吸道感染',
        remark: '无特殊',
      }

      patientRepository.findOne.mockResolvedValue(mockPatientEntity as PatientEntity)
      patientRepository.findOneBy.mockResolvedValue(undefined)

      await service.update(1, updateDto)

      expect(patientRepository.findOne).toHaveBeenCalled()
      expect(patientRepository.save).toHaveBeenCalled()
    })
  })

  describe('remove', () => {
    it('should delete patient successfully', async () => {
      await service.remove(1)

      expect(patientRepository.findOne).toHaveBeenCalled()
      expect(patientRepository.delete).toHaveBeenCalled()
    })

    it('should throw error when deleting non-existent patient', async () => {
      patientRepository.findOne.mockResolvedValue(undefined)

      await expect(service.remove(999)).rejects.toThrow(BusinessException)
      await expect(service.remove(999)).rejects.toThrow('数据不存在')
    })
  })

  describe('updateDiagnosis', () => {
    it('should update patient diagnosis successfully', async () => {
      await service.updateDiagnosis(1, '肺炎')

      expect(patientRepository.findOne).toHaveBeenCalled()
      expect(patientRepository.save).toHaveBeenCalled()
    })

    it('should throw error when updating diagnosis for non-existent patient', async () => {
      patientRepository.findOne.mockResolvedValue(undefined)

      await expect(service.updateDiagnosis(999, '肺炎')).rejects.toThrow(BusinessException)
      await expect(service.updateDiagnosis(999, '肺炎')).rejects.toThrow('数据不存在')
    })
  })

  describe('updateAllergyHistory', () => {
    it('should update patient allergy history successfully', async () => {
      await service.updateAllergyHistory(1, '青霉素过敏')

      expect(patientRepository.findOne).toHaveBeenCalled()
      expect(patientRepository.save).toHaveBeenCalled()
    })

    it('should throw error when updating allergy history for non-existent patient', async () => {
      patientRepository.findOne.mockResolvedValue(undefined)

      await expect(service.updateAllergyHistory(999, '青霉素过敏')).rejects.toThrow(
        BusinessException,
      )
      await expect(service.updateAllergyHistory(999, '青霉素过敏')).rejects.toThrow('数据不存在')
    })
  })
})
