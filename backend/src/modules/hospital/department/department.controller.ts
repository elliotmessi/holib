import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { ApiResult } from '~/common/decorators/api-result.decorator'
import { Idempotence } from '~/common/decorators/idempotence.decorator'
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator'
import { CreatorPipe } from '~/common/pipes/creator.pipe'
import { UpdaterPipe } from '~/common/pipes/updater.pipe'
import { AuthUser } from '~/modules/auth/decorators/auth-user.decorator'
import { definePermission, Perm } from '~/modules/auth/decorators/permission.decorator'

import { DepartmentEntity } from './department.entity'
import { CreateDepartmentDto, UpdateDepartmentDto, DepartmentQueryDto } from './department.dto'
import { DepartmentService } from './department.service'

export const permissions = definePermission('hospital:department', {
  LIST: 'list',
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
} as const)

@ApiSecurityAuth()
@ApiTags('Hospital - 科室管理模块')
@Controller('departments')
export class DepartmentController {
  constructor(private departmentService: DepartmentService) {}

  @Get()
  @ApiOperation({ summary: '获取科室列表' })
  @ApiResult({ type: [DepartmentEntity] })
  @Perm(permissions.LIST)
  async list(@Query() query: DepartmentQueryDto): Promise<DepartmentEntity[]> {
    return this.departmentService.findAll(query)
  }

  @Get('tree')
  @ApiOperation({ summary: '获取科室树形结构' })
  @ApiResult({ type: [DepartmentEntity] })
  @Perm(permissions.LIST)
  async tree(@Query('hospitalId') hospitalId?: number): Promise<DepartmentEntity[]> {
    return this.departmentService.findTree(hospitalId)
  }

  @Post()
  @ApiOperation({ summary: '创建科室' })
  @Idempotence()
  @Perm(permissions.CREATE)
  async create(@Body(CreatorPipe) createDto: CreateDepartmentDto): Promise<DepartmentEntity> {
    return this.departmentService.create(createDto)
  }

  @Get(':id')
  @ApiOperation({ summary: '获取科室详情' })
  @ApiResult({ type: DepartmentEntity })
  @Perm(permissions.READ)
  async info(@Param('id') id: number): Promise<DepartmentEntity> {
    return this.departmentService.findOne(id)
  }

  @Put(':id')
  @ApiOperation({ summary: '更新科室信息' })
  @Perm(permissions.UPDATE)
  async update(
    @Param('id') id: number,
    @Body(UpdaterPipe) updateDto: UpdateDepartmentDto,
  ): Promise<void> {
    await this.departmentService.update(id, updateDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除科室' })
  @Perm(permissions.DELETE)
  async delete(@Param('id') id: number): Promise<void> {
    await this.departmentService.remove(id)
  }
}
