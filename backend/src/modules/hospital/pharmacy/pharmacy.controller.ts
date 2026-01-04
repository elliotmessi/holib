import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { ApiResult } from '~/common/decorators/api-result.decorator'
import { Idempotence } from '~/common/decorators/idempotence.decorator'
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator'
import { CreatorPipe } from '~/common/pipes/creator.pipe'
import { UpdaterPipe } from '~/common/pipes/updater.pipe'
import { definePermission, Perm } from '~/modules/auth/decorators/permission.decorator'

import { PharmacyEntity } from './pharmacy.entity'
import { CreatePharmacyDto, UpdatePharmacyDto, PharmacyQueryDto } from './pharmacy.dto'
import { PharmacyService } from './pharmacy.service'

export const permissions = definePermission('hospital:pharmacy', {
  LIST: 'list',
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
} as const)

@ApiSecurityAuth()
@ApiTags('Hospital - 药房管理模块')
@Controller('pharmacies')
export class PharmacyController {
  constructor(private pharmacyService: PharmacyService) {}

  @Get()
  @ApiOperation({ summary: '获取药房列表' })
  @ApiResult({ type: [PharmacyEntity] })
  @Perm(permissions.LIST)
  async list(@Query() query: PharmacyQueryDto): Promise<PharmacyEntity[]> {
    return this.pharmacyService.findAll(query)
  }

  @Post()
  @ApiOperation({ summary: '创建药房' })
  @Idempotence()
  @Perm(permissions.CREATE)
  async create(@Body(CreatorPipe) createDto: CreatePharmacyDto): Promise<PharmacyEntity> {
    return this.pharmacyService.create(createDto)
  }

  @Get(':id')
  @ApiOperation({ summary: '获取药房详情' })
  @ApiResult({ type: PharmacyEntity })
  @Perm(permissions.READ)
  async info(@Param('id') id: number): Promise<PharmacyEntity> {
    return this.pharmacyService.findOne(id)
  }

  @Put(':id')
  @ApiOperation({ summary: '更新药房信息' })
  @Perm(permissions.UPDATE)
  async update(
    @Param('id') id: number,
    @Body(UpdaterPipe) updateDto: UpdatePharmacyDto,
  ): Promise<void> {
    await this.pharmacyService.update(id, updateDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除药房' })
  @Perm(permissions.DELETE)
  async delete(@Param('id') id: number): Promise<void> {
    await this.pharmacyService.remove(id)
  }
}
