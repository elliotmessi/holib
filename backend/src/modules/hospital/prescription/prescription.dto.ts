import { ApiProperty } from '@nestjs/swagger'
import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  MinLength,
  IsNumber,
  IsEnum,
  IsArray,
  ValidateNested,
  MaxLength,
} from 'class-validator'
import { Type } from 'class-transformer'

import { PrescriptionStatus } from './prescription.entity'

export class PrescriptionDrugDto {
  @ApiProperty({ description: '药品ID' })
  @IsInt()
  @Min(1)
  drugId: number

  @ApiProperty({ description: '剂量' })
  @IsNumber()
  dosage: number

  @ApiProperty({ description: '剂量单位' })
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  dosageUnit: string

  @ApiProperty({ description: '用药频率' })
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  frequency: string

  @ApiProperty({ description: '给药途径' })
  @IsString()
  @MinLength(1)
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
}

export class CreatePrescriptionDto {
  @ApiProperty({ description: '病人ID' })
  @IsInt()
  @Min(1)
  patientId: number

  @ApiProperty({ description: '药房ID' })
  @IsInt()
  @Min(1)
  pharmacyId: number

  @ApiProperty({ description: '诊断结果' })
  @IsString()
  diagnosis: string

  @ApiProperty({ description: '处方药品列表', type: [PrescriptionDrugDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PrescriptionDrugDto)
  prescriptionDrugs: PrescriptionDrugDto[]

  @ApiProperty({ description: '备注', required: false })
  @IsString()
  @IsOptional()
  remark?: string
}

export class ReviewPrescriptionDto {
  @ApiProperty({ description: '审核状态', enum: PrescriptionStatus })
  @IsEnum(PrescriptionStatus)
  status: PrescriptionStatus

  @ApiProperty({ description: '审核意见' })
  @IsString()
  @IsOptional()
  reviewComments?: string
}

export class CancelPrescriptionDto {
  @ApiProperty({ description: '取消原因' })
  @IsString()
  reason: string
}

export class PrescriptionQueryDto {
  @ApiProperty({ description: '病人ID', required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  patientId?: number

  @ApiProperty({ description: '医生ID', required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  doctorId?: number

  @ApiProperty({ description: '药房ID', required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  pharmacyId?: number

  @ApiProperty({ description: '处方状态', enum: PrescriptionStatus, required: false })
  @IsEnum(PrescriptionStatus)
  @IsOptional()
  status?: PrescriptionStatus

  @ApiProperty({ description: '起始日期', required: false })
  @IsString()
  @IsOptional()
  startDate?: string

  @ApiProperty({ description: '结束日期', required: false })
  @IsString()
  @IsOptional()
  endDate?: string
}
