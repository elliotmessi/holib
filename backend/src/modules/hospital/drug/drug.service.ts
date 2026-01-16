import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

import { paginate } from "~/helper/paginate"
import { Pagination } from "~/helper/paginate/pagination"
import { BusinessException } from "~/common/exceptions/biz.exception"
import { ErrorEnum } from "~/constants/error-code.constant"

import { DrugEntity, DrugStatus } from "./drug.entity"
import { CreateDrugDto, UpdateDrugDto, DrugQueryDto } from "./drug.dto"

@Injectable()
export class DrugService {
  constructor(
    @InjectRepository(DrugEntity)
    private drugRepository: Repository<DrugEntity>
  ) {}

  async create(createDto: CreateDrugDto): Promise<DrugEntity> {
    const exist = await this.drugRepository.findOneBy({
      drugCode: createDto.drugCode,
    })
    if (exist) {
      throw new BusinessException(ErrorEnum.DATA_ALREADY_EXISTS)
    }

    const drug = this.drugRepository.create({
      ...createDto,
      validFrom: new Date(createDto.validFrom),
      validTo: new Date(createDto.validTo),
    })
    return this.drugRepository.save(drug)
  }

  async findAll(query: DrugQueryDto): Promise<Pagination<DrugEntity>> {
    const queryBuilder = this.drugRepository.createQueryBuilder("drug")
    queryBuilder.leftJoinAndSelect("drug.pharmacologicalClass", "pharmacologicalClass")
    queryBuilder.leftJoinAndSelect("drug.dosageClass", "dosageClass")
    queryBuilder.leftJoinAndSelect("drug.departmentClass", "departmentClass")

    if (query.name) {
      queryBuilder.andWhere("(drug.genericName LIKE :name OR drug.tradeName LIKE :name)", {
        name: `%${query.name}%`,
      })
    }
    if (query.drugCode) {
      queryBuilder.andWhere("drug.drugCode LIKE :drugCode", {
        drugCode: `%${query.drugCode}%`,
      })
    }
    if (query.drugType) {
      queryBuilder.andWhere("drug.drugType = :drugType", { drugType: query.drugType })
    }
    if (query.dosageForm) {
      queryBuilder.andWhere("drug.dosageForm = :dosageForm", { dosageForm: query.dosageForm })
    }
    if (query.manufacturer) {
      queryBuilder.andWhere("drug.manufacturer LIKE :manufacturer", {
        manufacturer: `%${query.manufacturer}%`,
      })
    }
    if (query.status) {
      queryBuilder.andWhere("drug.status = :status", { status: query.status })
    }
    if (query.pharmacologicalClassId) {
      queryBuilder.andWhere("drug.pharmacologicalClassId = :pharmacologicalClassId", {
        pharmacologicalClassId: query.pharmacologicalClassId,
      })
    }

    queryBuilder.orderBy("drug.createdAt", "DESC")
    return paginate<DrugEntity>(queryBuilder, {
      page: query.page,
      pageSize: query.pageSize,
    })
  }

  async findOne(id: number): Promise<DrugEntity> {
    const drug = await this.drugRepository.findOne({
      where: { id },
      relations: ["pharmacologicalClass", "dosageClass", "departmentClass"],
    })
    if (!drug) {
      throw new BusinessException(ErrorEnum.DATA_NOT_FOUND)
    }
    return drug
  }

  async update(id: number, updateDto: UpdateDrugDto): Promise<void> {
    const drug = await this.findOne(id)

    if (updateDto.drugCode !== drug.drugCode) {
      const exist = await this.drugRepository.findOneBy({
        drugCode: updateDto.drugCode,
      })
      if (exist) {
        throw new BusinessException(ErrorEnum.DATA_ALREADY_EXISTS)
      }
    }

    Object.assign(drug, {
      ...updateDto,
      validFrom: updateDto.validFrom ? new Date(updateDto.validFrom) : drug.validFrom,
      validTo: updateDto.validTo ? new Date(updateDto.validTo) : drug.validTo,
    })
    await this.drugRepository.save(drug)
  }

  async updateStatus(id: number, status: DrugStatus): Promise<void> {
    const drug = await this.findOne(id)
    drug.status = status
    await this.drugRepository.save(drug)
  }

  async remove(id: number): Promise<void> {
    const drug = await this.findOne(id)
    await this.drugRepository.delete(id)
  }
}
