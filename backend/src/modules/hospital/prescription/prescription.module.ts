import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { PrescriptionEntity } from './prescription.entity'
import { PrescriptionController } from './prescription.controller'
import { PrescriptionService } from './prescription.service'
import { PrescriptionDrugEntity } from '../prescription-drug/prescription-drug.entity'
import { InventoryEntity } from '../inventory/inventory.entity'
import { InventoryTransactionEntity } from '../inventory-transaction/inventory-transaction.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PrescriptionEntity,
      PrescriptionDrugEntity,
      InventoryEntity,
      InventoryTransactionEntity,
    ]),
  ],
  controllers: [PrescriptionController],
  providers: [PrescriptionService],
  exports: [PrescriptionService],
})
export class PrescriptionModule {}
