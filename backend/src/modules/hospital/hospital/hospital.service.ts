import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { BusinessException } from '~/common/exceptions/biz.exception'
import { ErrorEnum } from '~/constants/error-code.constant'

import { HospitalEntity } from './hospital.entity'
import { CreateHospitalDto, UpdateHospitalDto, HospitalQueryDto } from './hospital.dto'

@Injectable()
export class HospitalService {
  constructor(
    @InjectRepository(HospitalEntity)
    private hospitalRepository: Repository<HospitalEntity>,
  ) {}

  async create(createDto: CreateHospitalDto): Promise<HospitalEntity> {
    const exist = await this.hospitalRepository.findOneBy({
      hospitalCode: createDto.hospitalCode,
    })
    if (exist) {
      throw new BusinessException(ErrorEnum.DATA_ALREADY_EXISTS)
    }
    const hospital = this.hospitalRepository.create(createDto)
    return this.hospitalRepository.save(hospital)
  }

  async findAll(query: HospitalQueryDto): Promise<HospitalEntity[]> {
    const queryBuilder = this.hospitalRepository.createQueryBuilder('hospital')
    if (query.name) {
      queryBuilder.andWhere('hospital.name LIKE :name', { name: `%${query.name}%` })
    }
    if (query.hospitalCode) {
      queryBuilder.andWhere('hospital.hospitalCode LIKE :hospitalCode', {
        hospitalCode: `%${query.hospitalCode}%`,
      })
    }
    if (query.level) {
      queryBuilder.andWhere('hospital.level = :level', { level: query.level })
    }
    queryBuilder.orderBy('hospital.createdAt', 'DESC')
    return queryBuilder.getMany()
  }

  async findOne(id: number): Promise<HospitalEntity> {
    const hospital = await this.hospitalRepository.findOne({
      where: { id },
      relations: ['departments', 'pharmacies'],
    })
    if (!hospital) {
      throw new BusinessException(ErrorEnum.DATA_NOT_FOUND)
    }
    return hospital
  }

  async update(id: number, updateDto: UpdateHospitalDto): Promise<void> {
    const hospital = await this.findOne(id)
    if (updateDto.hospitalCode !== hospital.hospitalCode) {
      const exist = await this.hospitalRepository.findOneBy({
        hospitalCode: updateDto.hospitalCode,
      })
      if (exist) {
        throw new BusinessException(ErrorEnum.DATA_ALREADY_EXISTS)
      }
    }
    Object.assign(hospital, updateDto)
    await this.hospitalRepository.save(hospital)
  }

  async remove(id: number): Promise<void> {
    const hospital = await this.findOne(id)
    if (hospital.departments && hospital.departments.length > 0) {
      throw new BusinessException(ErrorEnum.DATA_HAS_ASSOCIATED_CHILDREN)
    }
    if (hospital.pharmacies && hospital.pharmacies.length > 0) {
      throw new BusinessException(ErrorEnum.DATA_HAS_ASSOCIATED_CHILDREN)
    }
    await this.hospitalRepository.delete(id)
  }
}
