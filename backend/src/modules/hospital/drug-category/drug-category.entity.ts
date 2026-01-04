import { Column, Entity, OneToMany, Relation, Tree, TreeChildren, TreeParent } from 'typeorm'

import { CommonEntity } from '~/common/entity/common.entity'

export enum DrugCategoryType {
  PHARMACOLOGICAL = 'pharmacological',
  DOSAGE = 'dosage',
  DEPARTMENT = 'department',
}

@Entity({ name: 'drug_categories' })
@Tree('materialized-path')
export class DrugCategoryEntity extends CommonEntity {
  @Column({ length: 50 })
  name: string

  @Column({ type: 'enum', enum: DrugCategoryType })
  type: DrugCategoryType

  @TreeParent({ onDelete: 'SET NULL' })
  parent: Relation<DrugCategoryEntity>

  @Column({ nullable: true })
  parentId: number

  @TreeChildren({ cascade: true })
  children: Relation<DrugCategoryEntity[]>

  @Column({ type: 'text', nullable: true })
  description: string
}
