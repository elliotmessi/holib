import { ApiProperty } from '@nestjs/swagger'
import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  MinLength,
  MaxLength,
  IsDateString,
  IsNumber,
  IsEnum,
} from 'class-validator'
import { PartialType } from '@nestjs/mapped-types'

import { PagerDto } from '~/common/dto/pager.dto'

import { DrugStatus } from './drug.entity'

export class CreateDrugDto {
  @ApiProperty({ description: '药品编码' })
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  drugCode: string

  @ApiProperty({ description: '通用名' })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  genericName: string

  @ApiProperty({ description: '商品名', required: false })
  @IsString()
  @IsOptional()
  tradeName?: string

  @ApiProperty({ description: '规格' })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  specification: string

  @ApiProperty({ description: '剂型' })
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  dosageForm: string

  @ApiProperty({ description: '生产厂家' })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  manufacturer: string

  @ApiProperty({ description: '批准文号' })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  approvalNumber: string

  @ApiProperty({ description: '药品类型' })
  @IsString()
  drugType: string

  @ApiProperty({ description: '药品用途', required: false })
  @IsString()
  @IsOptional()
  usePurpose?: string

  @ApiProperty({ description: '使用方式', required: false })
  @IsString()
  @IsOptional()
  usageMethod?: string

  @ApiProperty({ description: '有效期起始日期' })
  @IsDateString()
  validFrom: string

  @ApiProperty({ description: '有效期截止日期' })
  @IsDateString()
  validTo: string

  @ApiProperty({ description: '零售价' })
  @IsNumber()
  @Min(0)
  retailPrice: number

  @ApiProperty({ description: '批发价' })
  @IsNumber()
  @Min(0)
  wholesalePrice: number

  @ApiProperty({ description: '医保报销比例', required: false })
  @IsNumber()
  @IsOptional()
  medicalInsuranceRate?: number

  @ApiProperty({ description: '药理分类ID', required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  pharmacologicalClassId?: number

  @ApiProperty({ description: '剂型分类ID', required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  dosageClassId?: number

  @ApiProperty({ description: '科室分类ID', required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  departmentClassId?: number

  @ApiProperty({ description: '药品描述', required: false })
  @IsString()
  @IsOptional()
  description?: string
}

export class UpdateDrugDto extends PartialType(CreateDrugDto) {
  @ApiProperty({ description: '状态', enum: DrugStatus, required: false })
  @IsEnum(DrugStatus)
  @IsOptional()
  status?: DrugStatus
}

export class DrugQueryDto extends PagerDto {
  @ApiProperty({ description: '药品名称', required: false })
  @IsString()
  @IsOptional()
  name?: string

  @ApiProperty({ description: '药品编码', required: false })
  @IsString()
  @IsOptional()
  drugCode?: string

  @ApiProperty({ description: '药品类型', required: false })
  @IsString()
  @IsOptional()
  drugType?: string

  @ApiProperty({ description: '剂型', required: false })
  @IsString()
  @IsOptional()
  dosageForm?: string

  @ApiProperty({ description: '生产厂家', required: false })
  @IsString()
  @IsOptional()
  manufacturer?: string

  @ApiProperty({ description: '状态', enum: DrugStatus, required: false })
  @IsEnum(DrugStatus)
  @IsOptional()
  status?: DrugStatus

  @ApiProperty({ description: '药理分类ID', required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  pharmacologicalClassId?: number
}
