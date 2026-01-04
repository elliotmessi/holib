import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsOptional, IsInt, Min, MinLength, MaxLength, IsEnum } from 'class-validator'

import { DrugCategoryType } from './drug-category.entity'

export class CreateDrugCategoryDto {
  @ApiProperty({ description: '分类名称' })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  name: string

  @ApiProperty({ description: '分类类型', enum: DrugCategoryType })
  @IsEnum(DrugCategoryType)
  type: DrugCategoryType

  @ApiProperty({ description: '父级分类ID', required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  parentId?: number

  @ApiProperty({ description: '分类描述', required: false })
  @IsString()
  @IsOptional()
  description?: string
}

export class UpdateDrugCategoryDto extends CreateDrugCategoryDto {}

export class DrugCategoryQueryDto {
  @ApiProperty({ description: '分类名称', required: false })
  @IsString()
  @IsOptional()
  name?: string

  @ApiProperty({ description: '分类类型', enum: DrugCategoryType, required: false })
  @IsEnum(DrugCategoryType)
  @IsOptional()
  type?: DrugCategoryType

  @ApiProperty({ description: '父级分类ID', required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  parentId?: number
}
