import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { InventoryTransactionEntity } from './inventory-transaction.entity'
import { InventoryTransactionController } from './inventory-transaction.controller'
import { InventoryTransactionService } from './inventory-transaction.service'

@Module({
  imports: [TypeOrmModule.forFeature([InventoryTransactionEntity])],
  controllers: [InventoryTransactionController],
  providers: [InventoryTransactionService],
  exports: [InventoryTransactionService],
})
export class InventoryTransactionModule {}
