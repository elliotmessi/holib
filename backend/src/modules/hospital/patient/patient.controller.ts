import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { ApiResult } from '~/common/decorators/api-result.decorator'
import { Idempotence } from '~/common/decorators/idempotence.decorator'
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator'
import { CreatorPipe } from '~/common/pipes/creator.pipe'
import { UpdaterPipe } from '~/common/pipes/updater.pipe'
import { definePermission, Perm } from '~/modules/auth/decorators/permission.decorator'

import { PatientEntity } from './patient.entity'
import { CreatePatientDto, UpdatePatientDto, PatientQueryDto } from './patient.dto'
import { PatientService } from './patient.service'

export const permissions = definePermission('hospital:patient', {
  LIST: 'list',
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
} as const)

@ApiSecurityAuth()
@ApiTags('Hospital - 病人管理模块')
@Controller('patients')
export class PatientController {
  constructor(private patientService: PatientService) {}

  @Get()
  @ApiOperation({ summary: '获取病人列表' })
  @ApiResult({ type: [PatientEntity] })
  @Perm(permissions.LIST)
  async list(@Query() query: PatientQueryDto): Promise<PatientEntity[]> {
    return this.patientService.findAll(query)
  }

  @Get('by-mrn/:medicalRecordNumber')
  @ApiOperation({ summary: '根据病历号获取病人' })
  @ApiResult({ type: PatientEntity })
  @Perm(permissions.READ)
  async getByMedicalRecordNumber(
    @Param('medicalRecordNumber') medicalRecordNumber: string,
  ): Promise<PatientEntity> {
    return this.patientService.findByMedicalRecordNumber(medicalRecordNumber)
  }

  @Get('by-id-card/:idCard')
  @ApiOperation({ summary: '根据身份证号获取病人' })
  @ApiResult({ type: PatientEntity })
  @Perm(permissions.READ)
  async getByIdCard(@Param('idCard') idCard: string): Promise<PatientEntity> {
    return this.patientService.findByIdCard(idCard)
  }

  @Post()
  @ApiOperation({ summary: '创建病人' })
  @Idempotence()
  @Perm(permissions.CREATE)
  async create(@Body(CreatorPipe) createDto: CreatePatientDto): Promise<PatientEntity> {
    return this.patientService.create(createDto)
  }

  @Get(':id')
  @ApiOperation({ summary: '获取病人详情' })
  @ApiResult({ type: PatientEntity })
  @Perm(permissions.READ)
  async info(@Param('id') id: number): Promise<PatientEntity> {
    return this.patientService.findOne(id)
  }

  @Put(':id')
  @ApiOperation({ summary: '更新病人信息' })
  @Perm(permissions.UPDATE)
  async update(
    @Param('id') id: number,
    @Body(UpdaterPipe) updateDto: UpdatePatientDto,
  ): Promise<void> {
    await this.patientService.update(id, updateDto)
  }

  @Put(':id/diagnosis')
  @ApiOperation({ summary: '更新病人诊断' })
  @Perm(permissions.UPDATE)
  async updateDiagnosis(
    @Param('id') id: number,
    @Body('diagnosis') diagnosis: string,
  ): Promise<void> {
    await this.patientService.updateDiagnosis(id, diagnosis)
  }

  @Put(':id/allergy')
  @ApiOperation({ summary: '更新病人过敏史' })
  @Perm(permissions.UPDATE)
  async updateAllergyHistory(
    @Param('id') id: number,
    @Body('allergyHistory') allergyHistory: string,
  ): Promise<void> {
    await this.patientService.updateAllergyHistory(id, allergyHistory)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除病人' })
  @Perm(permissions.DELETE)
  async delete(@Param('id') id: number): Promise<void> {
    await this.patientService.remove(id)
  }
}
