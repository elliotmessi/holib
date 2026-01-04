import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsOptional, IsInt, Min, IsNumber, IsEnum } from 'class-validator'

import { InventoryTransactionType } from './inventory-transaction.entity'

export class CreateInventoryTransactionDto {
  @ApiProperty({ description: '药品ID' })
  @IsInt()
  @Min(1)
  drugId: number

  @ApiProperty({ description: '药房ID' })
  @IsInt()
  @Min(1)
  pharmacyId: number

  @ApiProperty({ description: '交易类型', enum: InventoryTransactionType })
  @IsEnum(InventoryTransactionType)
  transactionType: InventoryTransactionType

  @ApiProperty({ description: '数量' })
  @IsInt()
  @Min(1)
  quantity: number

  @ApiProperty({ description: '单价' })
  @IsNumber()
  @Min(0)
  unitPrice: number

  @ApiProperty({ description: '总价' })
  @IsNumber()
  @Min(0)
  totalAmount: number

  @ApiProperty({ description: '批次号', required: false })
  @IsString()
  @IsOptional()
  batchNumber?: string

  @ApiProperty({ description: '交易原因', required: false })
  @IsString()
  @IsOptional()
  reason?: string

  @ApiProperty({ description: '关联ID（如处方ID）', required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  referenceId?: number

  @ApiProperty({ description: '关联类型', required: false })
  @IsString()
  @IsOptional()
  referenceType?: string
}

export class InventoryTransactionQueryDto {
  @ApiProperty({ description: '药品ID', required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  drugId?: number

  @ApiProperty({ description: '药房ID', required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  pharmacyId?: number

  @ApiProperty({ description: '交易类型', enum: InventoryTransactionType, required: false })
  @IsEnum(InventoryTransactionType)
  @IsOptional()
  transactionType?: InventoryTransactionType

  @ApiProperty({ description: '关联ID', required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  referenceId?: number

  @ApiProperty({ description: '起始日期', required: false })
  @IsString()
  @IsOptional()
  startDate?: string

  @ApiProperty({ description: '结束日期', required: false })
  @IsString()
  @IsOptional()
  endDate?: string
}
