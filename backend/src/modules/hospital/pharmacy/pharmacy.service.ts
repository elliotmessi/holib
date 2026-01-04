import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { BusinessException } from '~/common/exceptions/biz.exception'
import { ErrorEnum } from '~/constants/error-code.constant'

import { PharmacyEntity, PharmacyType } from './pharmacy.entity'
import { CreatePharmacyDto, UpdatePharmacyDto, PharmacyQueryDto } from './pharmacy.dto'

@Injectable()
export class PharmacyService {
  constructor(
    @InjectRepository(PharmacyEntity)
    private pharmacyRepository: Repository<PharmacyEntity>,
  ) {}

  async create(createDto: CreatePharmacyDto): Promise<PharmacyEntity> {
    const exist = await this.pharmacyRepository.findOneBy({
      pharmacyCode: createDto.pharmacyCode,
    })
    if (exist) {
      throw new BusinessException(ErrorEnum.DATA_ALREADY_EXISTS)
    }

    const pharmacy = this.pharmacyRepository.create(createDto)
    return this.pharmacyRepository.save(pharmacy)
  }

  async findAll(query: PharmacyQueryDto): Promise<PharmacyEntity[]> {
    const queryBuilder = this.pharmacyRepository.createQueryBuilder('pharmacy')
    queryBuilder.leftJoinAndSelect('pharmacy.hospital', 'hospital')
    queryBuilder.leftJoinAndSelect('pharmacy.department', 'department')

    if (query.name) {
      queryBuilder.andWhere('pharmacy.name LIKE :name', { name: `%${query.name}%` })
    }
    if (query.pharmacyType) {
      queryBuilder.andWhere('pharmacy.pharmacyType = :pharmacyType', {
        pharmacyType: query.pharmacyType,
      })
    }
    if (query.hospitalId) {
      queryBuilder.andWhere('pharmacy.hospitalId = :hospitalId', {
        hospitalId: query.hospitalId,
      })
    }
    if (query.departmentId) {
      queryBuilder.andWhere('pharmacy.departmentId = :departmentId', {
        departmentId: query.departmentId,
      })
    }

    queryBuilder.orderBy('pharmacy.createdAt', 'DESC')
    return queryBuilder.getMany()
  }

  async findOne(id: number): Promise<PharmacyEntity> {
    const pharmacy = await this.pharmacyRepository.findOne({
      where: { id },
      relations: ['hospital', 'department'],
    })
    if (!pharmacy) {
      throw new BusinessException(ErrorEnum.DATA_NOT_FOUND)
    }
    return pharmacy
  }

  async update(id: number, updateDto: UpdatePharmacyDto): Promise<void> {
    const pharmacy = await this.findOne(id)

    if (updateDto.pharmacyCode !== pharmacy.pharmacyCode) {
      const exist = await this.pharmacyRepository.findOneBy({
        pharmacyCode: updateDto.pharmacyCode,
      })
      if (exist) {
        throw new BusinessException(ErrorEnum.DATA_ALREADY_EXISTS)
      }
    }

    Object.assign(pharmacy, updateDto)
    await this.pharmacyRepository.save(pharmacy)
  }

  async remove(id: number): Promise<void> {
    const pharmacy = await this.findOne(id)
    await this.pharmacyRepository.delete(id)
  }
}
