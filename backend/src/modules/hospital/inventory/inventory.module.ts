import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { InventoryEntity } from './inventory.entity'
import { InventoryController } from './inventory.controller'
import { InventoryService } from './inventory.service'
import { InventoryTransactionEntity } from '../inventory-transaction/inventory-transaction.entity'

@Module({
  imports: [TypeOrmModule.forFeature([InventoryEntity, InventoryTransactionEntity])],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {}
