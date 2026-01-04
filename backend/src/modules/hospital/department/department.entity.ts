import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  Relation,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm'

import { CommonEntity } from '~/common/entity/common.entity'

export enum DepartmentType {
  CLINICAL = 'clinical',
  MEDICAL_TECH = 'medical_tech',
  ADMIN = 'admin',
}

@Entity({ name: 'departments' })
@Tree('materialized-path')
export class DepartmentEntity extends CommonEntity {
  @Column({ length: 20 })
  departmentCode: string

  @Column({ length: 50 })
  name: string

  @Column({ type: 'enum', enum: DepartmentType, default: DepartmentType.CLINICAL })
  type: DepartmentType

  @ManyToOne('HospitalEntity', { onDelete: 'SET NULL', eager: true })
  hospital: Relation<any>

  @Column({ nullable: true })
  hospitalId: number

  @TreeParent({ onDelete: 'SET NULL' })
  parent: Relation<DepartmentEntity>

  @Column({ nullable: true })
  parentId: number

  @TreeChildren({ cascade: true })
  children: Relation<DepartmentEntity[]>

  @Column({ length: 50, nullable: true })
  director: string

  @Column({ length: 20, nullable: true })
  phone: string

  @Column({ length: 100, nullable: true })
  location: string

  @Column({ type: 'text', nullable: true })
  description: string

  @OneToMany('PharmacyEntity', (pharmacy) => (pharmacy as any).department, { eager: true })
  pharmacies: Relation<any[]>
}
