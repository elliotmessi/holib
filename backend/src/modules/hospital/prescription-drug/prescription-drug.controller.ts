import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { ApiResult } from '~/common/decorators/api-result.decorator'
import { Idempotence } from '~/common/decorators/idempotence.decorator'
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator'
import { CreatorPipe } from '~/common/pipes/creator.pipe'
import { UpdaterPipe } from '~/common/pipes/updater.pipe'
import { definePermission, Perm } from '~/modules/auth/decorators/permission.decorator'

import { PrescriptionDrugEntity } from './prescription-drug.entity'
import {
  CreatePrescriptionDrugDto,
  UpdatePrescriptionDrugDto,
  PrescriptionDrugQueryDto,
} from './prescription-drug.dto'
import { PrescriptionDrugService } from './prescription-drug.service'

export const permissions = definePermission('hospital:prescriptionDrug', {
  LIST: 'list',
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
} as const)

@ApiSecurityAuth()
@ApiTags('Hospital - 处方药品管理模块')
@Controller('prescription-drugs')
export class PrescriptionDrugController {
  constructor(private prescriptionDrugService: PrescriptionDrugService) {}

  @Get()
  @ApiOperation({ summary: '获取处方药品列表' })
  @ApiResult({ type: [PrescriptionDrugEntity] })
  @Perm(permissions.LIST)
  async list(@Query() query: PrescriptionDrugQueryDto): Promise<PrescriptionDrugEntity[]> {
    return this.prescriptionDrugService.findAll(query)
  }

  @Get('by-prescription/:prescriptionId')
  @ApiOperation({ summary: '根据处方ID获取药品列表' })
  @ApiResult({ type: [PrescriptionDrugEntity] })
  @Perm(permissions.LIST)
  async getByPrescription(
    @Param('prescriptionId') prescriptionId: number,
  ): Promise<PrescriptionDrugEntity[]> {
    return this.prescriptionDrugService.findByPrescriptionId(Number(prescriptionId))
  }

  @Post()
  @ApiOperation({ summary: '创建处方药品' })
  @Idempotence()
  @Perm(permissions.CREATE)
  async create(
    @Body(CreatorPipe) createDto: CreatePrescriptionDrugDto,
  ): Promise<PrescriptionDrugEntity> {
    return this.prescriptionDrugService.create(createDto)
  }

  @Get(':id')
  @ApiOperation({ summary: '获取处方药品详情' })
  @ApiResult({ type: PrescriptionDrugEntity })
  @Perm(permissions.READ)
  async info(@Param('id') id: number): Promise<PrescriptionDrugEntity> {
    return this.prescriptionDrugService.findOne(id)
  }

  @Put(':id')
  @ApiOperation({ summary: '更新处方药品' })
  @Perm(permissions.UPDATE)
  async update(
    @Param('id') id: number,
    @Body(UpdaterPipe) updateDto: UpdatePrescriptionDrugDto,
  ): Promise<void> {
    await this.prescriptionDrugService.update(id, updateDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除处方药品' })
  @Perm(permissions.DELETE)
  async delete(@Param('id') id: number): Promise<void> {
    await this.prescriptionDrugService.remove(id)
  }
}
