import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { ApiResult } from '~/common/decorators/api-result.decorator'
import { Idempotence } from '~/common/decorators/idempotence.decorator'
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator'
import { CreatorPipe } from '~/common/pipes/creator.pipe'
import { UpdaterPipe } from '~/common/pipes/updater.pipe'
import { definePermission, Perm } from '~/modules/auth/decorators/permission.decorator'

import { PatientAllergyEntity } from './patient-allergy.entity'
import {
  CreatePatientAllergyDto,
  UpdatePatientAllergyDto,
  PatientAllergyQueryDto,
} from './patient-allergy.dto'
import { PatientAllergyService } from './patient-allergy.service'

export const permissions = definePermission('hospital:patientAllergy', {
  LIST: 'list',
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
} as const)

@ApiSecurityAuth()
@ApiTags('Hospital - 病人过敏史管理模块')
@Controller('patient-allergies')
export class PatientAllergyController {
  constructor(private allergyService: PatientAllergyService) {}

  @Get()
  @ApiOperation({ summary: '获取病人过敏史列表' })
  @ApiResult({ type: [PatientAllergyEntity] })
  @Perm(permissions.LIST)
  async list(@Query() query: PatientAllergyQueryDto): Promise<PatientAllergyEntity[]> {
    return this.allergyService.findAll(query)
  }

  @Get('by-patient/:patientId')
  @ApiOperation({ summary: '根据病人ID获取过敏史' })
  @ApiResult({ type: [PatientAllergyEntity] })
  @Perm(permissions.LIST)
  async getByPatient(@Param('patientId') patientId: number): Promise<PatientAllergyEntity[]> {
    return this.allergyService.findByPatientId(Number(patientId))
  }

  @Post()
  @ApiOperation({ summary: '创建过敏史' })
  @Idempotence()
  @Perm(permissions.CREATE)
  async create(
    @Body(CreatorPipe) createDto: CreatePatientAllergyDto,
  ): Promise<PatientAllergyEntity> {
    return this.allergyService.create(createDto)
  }

  @Get(':id')
  @ApiOperation({ summary: '获取过敏史详情' })
  @ApiResult({ type: PatientAllergyEntity })
  @Perm(permissions.READ)
  async info(@Param('id') id: number): Promise<PatientAllergyEntity> {
    return this.allergyService.findOne(id)
  }

  @Put(':id')
  @ApiOperation({ summary: '更新过敏史' })
  @Perm(permissions.UPDATE)
  async update(
    @Param('id') id: number,
    @Body(UpdaterPipe) updateDto: UpdatePatientAllergyDto,
  ): Promise<void> {
    await this.allergyService.update(id, updateDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除过敏史' })
  @Perm(permissions.DELETE)
  async delete(@Param('id') id: number): Promise<void> {
    await this.allergyService.remove(id)
  }
}
