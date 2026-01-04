import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { PharmacyEntity } from './pharmacy.entity'
import { PharmacyController } from './pharmacy.controller'
import { PharmacyService } from './pharmacy.service'

@Module({
  imports: [TypeOrmModule.forFeature([PharmacyEntity])],
  controllers: [PharmacyController],
  providers: [PharmacyService],
  exports: [PharmacyService],
})
export class PharmacyModule {}
