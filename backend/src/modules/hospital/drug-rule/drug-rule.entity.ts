import { Column, Entity, ManyToOne, Relation } from 'typeorm'

import { CommonEntity } from '~/common/entity/common.entity'

export enum DrugRuleType {
  DOSAGE_LIMIT = 'dosage_limit',
  CONTRAINDICATION = 'contraindication',
  INTERACTION = 'interaction',
}

export enum InteractionSeverity {
  MILD = 'mild',
  MODERATE = 'moderate',
  SEVERE = 'severe',
}

@Entity({ name: 'drug_prescription_rules' })
export class DrugPrescriptionRuleEntity extends CommonEntity {
  @ManyToOne('DrugEntity', { onDelete: 'CASCADE', eager: true })
  drug: Relation<any>

  @Column()
  drugId: number

  @Column({ type: 'enum', enum: DrugRuleType })
  ruleType: DrugRuleType

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  minDosage: number

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  maxDosage: number

  @Column({ length: 20, nullable: true })
  dosageUnit: string

  @Column({ type: 'text', nullable: true })
  contraindication: string

  @ManyToOne('DrugEntity', { onDelete: 'SET NULL', eager: true })
  interactionDrug: Relation<any>

  @Column({ nullable: true })
  interactionDrugId: number

  @Column({ type: 'enum', enum: InteractionSeverity, nullable: true })
  interactionSeverity: InteractionSeverity

  @Column({ type: 'text', nullable: true })
  interactionDescription: string

  @Column({ default: true })
  isActive: boolean
}
