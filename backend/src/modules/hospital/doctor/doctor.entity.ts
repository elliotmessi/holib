import { Column, Entity, ManyToOne, Relation } from 'typeorm'

import { CommonEntity } from '~/common/entity/common.entity'

@Entity({ name: 'doctors' })
export class DoctorEntity extends CommonEntity {
  @Column({ length: 20, unique: true })
  doctorCode: string

  @Column({ length: 50 })
  name: string

  @Column({ length: 10 })
  gender: string

  @Column({ length: 20 })
  title: string

  @Column({ length: 20 })
  practiceType: string

  @Column({ type: 'text' })
  practiceScope: string

  @ManyToOne('DepartmentEntity', { onDelete: 'SET NULL', eager: true })
  department: Relation<any>

  @Column({ nullable: true })
  departmentId: number

  @Column({ length: 20, nullable: true })
  phone: string

  @Column({ length: 100, nullable: true })
  email: string

  @Column({ length: 255, nullable: true })
  avatar: string

  @Column({ length: 255, nullable: true })
  signature: string

  @Column({ length: 255, nullable: true })
  passwordHash: string

  @Column({ length: 32, nullable: true })
  salt: string

  @Column({ length: 10, default: 'active' })
  status: string

  @Column({ nullable: true })
  lastLoginAt: Date

  @Column({ default: 0 })
  loginFailedCount: number

  @Column({ nullable: true })
  lockedUntil: Date
}
