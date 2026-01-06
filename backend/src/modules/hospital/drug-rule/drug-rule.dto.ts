import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsOptional, IsInt, Min, IsEnum, IsNumber, IsBoolean } from 'class-validator'

import { DrugRuleType, InteractionSeverity } from './drug-rule.entity'

/**
 * 药品规则基础DTO，包含所有共同字段
 */
class DrugRuleBaseDto {
  @ApiProperty({ description: '药品ID', required: false })
  @IsInt()
  @Min(1)
  @IsOptional()
  drugId?: number

  @ApiProperty({ description: '规则类型', enum: DrugRuleType, required: false })
  @IsEnum(DrugRuleType)
  @IsOptional()
  ruleType?: DrugRuleType

  @ApiProperty({ description: '最小剂量', required: false })
  @IsNumber()
  @IsOptional()
  minDosage?: number

  @ApiProperty({ description: '最大剂量', required: false })
  @IsNumber()
  @IsOptional()
  maxDosage?: number

  @ApiProperty({ description: '剂量单位', required: false })
  @IsString()
  @IsOptional()
  dosageUnit?: string

  @ApiProperty({ description: '禁忌人群', required: false })
  @IsString()
  @IsOptional()
  contraindication?: string

  @ApiProperty({ description: '相互作用药品ID', required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  interactionDrugId?: number

  @ApiProperty({ description: '相互作用严重程度', enum: InteractionSeverity, required: false })
  @IsEnum(InteractionSeverity)
  @IsOptional()
  interactionSeverity?: InteractionSeverity

  @ApiProperty({ description: '相互作用描述', required: false })
  @IsString()
  @IsOptional()
  interactionDescription?: string

  @ApiProperty({ description: '是否激活', required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean
}

/**
 * 创建药品规则DTO，所有必填字段均为必填
 */
export class CreateDrugRuleDto extends DrugRuleBaseDto {
  @ApiProperty({ description: '药品ID' })
  @IsInt()
  @Min(1)
  drugId: number

  @ApiProperty({ description: '规则类型', enum: DrugRuleType })
  @IsEnum(DrugRuleType)
  ruleType: DrugRuleType
}

/**
 * 更新药品规则DTO，所有字段均为可选
 */
export class UpdateDrugRuleDto extends DrugRuleBaseDto {}

export class DrugRuleQueryDto {
  @ApiProperty({ description: '药品ID', required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  drugId?: number

  @ApiProperty({ description: '规则类型', enum: DrugRuleType, required: false })
  @IsEnum(DrugRuleType)
  @IsOptional()
  ruleType?: DrugRuleType

  @ApiProperty({ description: '是否只查询激活的规则', required: false })
  @IsBoolean()
  @IsOptional()
  activeOnly?: boolean
}
