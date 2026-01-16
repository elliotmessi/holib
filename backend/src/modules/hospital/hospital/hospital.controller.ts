import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { ApiResult } from '~/common/decorators/api-result.decorator'
import { Idempotence } from '~/common/decorators/idempotence.decorator'
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator'
import { CreatorPipe } from '~/common/pipes/creator.pipe'
import { UpdaterPipe } from '~/common/pipes/updater.pipe'
import { Pagination } from '~/helper/paginate/pagination'
import { AuthUser } from '~/modules/auth/decorators/auth-user.decorator'
import { definePermission, Perm } from '~/modules/auth/decorators/permission.decorator'

import { HospitalEntity } from './hospital.entity'
import { CreateHospitalDto, UpdateHospitalDto, HospitalQueryDto } from './hospital.dto'
import { HospitalService } from './hospital.service'

export const permissions = definePermission('hospital:hospital', {
  LIST: 'list',
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
} as const)

@ApiSecurityAuth()
@ApiTags('Hospital - 医院管理模块')
@Controller('hospitals')
export class HospitalController {
  constructor(private hospitalService: HospitalService) {}

  @Get()
  @ApiOperation({ summary: '获取医院列表' })
  @ApiResult({ type: [HospitalEntity], isPage: true })
  @Perm(permissions.LIST)
  async list(@Query() query: HospitalQueryDto): Promise<Pagination<HospitalEntity>> {
    return this.hospitalService.findAll(query)
  }

  @Post()
  @ApiOperation({ summary: '创建医院' })
  @Idempotence()
  @Perm(permissions.CREATE)
  async create(
    @Body(CreatorPipe) createDto: CreateHospitalDto,
    @AuthUser('uid') uid: number,
  ): Promise<HospitalEntity> {
    return this.hospitalService.create(createDto)
  }

  @Get(':id')
  @ApiOperation({ summary: '获取医院详情' })
  @ApiResult({ type: HospitalEntity })
  @Perm(permissions.READ)
  async info(@Param('id') id: number): Promise<HospitalEntity> {
    return this.hospitalService.findOne(id)
  }

  @Put(':id')
  @ApiOperation({ summary: '更新医院信息' })
  @Perm(permissions.UPDATE)
  async update(
    @Param('id') id: number,
    @Body(UpdaterPipe) updateDto: UpdateHospitalDto,
  ): Promise<void> {
    await this.hospitalService.update(id, updateDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除医院' })
  @Perm(permissions.DELETE)
  async delete(@Param('id') id: number): Promise<void> {
    await this.hospitalService.remove(id)
  }
}
