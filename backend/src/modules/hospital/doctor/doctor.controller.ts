import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { ApiResult } from '~/common/decorators/api-result.decorator'
import { Idempotence } from '~/common/decorators/idempotence.decorator'
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator'
import { CreatorPipe } from '~/common/pipes/creator.pipe'
import { UpdaterPipe } from '~/common/pipes/updater.pipe'
import { definePermission, Perm } from '~/modules/auth/decorators/permission.decorator'

import { DoctorEntity } from './doctor.entity'
import { CreateDoctorDto, UpdateDoctorDto, DoctorQueryDto, ChangePasswordDto } from './doctor.dto'
import { DoctorService } from './doctor.service'

export const permissions = definePermission('hospital:doctor', {
  LIST: 'list',
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  CHANGE_PASSWORD: 'changePassword',
} as const)

@ApiSecurityAuth()
@ApiTags('Hospital - 医生管理模块')
@Controller('doctors')
export class DoctorController {
  constructor(private doctorService: DoctorService) {}

  @Get()
  @ApiOperation({ summary: '获取医生列表' })
  @ApiResult({ type: [DoctorEntity] })
  @Perm(permissions.LIST)
  async list(@Query() query: DoctorQueryDto): Promise<DoctorEntity[]> {
    return this.doctorService.findAll(query)
  }

  @Post()
  @ApiOperation({ summary: '创建医生' })
  @Idempotence()
  @Perm(permissions.CREATE)
  async create(@Body(CreatorPipe) createDto: CreateDoctorDto): Promise<DoctorEntity> {
    return this.doctorService.create(createDto)
  }

  @Get(':id')
  @ApiOperation({ summary: '获取医生详情' })
  @ApiResult({ type: DoctorEntity })
  @Perm(permissions.READ)
  async info(@Param('id') id: number): Promise<DoctorEntity> {
    return this.doctorService.findOne(id)
  }

  @Put(':id')
  @ApiOperation({ summary: '更新医生信息' })
  @Perm(permissions.UPDATE)
  async update(
    @Param('id') id: number,
    @Body(UpdaterPipe) updateDto: UpdateDoctorDto,
  ): Promise<void> {
    await this.doctorService.update(id, updateDto)
  }

  @Put(':id/password')
  @ApiOperation({ summary: '修改密码' })
  @Perm(permissions.CHANGE_PASSWORD)
  async changePassword(
    @Param('id') id: number,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    await this.doctorService.changePassword(id, changePasswordDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除医生' })
  @Perm(permissions.DELETE)
  async delete(@Param('id') id: number): Promise<void> {
    await this.doctorService.remove(id)
  }
}
