import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsOptional, IsInt, Min, IsEnum, IsNumber, IsBoolean } from 'class-validator'

import { DrugRuleType, InteractionSeverity } from './drug-rule.entity'

export class CreateDrugRuleDto {
  @ApiProperty({ description: '药品ID' })
  @IsInt()
  @Min(1)
  drugId: number

  @ApiProperty({ description: '规则类型', enum: DrugRuleType })
  @IsEnum(DrugRuleType)
  ruleType: DrugRuleType

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

export class UpdateDrugRuleDto extends CreateDrugRuleDto {}

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
