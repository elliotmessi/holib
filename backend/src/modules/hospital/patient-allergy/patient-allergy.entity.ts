import { Column, Entity, ManyToOne, Relation } from 'typeorm'

import { CommonEntity } from '~/common/entity/common.entity'

export enum AllergyType {
  DRUG = 'drug',
  FOOD = 'food',
  POLLEN = 'pollen',
  OTHER = 'other',
}

export enum AllergySeverity {
  MILD = 'mild',
  MODERATE = 'moderate',
  SEVERE = 'severe',
}

@Entity({ name: 'patient_allergies' })
export class PatientAllergyEntity extends CommonEntity {
  @ManyToOne('PatientEntity', { onDelete: 'CASCADE', eager: true })
  patient: Relation<any>

  @Column()
  patientId: number

  @ManyToOne('DrugEntity', { onDelete: 'SET NULL', eager: true })
  drug: Relation<any>

  @Column({ nullable: true })
  drugId: number

  @Column({ length: 50, nullable: true })
  allergenName: string

  @Column({ type: 'enum', enum: AllergyType })
  allergyType: AllergyType

  @Column({ type: 'text' })
  reaction: string

  @Column({ type: 'date', nullable: true })
  occurrenceDate: Date

  @Column({ type: 'enum', enum: AllergySeverity })
  severity: AllergySeverity

  @Column({ type: 'text', nullable: true })
  notes: string
}
