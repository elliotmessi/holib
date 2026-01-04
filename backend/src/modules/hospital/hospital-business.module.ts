import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { HospitalEntity } from './hospital/hospital.entity'
import { HospitalController } from './hospital/hospital.controller'
import { HospitalService } from './hospital/hospital.service'
import { DepartmentModule } from './department/department.module'
import { PharmacyModule } from './pharmacy/pharmacy.module'
import { DoctorModule } from './doctor/doctor.module'
import { DoctorController } from './doctor/doctor.controller'
import { DoctorService } from './doctor/doctor.service'
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
    TypeOrmModule.forFeature([HospitalEntity]),
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
  controllers: [HospitalController, DoctorController],
  providers: [HospitalService, DoctorService],
  exports: [HospitalService, DoctorService, TypeOrmModule],
})
export class HospitalBusinessModule {}
