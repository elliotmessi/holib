import { Column, Entity, ManyToOne, Relation } from 'typeorm'

import { CommonEntity } from '~/common/entity/common.entity'

export enum PharmacyType {
  CHINESE_MEDICINE = 'chinese_medicine',
  WESTERN_MEDICINE = 'western_medicine',
}

@Entity({ name: 'pharmacies' })
export class PharmacyEntity extends CommonEntity {
  @Column({ length: 20 })
  pharmacyCode: string

  @Column({ length: 50 })
  name: string

  @ManyToOne('HospitalEntity', { onDelete: 'SET NULL', eager: true })
  hospital: Relation<any>

  @Column()
  hospitalId: number

  @Column({ type: 'enum', enum: PharmacyType })
  pharmacyType: PharmacyType

  @ManyToOne('DepartmentEntity', (department) => (department as any).pharmacies, {
    onDelete: 'SET NULL',
    eager: true,
  })
  department: Relation<any>

  @Column({ nullable: true })
  departmentId: number

  @Column({ length: 10, nullable: true })
  floor: string

  @Column({ length: 50, nullable: true })
  contactPerson: string

  @Column({ length: 20, nullable: true })
  phone: string

  @Column({ type: 'text', nullable: true })
  description: string
}
