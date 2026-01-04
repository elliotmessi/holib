import { Column, Entity, ManyToOne, OneToMany, Relation } from 'typeorm'

import { CommonEntity } from '~/common/entity/common.entity'

export enum PrescriptionStatus {
  PENDING_REVIEW = 'pending_review',
  REVIEWED = 'reviewed',
  REJECTED = 'rejected',
  DISPENSED = 'dispensed',
  CANCELLED = 'cancelled',
}

@Entity({ name: 'prescriptions' })
export class PrescriptionEntity extends CommonEntity {
  @Column({ length: 30, unique: true })
  prescriptionNumber: string

  @ManyToOne('PatientEntity', { onDelete: 'SET NULL', eager: true })
  patient: Relation<any>

  @Column({ nullable: true })
  patientId: number

  @ManyToOne('DoctorEntity', { onDelete: 'SET NULL', eager: true })
  doctor: Relation<any>

  @Column({ nullable: true })
  doctorId: number

  @ManyToOne('DepartmentEntity', { onDelete: 'SET NULL', eager: true })
  department: Relation<any>

  @Column({ nullable: true })
  departmentId: number

  @ManyToOne('PharmacyEntity', { onDelete: 'SET NULL', eager: true })
  pharmacy: Relation<any>

  @Column({ nullable: true })
  pharmacyId: number

  @Column({ type: 'text' })
  diagnosis: string

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number

  @Column({ type: 'enum', enum: PrescriptionStatus, default: PrescriptionStatus.PENDING_REVIEW })
  status: PrescriptionStatus

  @Column({ type: 'text', nullable: true })
  reviewComments: string

  @Column({ nullable: true })
  reviewBy: number

  @Column({ nullable: true })
  reviewTime: Date

  @Column({ nullable: true })
  dispenseTime: Date

  @Column({ type: 'text', nullable: true })
  remark: string
}
