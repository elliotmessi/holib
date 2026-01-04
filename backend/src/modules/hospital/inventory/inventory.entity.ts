import { Column, Entity, ManyToOne, Relation, Unique } from 'typeorm'

import { CommonEntity } from '~/common/entity/common.entity'

@Entity({ name: 'inventory' })
@Unique(['drugId', 'pharmacyId', 'batchNumber'])
export class InventoryEntity extends CommonEntity {
  @ManyToOne('DrugEntity', { onDelete: 'CASCADE', eager: true })
  drug: Relation<any>

  @Column()
  drugId: number

  @ManyToOne('PharmacyEntity', { onDelete: 'CASCADE', eager: true })
  pharmacy: Relation<any>

  @Column()
  pharmacyId: number

  @Column({ length: 50 })
  batchNumber: string

  @Column({ default: 0 })
  quantity: number

  @Column({ default: 0 })
  minimumThreshold: number

  @Column({ default: 1000 })
  maximumThreshold: number

  @Column({ length: 100, nullable: true })
  storageLocation: string

  @Column({ type: 'date' })
  validFrom: Date

  @Column({ type: 'date' })
  validTo: Date

  @Column({ default: false })
  isFrozen: boolean

  @Column({ nullable: true })
  updatedBy: number
}
