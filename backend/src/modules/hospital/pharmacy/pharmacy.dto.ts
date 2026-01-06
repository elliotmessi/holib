import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsOptional, IsInt, Min, MinLength, MaxLength, IsEnum } from 'class-validator'
import { PartialType } from '@nestjs/mapped-types'

import { PharmacyType } from './pharmacy.entity'

export class CreatePharmacyDto {
  @ApiProperty({ description: '药房编码' })
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  pharmacyCode: string

  @ApiProperty({ description: '药房名称' })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  name: string

  @ApiProperty({ description: '所属医院ID' })
  @IsInt()
  @Min(1)
  hospitalId: number

  @ApiProperty({ description: '药房类型', enum: PharmacyType })
  @IsEnum(PharmacyType)
  pharmacyType: PharmacyType

  @ApiProperty({ description: '负责科室ID', required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  departmentId?: number

  @ApiProperty({ description: '所在楼层', required: false })
  @IsString()
  @IsOptional()
  floor?: string

  @ApiProperty({ description: '联系人', required: false })
  @IsString()
  @IsOptional()
  contactPerson?: string

  @ApiProperty({ description: '联系电话', required: false })
  @IsString()
  @IsOptional()
  phone?: string

  @ApiProperty({ description: '药房描述', required: false })
  @IsString()
  @IsOptional()
  description?: string
}

export class UpdatePharmacyDto extends PartialType(CreatePharmacyDto) {}

export class PharmacyQueryDto {
  @ApiProperty({ description: '药房名称', required: false })
  @IsString()
  @IsOptional()
  name?: string

  @ApiProperty({ description: '药房类型', enum: PharmacyType, required: false })
  @IsEnum(PharmacyType)
  @IsOptional()
  pharmacyType?: PharmacyType

  @ApiProperty({ description: '所属医院ID', required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  hospitalId?: number

  @ApiProperty({ description: '负责科室ID', required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  departmentId?: number
}
