import { Column, Entity, OneToMany, Relation } from 'typeorm'

import { CommonEntity } from '~/common/entity/common.entity'

@Entity({ name: 'patients' })
export class PatientEntity extends CommonEntity {
  @Column({ length: 20, unique: true })
  medicalRecordNumber: string

  @Column({ length: 50 })
  name: string

  @Column({ length: 10 })
  gender: string

  @Column()
  age: number

  @Column({ length: 18, nullable: true })
  idCard: string

  @Column({ length: 20, nullable: true })
  phone: string

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  height: number

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  weight: number

  @Column({ length: 10, nullable: true })
  bloodType: string

  @Column({ type: 'text', nullable: true })
  allergyHistory: string

  @Column({ type: 'text', nullable: true })
  medicalHistory: string

  @Column({ type: 'text', nullable: true })
  currentDiagnosis: string

  @Column({ type: 'text', nullable: true })
  remark: string
}
