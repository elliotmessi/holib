import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsOptional, IsInt, Min, MinLength, MaxLength, IsNumber } from 'class-validator'

/**
 * 患者基础DTO，包含所有共同字段
 */
class PatientBaseDto {
  @ApiProperty({ description: '姓名' })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  name: string

  @ApiProperty({ description: '性别' })
  @IsString()
  @MinLength(1)
  @MaxLength(10)
  gender: string

  @ApiProperty({ description: '年龄' })
  @IsInt()
  @Min(0)
  age: number

  @ApiProperty({ description: '身份证号', required: false })
  @IsString()
  @IsOptional()
  idCard?: string

  @ApiProperty({ description: '联系电话', required: false })
  @IsString()
  @IsOptional()
  phone?: string

  @ApiProperty({ description: '身高(cm)', required: false })
  @IsNumber()
  @IsOptional()
  height?: number

  @ApiProperty({ description: '体重(kg)', required: false })
  @IsNumber()
  @IsOptional()
  weight?: number

  @ApiProperty({ description: '血型', required: false })
  @IsString()
  @IsOptional()
  bloodType?: string

  @ApiProperty({ description: '既往病史', required: false })
  @IsString()
  @IsOptional()
  medicalHistory?: string

  @ApiProperty({ description: '当前诊断', required: false })
  @IsString()
  @IsOptional()
  currentDiagnosis?: string

  @ApiProperty({ description: '备注', required: false })
  @IsString()
  @IsOptional()
  remark?: string
}

/**
 * 创建患者DTO，病历号为必填
 */
export class CreatePatientDto extends PatientBaseDto {
  @ApiProperty({ description: '病历号' })
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  medicalRecordNumber: string
}

/**
 * 更新患者DTO，病历号为可选
 */
export class UpdatePatientDto extends PatientBaseDto {
  @ApiProperty({ description: '病历号', required: false })
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  @IsOptional()
  medicalRecordNumber?: string
}

export class PatientQueryDto {
  @ApiProperty({ description: '病人姓名', required: false })
  @IsString()
  @IsOptional()
  name?: string

  @ApiProperty({ description: '病历号', required: false })
  @IsString()
  @IsOptional()
  medicalRecordNumber?: string

  @ApiProperty({ description: '身份证号', required: false })
  @IsString()
  @IsOptional()
  idCard?: string

  @ApiProperty({ description: '联系电话', required: false })
  @IsString()
  @IsOptional()
  phone?: string

  @ApiProperty({ description: '性别', required: false })
  @IsString()
  @IsOptional()
  gender?: string

  @ApiProperty({ description: '最小年龄', required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  minAge?: number

  @ApiProperty({ description: '最大年龄', required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  maxAge?: number
}
