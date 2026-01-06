import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsOptional, IsInt, Min, MinLength, MaxLength, IsEmail } from 'class-validator'
import { PartialType } from '@nestjs/mapped-types'

export class CreateDoctorDto {
  @ApiProperty({ description: '医生工号' })
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  doctorCode: string

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

  @ApiProperty({ description: '职称' })
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  title: string

  @ApiProperty({ description: '执业类别' })
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  practiceType: string

  @ApiProperty({ description: '执业范围' })
  @IsString()
  practiceScope: string

  @ApiProperty({ description: '所属科室ID' })
  @IsInt()
  @Min(1)
  departmentId: number

  @ApiProperty({ description: '联系电话', required: false })
  @IsString()
  @IsOptional()
  phone?: string

  @ApiProperty({ description: '邮箱', required: false })
  @IsEmail()
  @IsOptional()
  email?: string

  @ApiProperty({ description: '头像URL', required: false })
  @IsString()
  @IsOptional()
  avatar?: string

  @ApiProperty({ description: '电子签名URL', required: false })
  @IsString()
  @IsOptional()
  signature?: string

  @ApiProperty({ description: '初始密码', required: false })
  @IsString()
  @IsOptional()
  password?: string
}

export class UpdateDoctorDto extends PartialType(CreateDoctorDto) {
  @ApiProperty({ description: '状态', required: false })
  @IsString()
  @IsOptional()
  status?: string
}

export class DoctorQueryDto {
  @ApiProperty({ description: '医生姓名', required: false })
  @IsString()
  @IsOptional()
  name?: string

  @ApiProperty({ description: '医生工号', required: false })
  @IsString()
  @IsOptional()
  doctorCode?: string

  @ApiProperty({ description: '所属科室ID', required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  departmentId?: number

  @ApiProperty({ description: '职称', required: false })
  @IsString()
  @IsOptional()
  title?: string

  @ApiProperty({ description: '状态', required: false })
  @IsString()
  @IsOptional()
  status?: string
}

export class ChangePasswordDto {
  @ApiProperty({ description: '旧密码' })
  @IsString()
  @MinLength(6)
  oldPassword: string

  @ApiProperty({ description: '新密码' })
  @IsString()
  @MinLength(6)
  newPassword: string
}
