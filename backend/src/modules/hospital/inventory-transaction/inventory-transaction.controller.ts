import { Controller, Get, Param, Post, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { ApiResult } from '~/common/decorators/api-result.decorator'
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator'
import { AuthUser } from '~/modules/auth/decorators/auth-user.decorator'
import { definePermission, Perm } from '~/modules/auth/decorators/permission.decorator'

import { InventoryTransactionEntity } from './inventory-transaction.entity'
import {
  CreateInventoryTransactionDto,
  InventoryTransactionQueryDto,
} from './inventory-transaction.dto'
import { InventoryTransactionService } from './inventory-transaction.service'

export const permissions = definePermission('inventory:transaction', {
  LIST: 'list',
  READ: 'read',
  STATS: 'stats',
} as const)

@ApiSecurityAuth()
@ApiTags('Inventory - 库存变动记录模块')
@Controller('inventory-transactions')
export class InventoryTransactionController {
  constructor(private transactionService: InventoryTransactionService) {}

  @Get()
  @ApiOperation({ summary: '获取库存变动记录列表' })
  @ApiResult({ type: [InventoryTransactionEntity] })
  @Perm(permissions.LIST)
  async list(@Query() query: InventoryTransactionQueryDto): Promise<InventoryTransactionEntity[]> {
    return this.transactionService.findAll(query)
  }

  @Get('by-reference/:referenceId')
  @ApiOperation({ summary: '根据关联ID获取变动记录' })
  @ApiResult({ type: [InventoryTransactionEntity] })
  @Perm(permissions.LIST)
  async getByReference(
    @Param('referenceId') referenceId: number,
    @Query('referenceType') referenceType?: string,
  ): Promise<InventoryTransactionEntity[]> {
    return this.transactionService.findByReferenceId(Number(referenceId), referenceType)
  }

  @Get('stats')
  @ApiOperation({ summary: '获取库存变动统计' })
  @Perm(permissions.STATS)
  async getStats(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('pharmacyId') pharmacyId?: number,
  ): Promise<any> {
    return this.transactionService.getTransactionStats(startDate, endDate, pharmacyId)
  }

  @Get(':id')
  @ApiOperation({ summary: '获取库存变动记录详情' })
  @ApiResult({ type: InventoryTransactionEntity })
  @Perm(permissions.READ)
  async info(@Param('id') id: number): Promise<InventoryTransactionEntity> {
    return this.transactionService.findOne(id)
  }
}
