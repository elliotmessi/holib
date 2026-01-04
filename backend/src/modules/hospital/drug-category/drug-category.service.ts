import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, TreeRepository } from 'typeorm'

import { BusinessException } from '~/common/exceptions/biz.exception'
import { ErrorEnum } from '~/constants/error-code.constant'

import { DrugCategoryEntity, DrugCategoryType } from './drug-category.entity'
import {
  CreateDrugCategoryDto,
  UpdateDrugCategoryDto,
  DrugCategoryQueryDto,
} from './drug-category.dto'

@Injectable()
export class DrugCategoryService {
  constructor(
    @InjectRepository(DrugCategoryEntity)
    private categoryRepository: TreeRepository<DrugCategoryEntity>,
  ) {}

  async create(createDto: CreateDrugCategoryDto): Promise<DrugCategoryEntity> {
    let parent: DrugCategoryEntity | null = null
    if (createDto.parentId) {
      parent = await this.categoryRepository.findOneBy({ id: createDto.parentId })
      if (!parent) {
        throw new BusinessException(ErrorEnum.DATA_NOT_FOUND)
      }
    }

    const category = this.categoryRepository.create({
      ...createDto,
      parent,
    })
    return this.categoryRepository.save(category)
  }

  async findAll(query: DrugCategoryQueryDto): Promise<DrugCategoryEntity[]> {
    const queryBuilder = this.categoryRepository.createQueryBuilder('category')
    queryBuilder.leftJoinAndSelect('category.parent', 'parent')

    if (query.name) {
      queryBuilder.andWhere('category.name LIKE :name', { name: `%${query.name}%` })
    }
    if (query.type) {
      queryBuilder.andWhere('category.type = :type', { type: query.type })
    }
    if (query.parentId !== undefined && query.parentId !== null) {
      queryBuilder.andWhere('category.parentId = :parentId', { parentId: query.parentId })
    }

    queryBuilder.orderBy('category.createdAt', 'DESC')
    return queryBuilder.getMany()
  }

  async findTree(type?: DrugCategoryType): Promise<DrugCategoryEntity[]> {
    const queryBuilder = this.categoryRepository.createQueryBuilder('category')
    queryBuilder.leftJoinAndSelect('category.children', 'children')

    if (type) {
      queryBuilder.andWhere('category.type = :type', { type })
    }

    queryBuilder.orderBy('category.createdAt', 'ASC')
    const categories = await queryBuilder.getMany()
    return this.buildTree(categories)
  }

  private buildTree(categories: DrugCategoryEntity[]): DrugCategoryEntity[] {
    const map = new Map<number, DrugCategoryEntity>()
    const roots: DrugCategoryEntity[] = []

    categories.forEach((category) => {
      category.children = []
      map.set(category.id, category)
    })

    categories.forEach((category) => {
      if (category.parentId && map.has(category.parentId)) {
        const parent = map.get(category.parentId)
        parent!.children!.push(category)
      } else {
        roots.push(category)
      }
    })

    return roots
  }

  async findOne(id: number): Promise<DrugCategoryEntity> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['parent', 'children'],
    })
    if (!category) {
      throw new BusinessException(ErrorEnum.DATA_NOT_FOUND)
    }
    return category
  }

  async update(id: number, updateDto: UpdateDrugCategoryDto): Promise<void> {
    const category = await this.findOne(id)

    let parent: DrugCategoryEntity | null | undefined = undefined
    if (updateDto.parentId !== undefined) {
      if (updateDto.parentId) {
        parent = await this.categoryRepository.findOneBy({ id: updateDto.parentId })
        if (!parent) {
          throw new BusinessException(ErrorEnum.DATA_NOT_FOUND)
        }
      } else {
        parent = null
      }
    }

    Object.assign(category, updateDto, { parent })
    await this.categoryRepository.save(category)
  }

  async remove(id: number): Promise<void> {
    const category = await this.findOne(id)
    const children = await this.categoryRepository.findDescendants(category)
    if (children.length > 1) {
      throw new BusinessException(ErrorEnum.DATA_HAS_ASSOCIATED_CHILDREN)
    }
    await this.categoryRepository.delete(id)
  }
}
