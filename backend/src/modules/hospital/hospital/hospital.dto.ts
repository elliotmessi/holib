import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator'
import { PartialType } from '@nestjs/mapped-types'

export class CreateHospitalDto {
  @ApiProperty({ description: '医院编码' })
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  hospitalCode: string

  @ApiProperty({ description: '医院名称' })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string

  @ApiProperty({ description: '医院地址' })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  address: string

  @ApiProperty({ description: '联系电话' })
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  phone: string

  @ApiProperty({ description: '联系人' })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  contactPerson: string

  @ApiProperty({ description: '医院等级', required: false })
  @IsString()
  @IsOptional()
  level?: string

  @ApiProperty({ description: '医院描述', required: false })
  @IsString()
  @IsOptional()
  description?: string
}

export class UpdateHospitalDto extends PartialType(CreateHospitalDto) {}

export class HospitalQueryDto {
  @ApiProperty({ description: '医院名称', required: false })
  @IsString()
  @IsOptional()
  name?: string

  @ApiProperty({ description: '医院编码', required: false })
  @IsString()
  @IsOptional()
  hospitalCode?: string

  @ApiProperty({ description: '医院等级', required: false })
  @IsString()
  @IsOptional()
  level?: string
}
