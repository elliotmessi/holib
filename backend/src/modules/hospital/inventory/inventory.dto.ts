import { ApiProperty } from '@nestjs/swagger'
import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  IsNumber,
  IsDateString,
  IsBoolean,
  MaxLength,
} from 'class-validator'

export class CreateInventoryDto {
  @ApiProperty({ description: '药品ID' })
  @IsInt()
  @Min(1)
  drugId: number

  @ApiProperty({ description: '药房ID' })
  @IsInt()
  @Min(1)
  pharmacyId: number

  @ApiProperty({ description: '批次号' })
  @IsString()
  @Min(1)
  @MaxLength(50)
  batchNumber: string

  @ApiProperty({ description: '库存数量' })
  @IsInt()
  @Min(0)
  quantity: number

  @ApiProperty({ description: '最低库存阈值', required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  minimumThreshold?: number

  @ApiProperty({ description: '最高库存阈值', required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  maximumThreshold?: number

  @ApiProperty({ description: '库存位置', required: false })
  @IsString()
  @IsOptional()
  storageLocation?: string

  @ApiProperty({ description: '有效期起始日期' })
  @IsDateString()
  validFrom: string

  @ApiProperty({ description: '有效期截止日期' })
  @IsDateString()
  validTo: string
}

export class UpdateInventoryDto extends CreateInventoryDto {
  @ApiProperty({ description: '是否冻结', required: false })
  @IsBoolean()
  @IsOptional()
  isFrozen?: boolean
}

export class InventoryQueryDto {
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

  @ApiProperty({ description: '批次号', required: false })
  @IsString()
  @IsOptional()
  batchNumber?: string

  @ApiProperty({ description: '是否只查询未冻结的', required: false })
  @IsBoolean()
  @IsOptional()
  unfrozenOnly?: boolean

  @ApiProperty({ description: '是否查询库存不足的', required: false })
  @IsBoolean()
  @IsOptional()
  lowStockOnly?: boolean
}

export class AdjustInventoryDto {
  @ApiProperty({ description: '调整数量（可正可负）' })
  @IsNumber()
  adjustment: number

  @ApiProperty({ description: '调整原因' })
  @IsString()
  @Min(1)
  reason: string
}

export class FreezeInventoryDto {
  @ApiProperty({ description: '是否冻结' })
  @IsBoolean()
  isFrozen: boolean
}
