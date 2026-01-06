import { validate } from 'class-validator'
import { plainToClass } from 'class-transformer'
import { vi, describe, expect, it } from 'vitest'

import { DrugStatus } from './drug/drug.entity'

describe('DTO Validation Tests', () => {
  describe('Drug DTO Validation', () => {
    describe('CreateDrugDto', () => {
      it('should validate successfully with valid data', async () => {
        const { CreateDrugDto } = await import('./drug/drug.dto')
        const dto = plainToClass(CreateDrugDto, {
          drugCode: 'DRUG001',
          genericName: '阿司匹林',
          specification: '100mg',
          dosageForm: '片剂',
          manufacturer: '制药厂',
          approvalNumber: '国药准字H2023001',
          drugType: '处方药',
          validFrom: '2024-01-01',
          validTo: '2026-12-31',
          retailPrice: 25.5,
          wholesalePrice: 20.0,
        })
        const errors = await validate(dto)
        expect(errors.length).toBe(0)
      })

      it('should fail validation when drugCode is empty', async () => {
        const { CreateDrugDto } = await import('./drug/drug.dto')
        const dto = plainToClass(CreateDrugDto, {
          drugCode: '',
          genericName: '阿司匹林',
          specification: '100mg',
          dosageForm: '片剂',
          manufacturer: '制药厂',
          approvalNumber: '国药准字H2023001',
          drugType: '处方药',
          validFrom: '2024-01-01',
          validTo: '2026-12-31',
          retailPrice: 25.5,
          wholesalePrice: 20.0,
        })
        const errors = await validate(dto)
        expect(errors.length).toBeGreaterThan(0)
      })

      it('should fail validation when retailPrice is negative', async () => {
        const { CreateDrugDto } = await import('./drug/drug.dto')
        const dto = plainToClass(CreateDrugDto, {
          drugCode: 'DRUG001',
          genericName: '阿司匹林',
          specification: '100mg',
          dosageForm: '片剂',
          manufacturer: '制药厂',
          approvalNumber: '国药准字H2023001',
          drugType: '处方药',
          validFrom: '2024-01-01',
          validTo: '2026-12-31',
          retailPrice: -10,
          wholesalePrice: 20.0,
        })
        const errors = await validate(dto)
        expect(errors.length).toBeGreaterThan(0)
      })

      it('should fail validation when pharmacologicalClassId is negative', async () => {
        const { CreateDrugDto } = await import('./drug/drug.dto')
        const dto = plainToClass(CreateDrugDto, {
          drugCode: 'DRUG001',
          genericName: '阿司匹林',
          specification: '100mg',
          dosageForm: '片剂',
          manufacturer: '制药厂',
          approvalNumber: '国药准字H2023001',
          drugType: '处方药',
          validFrom: '2024-01-01',
          validTo: '2026-12-31',
          retailPrice: 25.5,
          wholesalePrice: 20.0,
          pharmacologicalClassId: -1,
        })
        const errors = await validate(dto)
        expect(errors.length).toBeGreaterThan(0)
      })

      it('should pass validation with optional fields', async () => {
        const { CreateDrugDto } = await import('./drug/drug.dto')
        const dto = plainToClass(CreateDrugDto, {
          drugCode: 'DRUG001',
          genericName: '阿司匹林',
          specification: '100mg',
          dosageForm: '片剂',
          manufacturer: '制药厂',
          approvalNumber: '国药准字H2023001',
          drugType: '处方药',
          validFrom: '2024-01-01',
          validTo: '2026-12-31',
          retailPrice: 25.5,
          wholesalePrice: 20.0,
          tradeName: '拜耳阿司匹林',
          usePurpose: '解热镇痛',
          usageMethod: '口服',
          medicalInsuranceRate: 0.7,
          pharmacologicalClassId: 1,
          dosageClassId: 2,
          departmentClassId: 3,
          description: '这是一款常用药物',
        })
        const errors = await validate(dto)
        expect(errors.length).toBe(0)
      })
    })

    describe('UpdateDrugDto', () => {
      it('should validate successfully with valid status and all required fields', async () => {
        const { UpdateDrugDto } = await import('./drug/drug.dto')
        const dto = plainToClass(UpdateDrugDto, {
          status: DrugStatus.NORMAL,
          drugCode: 'DRUG001',
          genericName: '阿司匹林',
          specification: '100mg',
          dosageForm: '片剂',
          manufacturer: '制药厂',
          approvalNumber: '国药准字H2023001',
          drugType: '处方药',
          validFrom: '2024-01-01',
          validTo: '2026-12-31',
          retailPrice: 25.5,
          wholesalePrice: 20.0,
        })
        const errors = await validate(dto)
        expect(errors.length).toBe(0)
      })

      it('should fail validation with invalid status', async () => {
        const { UpdateDrugDto } = await import('./drug/drug.dto')
        const dto = plainToClass(UpdateDrugDto, {
          status: 'invalid_status',
        })
        const errors = await validate(dto)
        expect(errors.length).toBeGreaterThan(0)
      })
    })

    describe('DrugQueryDto', () => {
      it('should validate successfully with all query parameters', async () => {
        const { DrugQueryDto } = await import('./drug/drug.dto')
        const dto = plainToClass(DrugQueryDto, {
          name: '阿司匹林',
          drugCode: 'DRUG001',
          drugType: '处方药',
          dosageForm: '片剂',
          manufacturer: '制药厂',
          status: DrugStatus.NORMAL,
          pharmacologicalClassId: 1,
        })
        const errors = await validate(dto)
        expect(errors.length).toBe(0)
      })

      it('should validate successfully with empty query', async () => {
        const { DrugQueryDto } = await import('./drug/drug.dto')
        const dto = plainToClass(DrugQueryDto, {})
        const errors = await validate(dto)
        expect(errors.length).toBe(0)
      })

      it('should fail validation when pharmacologicalClassId is negative', async () => {
        const { DrugQueryDto } = await import('./drug/drug.dto')
        const dto = plainToClass(DrugQueryDto, {
          pharmacologicalClassId: -1,
        })
        const errors = await validate(dto)
        expect(errors.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Patient DTO Validation', () => {
    describe('CreatePatientDto', () => {
      it('should validate successfully with valid data', async () => {
        const { CreatePatientDto } = await import('./patient/patient.dto')
        const dto = plainToClass(CreatePatientDto, {
          medicalRecordNumber: 'MRN001',
          name: '张三',
          gender: '男',
          age: 35,
        })
        const errors = await validate(dto)
        expect(errors.length).toBe(0)
      })

      it('should fail validation when age is negative', async () => {
        const { CreatePatientDto } = await import('./patient/patient.dto')
        const dto = plainToClass(CreatePatientDto, {
          medicalRecordNumber: 'MRN001',
          name: '张三',
          gender: '男',
          age: -5,
        })
        const errors = await validate(dto)
        expect(errors.length).toBeGreaterThan(0)
      })

      it('should pass validation with all optional fields', async () => {
        const { CreatePatientDto } = await import('./patient/patient.dto')
        const dto = plainToClass(CreatePatientDto, {
          medicalRecordNumber: 'MRN001',
          name: '张三',
          gender: '男',
          age: 35,
          idCard: '110101199001011234',
          phone: '13800138000',
          height: 175,
          weight: 70,
          bloodType: 'A',
          medicalHistory: '无',
          currentDiagnosis: '感冒',
          remark: '注意休息',
        })
        const errors = await validate(dto)
        expect(errors.length).toBe(0)
      })
    })

    describe('PatientQueryDto', () => {
      it('should validate successfully with all query parameters', async () => {
        const { PatientQueryDto } = await import('./patient/patient.dto')
        const dto = plainToClass(PatientQueryDto, {
          name: '张',
          medicalRecordNumber: 'MRN001',
          idCard: '110101',
          phone: '138',
          gender: '男',
          minAge: 18,
          maxAge: 65,
        })
        const errors = await validate(dto)
        expect(errors.length).toBe(0)
      })

      it('should fail validation when minAge is negative', async () => {
        const { PatientQueryDto } = await import('./patient/patient.dto')
        const dto = plainToClass(PatientQueryDto, {
          minAge: -1,
        })
        const errors = await validate(dto)
        expect(errors.length).toBeGreaterThan(0)
      })

      it('should fail validation when maxAge is negative', async () => {
        const { PatientQueryDto } = await import('./patient/patient.dto')
        const dto = plainToClass(PatientQueryDto, {
          maxAge: -1,
        })
        const errors = await validate(dto)
        expect(errors.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Inventory DTO Validation', () => {
    describe('CreateInventoryDto', () => {
      it('should validate successfully with valid data', async () => {
        const { CreateInventoryDto } = await import('./inventory/inventory.dto')
        const dto = plainToClass(CreateInventoryDto, {
          drugId: 1,
          pharmacyId: 1,
          batchNumber: 'BATCH001',
          quantity: 100,
          minimumThreshold: 10,
          maximumThreshold: 1000,
          storageLocation: 'A区-01',
          validFrom: '2024-01-01',
          validTo: '2026-12-31',
        })
        const errors = await validate(dto)
        expect(errors.length).toBe(0)
      })

      it('should fail validation when quantity is negative', async () => {
        const { CreateInventoryDto } = await import('./inventory/inventory.dto')
        const dto = plainToClass(CreateInventoryDto, {
          drugId: 1,
          pharmacyId: 1,
          batchNumber: 'BATCH001',
          quantity: -10,
          minimumThreshold: 10,
          maximumThreshold: 1000,
          validFrom: '2024-01-01',
          validTo: '2026-12-31',
        })
        const errors = await validate(dto)
        expect(errors.length).toBeGreaterThan(0)
      })

      it('should fail validation when minimumThreshold is negative', async () => {
        const { CreateInventoryDto } = await import('./inventory/inventory.dto')
        const dto = plainToClass(CreateInventoryDto, {
          drugId: 1,
          pharmacyId: 1,
          batchNumber: 'BATCH001',
          quantity: 100,
          minimumThreshold: -5,
          maximumThreshold: 1000,
          validFrom: '2024-01-01',
          validTo: '2026-12-31',
        })
        const errors = await validate(dto)
        expect(errors.length).toBeGreaterThan(0)
      })

      it('should fail validation when drugId is zero', async () => {
        const { CreateInventoryDto } = await import('./inventory/inventory.dto')
        const dto = plainToClass(CreateInventoryDto, {
          drugId: 0,
          pharmacyId: 1,
          batchNumber: 'BATCH001',
          quantity: 100,
          validFrom: '2024-01-01',
          validTo: '2026-12-31',
        })
        const errors = await validate(dto)
        expect(errors.length).toBeGreaterThan(0)
      })
    })

    describe('AdjustInventoryDto', () => {
      it('should validate successfully with valid data', async () => {
        const { AdjustInventoryDto } = await import('./inventory/inventory.dto')
        const dto = plainToClass(AdjustInventoryDto, {
          adjustment: 50,
          reason: '入库',
        })
        const errors = await validate(dto)
        expect(errors.length).toBe(0)
      })

      it('should validate successfully with negative adjustment', async () => {
        const { AdjustInventoryDto } = await import('./inventory/inventory.dto')
        const dto = plainToClass(AdjustInventoryDto, {
          adjustment: -50,
          reason: '出库',
        })
        const errors = await validate(dto)
        expect(errors.length).toBe(0)
      })

      it('should fail validation when reason is empty', async () => {
        const { AdjustInventoryDto } = await import('./inventory/inventory.dto')
        const dto = plainToClass(AdjustInventoryDto, {
          adjustment: 50,
          reason: '',
        })
        const errors = await validate(dto)
        expect(errors.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Prescription DTO Validation', () => {
    describe('CreatePrescriptionDto', () => {
      it('should validate successfully with valid data', async () => {
        const { CreatePrescriptionDto } = await import('./prescription/prescription.dto')
        const dto = plainToClass(CreatePrescriptionDto, {
          patientId: 1,
          pharmacyId: 1,
          diagnosis: '感冒',
          prescriptionDrugs: [
            {
              drugId: 1,
              dosage: 100,
              dosageUnit: 'mg',
              frequency: '一日三次',
              administrationRoute: '口服',
              duration: 7,
              quantity: 21,
              unitPrice: 0.5,
            },
          ],
        })
        const errors = await validate(dto)
        expect(errors.length).toBe(0)
      })

      it('should validate with empty prescriptionDrugs array (no array length validation)', async () => {
        const { CreatePrescriptionDto } = await import('./prescription/prescription.dto')
        const dto = plainToClass(CreatePrescriptionDto, {
          patientId: 1,
          pharmacyId: 1,
          diagnosis: '感冒',
          prescriptionDrugs: [],
        })
        const errors = await validate(dto)
        expect(errors.length).toBe(0)
      })

      it('should fail validation when drug quantity is zero', async () => {
        const { CreatePrescriptionDto } = await import('./prescription/prescription.dto')
        const dto = plainToClass(CreatePrescriptionDto, {
          patientId: 1,
          pharmacyId: 1,
          diagnosis: '感冒',
          prescriptionDrugs: [
            {
              drugId: 1,
              dosage: 100,
              dosageUnit: 'mg',
              frequency: '一日三次',
              administrationRoute: '口服',
              duration: 7,
              quantity: 0,
              unitPrice: 0.5,
            },
          ],
        })
        const errors = await validate(dto)
        expect(errors.length).toBeGreaterThan(0)
      })

      it('should fail validation when drug duration is zero', async () => {
        const { CreatePrescriptionDto } = await import('./prescription/prescription.dto')
        const dto = plainToClass(CreatePrescriptionDto, {
          patientId: 1,
          pharmacyId: 1,
          diagnosis: '感冒',
          prescriptionDrugs: [
            {
              drugId: 1,
              dosage: 100,
              dosageUnit: 'mg',
              frequency: '一日三次',
              administrationRoute: '口服',
              duration: 0,
              quantity: 21,
              unitPrice: 0.5,
            },
          ],
        })
        const errors = await validate(dto)
        expect(errors.length).toBeGreaterThan(0)
      })
    })
  })
})
