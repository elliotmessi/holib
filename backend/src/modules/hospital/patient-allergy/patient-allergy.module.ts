import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { PatientAllergyEntity } from './patient-allergy.entity'
import { PatientAllergyController } from './patient-allergy.controller'
import { PatientAllergyService } from './patient-allergy.service'

@Module({
  imports: [TypeOrmModule.forFeature([PatientAllergyEntity])],
  controllers: [PatientAllergyController],
  providers: [PatientAllergyService],
  exports: [PatientAllergyService],
})
export class PatientAllergyModule {}
