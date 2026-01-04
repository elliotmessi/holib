import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { PrescriptionDrugEntity } from './prescription-drug.entity'
import { PrescriptionDrugController } from './prescription-drug.controller'
import { PrescriptionDrugService } from './prescription-drug.service'

@Module({
  imports: [TypeOrmModule.forFeature([PrescriptionDrugEntity])],
  controllers: [PrescriptionDrugController],
  providers: [PrescriptionDrugService],
  exports: [PrescriptionDrugService],
})
export class PrescriptionDrugModule {}
