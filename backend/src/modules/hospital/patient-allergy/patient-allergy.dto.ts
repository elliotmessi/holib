import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsOptional, IsInt, Min, IsEnum, IsDateString } from 'class-validator'

import { AllergyType, AllergySeverity } from './patient-allergy.entity'

export class CreatePatientAllergyDto {
  @ApiProperty({ description: '病人ID' })
  @IsInt()
  @Min(1)
  patientId: number

  @ApiProperty({ description: '过敏药品ID', required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  drugId?: number

  @ApiProperty({ description: '过敏原名称（非药品过敏时必填）', required: false })
  @IsString()
  @IsOptional()
  allergenName?: string

  @ApiProperty({ description: '过敏类型', enum: AllergyType })
  @IsEnum(AllergyType)
  allergyType: AllergyType

  @ApiProperty({ description: '过敏反应' })
  @IsString()
  reaction: string

  @ApiProperty({ description: '发生日期', required: false })
  @IsDateString()
  @IsOptional()
  occurrenceDate?: string

  @ApiProperty({ description: '严重程度', enum: AllergySeverity })
  @IsEnum(AllergySeverity)
  severity: AllergySeverity

  @ApiProperty({ description: '备注', required: false })
  @IsString()
  @IsOptional()
  notes?: string
}

export class UpdatePatientAllergyDto extends CreatePatientAllergyDto {}

export class PatientAllergyQueryDto {
  @ApiProperty({ description: '病人ID', required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  patientId?: number

  @ApiProperty({ description: '过敏类型', enum: AllergyType, required: false })
  @IsEnum(AllergyType)
  @IsOptional()
  allergyType?: AllergyType

  @ApiProperty({ description: '严重程度', enum: AllergySeverity, required: false })
  @IsEnum(AllergySeverity)
  @IsOptional()
  severity?: AllergySeverity

  @ApiProperty({ description: '是否只查询激活的', required: false })
  @IsOptional()
  activeOnly?: boolean
}
