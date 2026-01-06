import { ApiProperty } from '@nestjs/swagger'
import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  IsNumber,
  IsDateString,
  MaxLength,
} from 'class-validator'
import { PartialType } from '@nestjs/mapped-types'

export class CreatePrescriptionDrugDto {
  @ApiProperty({ description: '处方ID' })
  @IsInt()
  @Min(1)
  prescriptionId: number

  @ApiProperty({ description: '药品ID' })
  @IsInt()
  @Min(1)
  drugId: number

  @ApiProperty({ description: '剂量' })
  @IsNumber()
  dosage: number

  @ApiProperty({ description: '剂量单位' })
  @IsString()
  @Min(1)
  @MaxLength(20)
  dosageUnit: string

  @ApiProperty({ description: '用药频率' })
  @IsString()
  @Min(1)
  @MaxLength(20)
  frequency: string

  @ApiProperty({ description: '给药途径' })
  @IsString()
  @Min(1)
  @MaxLength(20)
  administrationRoute: string

  @ApiProperty({ description: '用药天数' })
  @IsInt()
  @Min(1)
  duration: number

  @ApiProperty({ description: '数量' })
  @IsInt()
  @Min(1)
  quantity: number

  @ApiProperty({ description: '单价' })
  @IsNumber()
  @Min(0)
  unitPrice: number

  @ApiProperty({ description: '使用说明', required: false })
  @IsString()
  @IsOptional()
  usageInstructions?: string
}

export class UpdatePrescriptionDrugDto extends PartialType(CreatePrescriptionDrugDto) {}

export class PrescriptionDrugQueryDto {
  @ApiProperty({ description: '处方ID', required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  prescriptionId?: number

  @ApiProperty({ description: '药品ID', required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  drugId?: number
}
