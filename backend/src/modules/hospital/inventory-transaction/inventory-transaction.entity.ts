import { Column, Entity, ManyToOne, Relation } from 'typeorm'

import { CommonEntity } from '~/common/entity/common.entity'

export enum InventoryTransactionType {
  INBOUND = 'inbound',
  OUTBOUND = 'outbound',
  TRANSFER = 'transfer',
  ADJUSTMENT = 'adjustment',
}

@Entity({ name: 'inventory_transactions' })
export class InventoryTransactionEntity extends CommonEntity {
  @ManyToOne('DrugEntity', { onDelete: 'SET NULL', eager: true })
  drug: Relation<any>

  @Column({ nullable: true })
  drugId: number

  @ManyToOne('PharmacyEntity', { onDelete: 'SET NULL', eager: true })
  pharmacy: Relation<any>

  @Column({ nullable: true })
  pharmacyId: number

  @Column({ type: 'enum', enum: InventoryTransactionType })
  transactionType: InventoryTransactionType

  @Column()
  quantity: number

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number

  @Column({ length: 50, nullable: true })
  batchNumber: string

  @Column({ type: 'text', nullable: true })
  reason: string

  @Column({ nullable: true })
  referenceId: number

  @Column({ nullable: true })
  referenceType: string

  @Column()
  createdBy: number
}
