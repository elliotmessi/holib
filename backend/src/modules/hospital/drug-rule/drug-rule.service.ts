import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { BusinessException } from '~/common/exceptions/biz.exception'
import { ErrorEnum } from '~/constants/error-code.constant'

import { DrugPrescriptionRuleEntity, DrugRuleType } from './drug-rule.entity'
import { CreateDrugRuleDto, UpdateDrugRuleDto, DrugRuleQueryDto } from './drug-rule.dto'

@Injectable()
export class DrugRuleService {
  constructor(
    @InjectRepository(DrugPrescriptionRuleEntity)
    private ruleRepository: Repository<DrugPrescriptionRuleEntity>,
  ) {}

  async create(createDto: CreateDrugRuleDto): Promise<DrugPrescriptionRuleEntity> {
    const rule = this.ruleRepository.create(createDto)
    return this.ruleRepository.save(rule)
  }

  async findAll(query: DrugRuleQueryDto): Promise<DrugPrescriptionRuleEntity[]> {
    const queryBuilder = this.ruleRepository.createQueryBuilder('rule')
    queryBuilder.leftJoinAndSelect('rule.drug', 'drug')
    queryBuilder.leftJoinAndSelect('rule.interactionDrug', 'interactionDrug')

    if (query.drugId) {
      queryBuilder.andWhere('rule.drugId = :drugId', { drugId: query.drugId })
    }
    if (query.ruleType) {
      queryBuilder.andWhere('rule.ruleType = :ruleType', { ruleType: query.ruleType })
    }
    if (query.activeOnly) {
      queryBuilder.andWhere('rule.isActive = :isActive', { isActive: true })
    }

    queryBuilder.orderBy('rule.createdAt', 'DESC')
    return queryBuilder.getMany()
  }

  async findOne(id: number): Promise<DrugPrescriptionRuleEntity> {
    const rule = await this.ruleRepository.findOne({
      where: { id },
      relations: ['drug', 'interactionDrug'],
    })
    if (!rule) {
      throw new BusinessException(ErrorEnum.DATA_NOT_FOUND)
    }
    return rule
  }

  async findByDrugId(drugId: number, activeOnly = true): Promise<DrugPrescriptionRuleEntity[]> {
    const queryBuilder = this.ruleRepository.createQueryBuilder('rule')
    queryBuilder.leftJoinAndSelect('rule.interactionDrug', 'interactionDrug')
    queryBuilder.where('rule.drugId = :drugId', { drugId })

    if (activeOnly) {
      queryBuilder.andWhere('rule.isActive = :isActive', { isActive: true })
    }

    return queryBuilder.getMany()
  }

  async update(id: number, updateDto: UpdateDrugRuleDto): Promise<void> {
    const rule = await this.findOne(id)
    Object.assign(rule, updateDto)
    await this.ruleRepository.save(rule)
  }

  async remove(id: number): Promise<void> {
    const rule = await this.findOne(id)
    await this.ruleRepository.delete(id)
  }

  async toggleActive(id: number, isActive: boolean): Promise<void> {
    const rule = await this.findOne(id)
    rule.isActive = isActive
    await this.ruleRepository.save(rule)
  }
}
