import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsOptional, IsInt, Min, MinLength, MaxLength, IsEnum } from 'class-validator'

import { DepartmentType } from './department.entity'

export class CreateDepartmentDto {
  @ApiProperty({ description: '科室编码' })
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  departmentCode: string

  @ApiProperty({ description: '科室名称' })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  name: string

  @ApiProperty({ description: '科室类型', enum: DepartmentType })
  @IsEnum(DepartmentType)
  type: DepartmentType

  @ApiProperty({ description: '所属医院ID' })
  @IsInt()
  @Min(1)
  hospitalId: number

  @ApiProperty({ description: '父级科室ID', required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  parentId?: number

  @ApiProperty({ description: '科室负责人', required: false })
  @IsString()
  @IsOptional()
  director?: string

  @ApiProperty({ description: '联系电话', required: false })
  @IsString()
  @IsOptional()
  phone?: string

  @ApiProperty({ description: '科室位置', required: false })
  @IsString()
  @IsOptional()
  location?: string

  @ApiProperty({ description: '科室描述', required: false })
  @IsString()
  @IsOptional()
  description?: string
}

export class UpdateDepartmentDto extends CreateDepartmentDto {}

export class DepartmentQueryDto {
  @ApiProperty({ description: '科室名称', required: false })
  @IsString()
  @IsOptional()
  name?: string

  @ApiProperty({ description: '科室类型', enum: DepartmentType, required: false })
  @IsEnum(DepartmentType)
  @IsOptional()
  type?: DepartmentType

  @ApiProperty({ description: '所属医院ID', required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  hospitalId?: number

  @ApiProperty({ description: '父级科室ID', required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  parentId?: number
}
