import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { isEmpty } from 'lodash'
import { DataSource, Repository, TreeRepository } from 'typeorm'

import { BusinessException } from '~/common/exceptions/biz.exception'
import { ErrorEnum } from '~/constants/error-code.constant'

import { DepartmentEntity, DepartmentType } from './department.entity'
import { CreateDepartmentDto, UpdateDepartmentDto, DepartmentQueryDto } from './department.dto'

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(DepartmentEntity)
    private departmentRepository: TreeRepository<DepartmentEntity>,
    private dataSource: DataSource,
  ) {}

  async create(createDto: CreateDepartmentDto): Promise<DepartmentEntity> {
    const exist = await this.departmentRepository.findOneBy({
      departmentCode: createDto.departmentCode,
    })
    if (exist) {
      throw new BusinessException(ErrorEnum.DATA_ALREADY_EXISTS)
    }

    let parent: DepartmentEntity | null = null
    if (createDto.parentId) {
      parent = await this.departmentRepository.findOneBy({ id: createDto.parentId })
      if (!parent) {
        throw new BusinessException(ErrorEnum.DATA_NOT_FOUND)
      }
    }

    const hospital = await this.dataSource.manager.findOneBy('hospitals', {
      id: createDto.hospitalId,
    })
    if (!hospital) {
      throw new BusinessException(ErrorEnum.DATA_NOT_FOUND)
    }

    const department = this.departmentRepository.create({
      ...createDto,
      parent,
      hospital,
    })
    return this.departmentRepository.save(department)
  }

  async findAll(query: DepartmentQueryDto): Promise<DepartmentEntity[]> {
    const queryBuilder = this.departmentRepository.createQueryBuilder('dept')
    queryBuilder.leftJoinAndSelect('dept.hospital', 'hospital')
    queryBuilder.leftJoinAndSelect('dept.parent', 'parent')

    if (query.name) {
      queryBuilder.andWhere('dept.name LIKE :name', { name: `%${query.name}%` })
    }
    if (query.type) {
      queryBuilder.andWhere('dept.type = :type', { type: query.type })
    }
    if (query.hospitalId) {
      queryBuilder.andWhere('dept.hospitalId = :hospitalId', { hospitalId: query.hospitalId })
    }
    if (query.parentId !== undefined && query.parentId !== null) {
      queryBuilder.andWhere('dept.parentId = :parentId', { parentId: query.parentId })
    }

    queryBuilder.orderBy('dept.createdAt', 'DESC')
    return queryBuilder.getMany()
  }

  async findTree(hospitalId?: number): Promise<DepartmentEntity[]> {
    const queryBuilder = this.departmentRepository.createQueryBuilder('dept')
    queryBuilder.leftJoinAndSelect('dept.hospital', 'hospital')
    queryBuilder.leftJoinAndSelect('dept.children', 'children')

    if (hospitalId) {
      queryBuilder.andWhere('dept.hospitalId = :hospitalId', { hospitalId })
    }

    queryBuilder.orderBy('dept.createdAt', 'ASC')
    const depts = await queryBuilder.getMany()
    return this.buildTree(depts)
  }

  private buildTree(depts: DepartmentEntity[]): DepartmentEntity[] {
    const map = new Map<number, DepartmentEntity>()
    const roots: DepartmentEntity[] = []

    depts.forEach((dept) => {
      dept.children = []
      map.set(dept.id, dept)
    })

    depts.forEach((dept) => {
      if (dept.parentId && map.has(dept.parentId)) {
        const parent = map.get(dept.parentId)
        parent!.children!.push(dept)
      } else {
        roots.push(dept)
      }
    })

    return roots
  }

  async findOne(id: number): Promise<DepartmentEntity> {
    const dept = await this.departmentRepository.findOne({
      where: { id },
      relations: ['hospital', 'parent', 'children'],
    })
    if (!dept) {
      throw new BusinessException(ErrorEnum.DATA_NOT_FOUND)
    }
    return dept
  }

  async update(id: number, updateDto: UpdateDepartmentDto): Promise<void> {
    const dept = await this.findOne(id)

    if (updateDto.departmentCode !== dept.departmentCode) {
      const exist = await this.departmentRepository.findOneBy({
        departmentCode: updateDto.departmentCode,
      })
      if (exist) {
        throw new BusinessException(ErrorEnum.DATA_ALREADY_EXISTS)
      }
    }

    let parent: DepartmentEntity | null | undefined = undefined
    if (updateDto.parentId !== undefined) {
      if (updateDto.parentId) {
        parent = await this.departmentRepository.findOneBy({ id: updateDto.parentId })
        if (!parent) {
          throw new BusinessException(ErrorEnum.DATA_NOT_FOUND)
        }
      } else {
        parent = null
      }
    }

    Object.assign(dept, updateDto, { parent })
    await this.departmentRepository.save(dept)
  }

  async remove(id: number): Promise<void> {
    const dept = await this.findOne(id)
    const children = await this.departmentRepository.findDescendants(dept)
    if (children.length > 1) {
      throw new BusinessException(ErrorEnum.DATA_HAS_ASSOCIATED_CHILDREN)
    }
    await this.departmentRepository.delete(id)
  }
}
