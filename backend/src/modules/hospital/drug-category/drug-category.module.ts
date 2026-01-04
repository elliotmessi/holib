import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { DrugCategoryEntity } from './drug-category.entity'
import { DrugCategoryController } from './drug-category.controller'
import { DrugCategoryService } from './drug-category.service'

@Module({
  imports: [TypeOrmModule.forFeature([DrugCategoryEntity])],
  controllers: [DrugCategoryController],
  providers: [DrugCategoryService],
  exports: [DrugCategoryService],
})
export class DrugCategoryModule {}
