import { Column, Entity, OneToMany, Relation } from 'typeorm'

import { CommonEntity } from '~/common/entity/common.entity'

@Entity({ name: 'hospitals' })
export class HospitalEntity extends CommonEntity {
  @Column({ length: 20, unique: true })
  hospitalCode: string

  @Column({ length: 100 })
  name: string

  @Column({ length: 255 })
  address: string

  @Column({ length: 20 })
  phone: string

  @Column({ length: 50 })
  contactPerson: string

  @Column({ length: 20, nullable: true })
  level: string

  @Column({ type: 'text', nullable: true })
  description: string

  @OneToMany('DepartmentEntity', (department) => (department as any).hospital, { eager: true })
  departments: Relation<any[]>

  @OneToMany('PharmacyEntity', (pharmacy) => (pharmacy as any).hospital, { eager: true })
  pharmacies: Relation<any[]>
}
