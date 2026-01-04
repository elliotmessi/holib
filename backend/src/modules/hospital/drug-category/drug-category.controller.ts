import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { ApiResult } from '~/common/decorators/api-result.decorator'
import { Idempotence } from '~/common/decorators/idempotence.decorator'
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator'
import { CreatorPipe } from '~/common/pipes/creator.pipe'
import { UpdaterPipe } from '~/common/pipes/updater.pipe'
import { definePermission, Perm } from '~/modules/auth/decorators/permission.decorator'

import { DrugCategoryEntity } from './drug-category.entity'
import {
  CreateDrugCategoryDto,
  UpdateDrugCategoryDto,
  DrugCategoryQueryDto,
} from './drug-category.dto'
import { DrugCategoryService } from './drug-category.service'

export const permissions = definePermission('drug:category', {
  LIST: 'list',
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
} as const)

@ApiSecurityAuth()
@ApiTags('Drug - 药品分类管理模块')
@Controller('drug-categories')
export class DrugCategoryController {
  constructor(private categoryService: DrugCategoryService) {}

  @Get()
  @ApiOperation({ summary: '获取药品分类列表' })
  @ApiResult({ type: [DrugCategoryEntity] })
  @Perm(permissions.LIST)
  async list(@Query() query: DrugCategoryQueryDto): Promise<DrugCategoryEntity[]> {
    return this.categoryService.findAll(query)
  }

  @Get('tree')
  @ApiOperation({ summary: '获取药品分类树形结构' })
  @ApiResult({ type: [DrugCategoryEntity] })
  @Perm(permissions.LIST)
  async tree(@Query('type') type?: string): Promise<DrugCategoryEntity[]> {
    return this.categoryService.findTree(type as any)
  }

  @Post()
  @ApiOperation({ summary: '创建药品分类' })
  @Idempotence()
  @Perm(permissions.CREATE)
  async create(@Body(CreatorPipe) createDto: CreateDrugCategoryDto): Promise<DrugCategoryEntity> {
    return this.categoryService.create(createDto)
  }

  @Get(':id')
  @ApiOperation({ summary: '获取药品分类详情' })
  @ApiResult({ type: DrugCategoryEntity })
  @Perm(permissions.READ)
  async info(@Param('id') id: number): Promise<DrugCategoryEntity> {
    return this.categoryService.findOne(id)
  }

  @Put(':id')
  @ApiOperation({ summary: '更新药品分类信息' })
  @Perm(permissions.UPDATE)
  async update(
    @Param('id') id: number,
    @Body(UpdaterPipe) updateDto: UpdateDrugCategoryDto,
  ): Promise<void> {
    await this.categoryService.update(id, updateDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除药品分类' })
  @Perm(permissions.DELETE)
  async delete(@Param('id') id: number): Promise<void> {
    await this.categoryService.remove(id)
  }
}
