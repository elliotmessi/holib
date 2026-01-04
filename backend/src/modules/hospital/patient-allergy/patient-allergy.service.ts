import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { BusinessException } from '~/common/exceptions/biz.exception'
import { ErrorEnum } from '~/constants/error-code.constant'

import { PatientAllergyEntity } from './patient-allergy.entity'
import {
  CreatePatientAllergyDto,
  UpdatePatientAllergyDto,
  PatientAllergyQueryDto,
} from './patient-allergy.dto'

@Injectable()
export class PatientAllergyService {
  constructor(
    @InjectRepository(PatientAllergyEntity)
    private allergyRepository: Repository<PatientAllergyEntity>,
  ) {}

  async create(createDto: CreatePatientAllergyDto): Promise<PatientAllergyEntity> {
    const allergy = this.allergyRepository.create({
      ...createDto,
      occurrenceDate: createDto.occurrenceDate ? new Date(createDto.occurrenceDate) : undefined,
    })
    return this.allergyRepository.save(allergy)
  }

  async findAll(query: PatientAllergyQueryDto): Promise<PatientAllergyEntity[]> {
    const queryBuilder = this.allergyRepository.createQueryBuilder('allergy')
    queryBuilder.leftJoinAndSelect('allergy.patient', 'patient')
    queryBuilder.leftJoinAndSelect('allergy.drug', 'drug')

    if (query.patientId) {
      queryBuilder.andWhere('allergy.patientId = :patientId', { patientId: query.patientId })
    }
    if (query.allergyType) {
      queryBuilder.andWhere('allergy.allergyType = :allergyType', {
        allergyType: query.allergyType,
      })
    }
    if (query.severity) {
      queryBuilder.andWhere('allergy.severity = :severity', { severity: query.severity })
    }

    queryBuilder.orderBy('allergy.createdAt', 'DESC')
    return queryBuilder.getMany()
  }

  async findOne(id: number): Promise<PatientAllergyEntity> {
    const allergy = await this.allergyRepository.findOne({
      where: { id },
      relations: ['patient', 'drug'],
    })
    if (!allergy) {
      throw new BusinessException(ErrorEnum.DATA_NOT_FOUND)
    }
    return allergy
  }

  async findByPatientId(patientId: number): Promise<PatientAllergyEntity[]> {
    return this.allergyRepository.find({
      where: { patientId },
      relations: ['drug'],
      order: { severity: 'DESC', createdAt: 'DESC' },
    })
  }

  async findDrugAllergiesByPatientId(patientId: number): Promise<PatientAllergyEntity[]> {
    return this.allergyRepository.find({
      where: { patientId, drugId: undefined as any },
      order: { severity: 'DESC' },
    })
  }

  async update(id: number, updateDto: UpdatePatientAllergyDto): Promise<void> {
    const allergy = await this.findOne(id)

    Object.assign(allergy, {
      ...updateDto,
      occurrenceDate: updateDto.occurrenceDate
        ? new Date(updateDto.occurrenceDate)
        : allergy.occurrenceDate,
    })
    await this.allergyRepository.save(allergy)
  }

  async remove(id: number): Promise<void> {
    const allergy = await this.findOne(id)
    await this.allergyRepository.delete(id)
  }

  async checkPatientAllergy(
    patientId: number,
    drugId: number,
  ): Promise<PatientAllergyEntity | null> {
    return this.allergyRepository.findOne({
      where: [
        { patientId, drugId },
        { patientId, allergenName: '' as any },
      ],
    })
  }
}
