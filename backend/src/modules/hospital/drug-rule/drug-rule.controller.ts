import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { ApiResult } from '~/common/decorators/api-result.decorator'
import { Idempotence } from '~/common/decorators/idempotence.decorator'
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator'
import { CreatorPipe } from '~/common/pipes/creator.pipe'
import { UpdaterPipe } from '~/common/pipes/updater.pipe'
import { definePermission, Perm } from '~/modules/auth/decorators/permission.decorator'

import { DrugPrescriptionRuleEntity } from './drug-rule.entity'
import { CreateDrugRuleDto, UpdateDrugRuleDto, DrugRuleQueryDto } from './drug-rule.dto'
import { DrugRuleService } from './drug-rule.service'

export const permissions = definePermission('drug:rule', {
  LIST: 'list',
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  TOGGLE: 'toggle',
} as const)

@ApiSecurityAuth()
@ApiTags('Drug - 药品处方规则模块')
@Controller('drug-rules')
export class DrugRuleController {
  constructor(private ruleService: DrugRuleService) {}

  @Get()
  @ApiOperation({ summary: '获取药品处方规则列表' })
  @ApiResult({ type: [DrugPrescriptionRuleEntity] })
  @Perm(permissions.LIST)
  async list(@Query() query: DrugRuleQueryDto): Promise<DrugPrescriptionRuleEntity[]> {
    return this.ruleService.findAll(query)
  }

  @Get('by-drug/:drugId')
  @ApiOperation({ summary: '根据药品ID获取处方规则' })
  @ApiResult({ type: [DrugPrescriptionRuleEntity] })
  @Perm(permissions.LIST)
  async getByDrug(
    @Param('drugId') drugId: number,
    @Query('activeOnly') activeOnly?: boolean,
  ): Promise<DrugPrescriptionRuleEntity[]> {
    return this.ruleService.findByDrugId(Number(drugId), activeOnly !== false)
  }

  @Post()
  @ApiOperation({ summary: '创建药品处方规则' })
  @Idempotence()
  @Perm(permissions.CREATE)
  async create(
    @Body(CreatorPipe) createDto: CreateDrugRuleDto,
  ): Promise<DrugPrescriptionRuleEntity> {
    return this.ruleService.create(createDto)
  }

  @Get(':id')
  @ApiOperation({ summary: '获取药品处方规则详情' })
  @ApiResult({ type: DrugPrescriptionRuleEntity })
  @Perm(permissions.READ)
  async info(@Param('id') id: number): Promise<DrugPrescriptionRuleEntity> {
    return this.ruleService.findOne(id)
  }

  @Put(':id')
  @ApiOperation({ summary: '更新药品处方规则' })
  @Perm(permissions.UPDATE)
  async update(
    @Param('id') id: number,
    @Body(UpdaterPipe) updateDto: UpdateDrugRuleDto,
  ): Promise<void> {
    await this.ruleService.update(id, updateDto)
  }

  @Put(':id/toggle')
  @ApiOperation({ summary: '切换规则激活状态' })
  @Perm(permissions.TOGGLE)
  async toggle(@Param('id') id: number, @Body('isActive') isActive: boolean): Promise<void> {
    await this.ruleService.toggleActive(id, isActive)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除药品处方规则' })
  @Perm(permissions.DELETE)
  async delete(@Param('id') id: number): Promise<void> {
    await this.ruleService.remove(id)
  }
}
