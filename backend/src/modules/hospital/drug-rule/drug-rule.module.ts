import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { DrugPrescriptionRuleEntity } from './drug-rule.entity'
import { DrugRuleController } from './drug-rule.controller'
import { DrugRuleService } from './drug-rule.service'

@Module({
  imports: [TypeOrmModule.forFeature([DrugPrescriptionRuleEntity])],
  controllers: [DrugRuleController],
  providers: [DrugRuleService],
  exports: [DrugRuleService],
})
export class DrugRuleModule {}
