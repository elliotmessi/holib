import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { DrugEntity } from './drug.entity'
import { DrugController } from './drug.controller'
import { DrugService } from './drug.service'

@Module({
  imports: [TypeOrmModule.forFeature([DrugEntity])],
  controllers: [DrugController],
  providers: [DrugService],
  exports: [DrugService],
})
export class DrugModule {}
