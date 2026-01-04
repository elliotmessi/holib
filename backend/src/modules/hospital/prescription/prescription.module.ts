import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { PrescriptionEntity } from './prescription.entity'
import { PrescriptionController } from './prescription.controller'
import { PrescriptionService } from './prescription.service'

@Module({
  imports: [TypeOrmModule.forFeature([PrescriptionEntity])],
  controllers: [PrescriptionController],
  providers: [PrescriptionService],
  exports: [PrescriptionService],
})
export class PrescriptionModule {}
