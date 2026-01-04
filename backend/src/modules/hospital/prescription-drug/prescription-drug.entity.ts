import { Column, Entity, ManyToOne, Relation } from 'typeorm'

import { CommonEntity } from '~/common/entity/common.entity'

@Entity({ name: 'prescription_drugs' })
export class PrescriptionDrugEntity extends CommonEntity {
  @ManyToOne('PrescriptionEntity', { onDelete: 'CASCADE', eager: true })
  prescription: Relation<any>

  @Column()
  prescriptionId: number

  @ManyToOne('DrugEntity', { onDelete: 'SET NULL', eager: true })
  drug: Relation<any>

  @Column()
  drugId: number

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  dosage: number

  @Column({ length: 20 })
  dosageUnit: string

  @Column({ length: 20 })
  frequency: string

  @Column({ length: 20 })
  administrationRoute: string

  @Column()
  duration: number

  @Column()
  quantity: number

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number

  @Column({ type: 'text', nullable: true })
  usageInstructions: string
}
