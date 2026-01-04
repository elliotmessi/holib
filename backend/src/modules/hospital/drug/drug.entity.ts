import { Column, Entity, ManyToOne, OneToMany, Relation } from 'typeorm'

import { CommonEntity } from '~/common/entity/common.entity'

export enum DrugStatus {
  NORMAL = 'normal',
  STOPPED = 'stopped',
  OUT_OF_STOCK = 'out_of_stock',
}

@Entity({ name: 'drugs' })
export class DrugEntity extends CommonEntity {
  @Column({ length: 20, unique: true })
  drugCode: string

  @Column({ length: 100 })
  genericName: string

  @Column({ length: 100, nullable: true })
  tradeName: string

  @Column({ length: 50 })
  specification: string

  @Column({ length: 20 })
  dosageForm: string

  @Column({ length: 100 })
  manufacturer: string

  @Column({ length: 50 })
  approvalNumber: string

  @Column({ length: 20 })
  drugType: string

  @Column({ type: 'text', nullable: true })
  usePurpose: string

  @Column({ type: 'text', nullable: true })
  usageMethod: string

  @Column({ type: 'date' })
  validFrom: Date

  @Column({ type: 'date' })
  validTo: Date

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  retailPrice: number

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  wholesalePrice: number

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  medicalInsuranceRate: number

  @ManyToOne('DrugCategoryEntity', { onDelete: 'SET NULL', eager: true })
  pharmacologicalClass: Relation<any>

  @Column({ nullable: true })
  pharmacologicalClassId: number

  @ManyToOne('DrugCategoryEntity', { onDelete: 'SET NULL', eager: true })
  dosageClass: Relation<any>

  @Column({ nullable: true })
  dosageClassId: number

  @ManyToOne('DrugCategoryEntity', { onDelete: 'SET NULL', eager: true })
  departmentClass: Relation<any>

  @Column({ nullable: true })
  departmentClassId: number

  @Column({ length: 10, default: DrugStatus.NORMAL })
  status: DrugStatus

  @Column({ type: 'text', nullable: true })
  description: string
}
