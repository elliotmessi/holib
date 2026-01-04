import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { ApiResult } from '~/common/decorators/api-result.decorator'
import { Idempotence } from '~/common/decorators/idempotence.decorator'
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator'
import { CreatorPipe } from '~/common/pipes/creator.pipe'
import { AuthUser } from '~/modules/auth/decorators/auth-user.decorator'
import { definePermission, Perm } from '~/modules/auth/decorators/permission.decorator'

import { PrescriptionEntity } from './prescription.entity'
import {
  CreatePrescriptionDto,
  ReviewPrescriptionDto,
  PrescriptionQueryDto,
} from './prescription.dto'
import { PrescriptionService } from './prescription.service'

export const permissions = definePermission('hospital:prescription', {
  LIST: 'list',
  CREATE: 'create',
  READ: 'read',
  REVIEW: 'review',
  DISPENSE: 'dispense',
  CANCEL: 'cancel',
  PENDING_REVIEW: 'pendingReview',
  STATS: 'stats',
} as const)

@ApiSecurityAuth()
@ApiTags('Hospital - 处方管理模块')
@Controller('prescriptions')
export class PrescriptionController {
  constructor(private prescriptionService: PrescriptionService) {}

  @Get()
  @ApiOperation({ summary: '获取处方列表' })
  @ApiResult({ type: [PrescriptionEntity] })
  @Perm(permissions.LIST)
  async list(@Query() query: PrescriptionQueryDto): Promise<PrescriptionEntity[]> {
    return this.prescriptionService.findAll(query)
  }

  @Get('pending-review/:pharmacyId')
  @ApiOperation({ summary: '获取待审核的处方' })
  @ApiResult({ type: [PrescriptionEntity] })
  @Perm(permissions.PENDING_REVIEW)
  async getPendingReview(@Param('pharmacyId') pharmacyId: number): Promise<PrescriptionEntity[]> {
    return this.prescriptionService.getPendingReview(Number(pharmacyId))
  }

  @Get('stats')
  @ApiOperation({ summary: '获取处方统计' })
  @Perm(permissions.STATS)
  async getStats(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('doctorId') doctorId?: number,
  ): Promise<any> {
    return this.prescriptionService.getStats(startDate, endDate, doctorId)
  }

  @Post()
  @ApiOperation({ summary: '创建处方' })
  @Idempotence()
  @Perm(permissions.CREATE)
  async create(
    @Body(CreatorPipe) createDto: CreatePrescriptionDto,
    @AuthUser('uid') uid: number,
  ): Promise<PrescriptionEntity> {
    return this.prescriptionService.create(createDto, uid)
  }

  @Get(':id')
  @ApiOperation({ summary: '获取处方详情' })
  @ApiResult({ type: PrescriptionEntity })
  @Perm(permissions.READ)
  async info(@Param('id') id: number): Promise<PrescriptionEntity> {
    return this.prescriptionService.findOne(id)
  }

  @Put(':id/review')
  @ApiOperation({ summary: '审核处方' })
  @Perm(permissions.REVIEW)
  async review(
    @Param('id') id: number,
    @Body() reviewDto: ReviewPrescriptionDto,
    @AuthUser('uid') uid: number,
  ): Promise<void> {
    await this.prescriptionService.review(id, reviewDto, uid)
  }

  @Post(':id/dispense')
  @ApiOperation({ summary: '发药' })
  @Perm(permissions.DISPENSE)
  async dispense(@Param('id') id: number): Promise<void> {
    await this.prescriptionService.dispense(id)
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: '取消处方' })
  @Perm(permissions.CANCEL)
  async cancel(@Param('id') id: number, @Body('reason') reason: string): Promise<void> {
    await this.prescriptionService.cancel(id, reason)
  }
}
