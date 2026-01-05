import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { HospitalModule } from './hospital/hospital.module'
import { DepartmentModule } from './department/department.module'
import { PharmacyModule } from './pharmacy/pharmacy.module'
import { DoctorModule } from './doctor/doctor.module'
import { DrugCategoryModule } from './drug-category/drug-category.module'
import { DrugModule } from './drug/drug.module'
import { DrugRuleModule } from './drug-rule/drug-rule.module'
import { InventoryModule } from './inventory/inventory.module'
import { InventoryTransactionModule } from './inventory-transaction/inventory-transaction.module'
import { PatientModule } from './patient/patient.module'
import { PatientAllergyModule } from './patient-allergy/patient-allergy.module'
import { PrescriptionModule } from './prescription/prescription.module'
import { PrescriptionDrugModule } from './prescription-drug/prescription-drug.module'

@Module({
  imports: [
    HospitalModule,
    DepartmentModule,
    PharmacyModule,
    DoctorModule,
    DrugCategoryModule,
    DrugModule,
    DrugRuleModule,
    InventoryModule,
    InventoryTransactionModule,
    PatientModule,
    PatientAllergyModule,
    PrescriptionModule,
    PrescriptionDrugModule,
  ],
  exports: [
    HospitalModule,
    DepartmentModule,
    PharmacyModule,
    DoctorModule,
    DrugCategoryModule,
    DrugModule,
    DrugRuleModule,
    InventoryModule,
    InventoryTransactionModule,
    PatientModule,
    PatientAllergyModule,
    PrescriptionModule,
    PrescriptionDrugModule,
  ],
})
export class HospitalBusinessModule {}
