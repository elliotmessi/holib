import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

import { paginate } from "~/helper/paginate"
import { Pagination } from "~/helper/paginate/pagination"
import { BusinessException } from "~/common/exceptions/biz.exception"
import { ErrorEnum } from "~/constants/error-code.constant"

import { PatientEntity } from "./patient.entity"
import { CreatePatientDto, UpdatePatientDto, PatientQueryDto } from "./patient.dto"

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(PatientEntity)
    private patientRepository: Repository<PatientEntity>
  ) {}

  async create(createDto: CreatePatientDto): Promise<PatientEntity> {
    const exist = await this.patientRepository.findOneBy({
      medicalRecordNumber: createDto.medicalRecordNumber,
    })
    if (exist) {
      throw new BusinessException(ErrorEnum.DATA_ALREADY_EXISTS)
    }

    if (createDto.idCard) {
      const idCardExist = await this.patientRepository.findOneBy({
        idCard: createDto.idCard,
      })
      if (idCardExist) {
        throw new BusinessException(ErrorEnum.DATA_ALREADY_EXISTS)
      }
    }

    const patient = this.patientRepository.create(createDto)
    return this.patientRepository.save(patient)
  }

  async findAll(query: PatientQueryDto): Promise<Pagination<PatientEntity>> {
    const queryBuilder = this.patientRepository.createQueryBuilder("patient")

    if (query.name) {
      queryBuilder.andWhere("patient.name LIKE :name", { name: `%${query.name}%` })
    }
    if (query.medicalRecordNumber) {
      queryBuilder.andWhere("patient.medicalRecordNumber LIKE :medicalRecordNumber", {
        medicalRecordNumber: `%${query.medicalRecordNumber}%`,
      })
    }
    if (query.idCard) {
      queryBuilder.andWhere("patient.idCard LIKE :idCard", {
        idCard: `%${query.idCard}%`,
      })
    }
    if (query.phone) {
      queryBuilder.andWhere("patient.phone LIKE :phone", {
        phone: `%${query.phone}%`,
      })
    }
    if (query.gender) {
      queryBuilder.andWhere("patient.gender = :gender", { gender: query.gender })
    }
    if (query.minAge !== undefined) {
      queryBuilder.andWhere("patient.age >= :minAge", { minAge: query.minAge })
    }
    if (query.maxAge !== undefined) {
      queryBuilder.andWhere("patient.age <= :maxAge", { maxAge: query.maxAge })
    }

    queryBuilder.orderBy("patient.createdAt", "DESC")
    return paginate<PatientEntity>(queryBuilder, {
      page: query.page,
      pageSize: query.pageSize,
    })
  }

  async findOne(id: number): Promise<PatientEntity> {
    const patient = await this.patientRepository.findOne({ where: { id } })
    if (!patient) {
      throw new BusinessException(ErrorEnum.DATA_NOT_FOUND)
    }
    return patient
  }

  async findByMedicalRecordNumber(medicalRecordNumber: string): Promise<PatientEntity> {
    const patient = await this.patientRepository.findOneBy({ medicalRecordNumber })
    if (!patient) {
      throw new BusinessException(ErrorEnum.DATA_NOT_FOUND)
    }
    return patient
  }

  async findByIdCard(idCard: string): Promise<PatientEntity> {
    const patient = await this.patientRepository.findOneBy({ idCard })
    if (!patient) {
      throw new BusinessException(ErrorEnum.DATA_NOT_FOUND)
    }
    return patient
  }

  async update(id: number, updateDto: UpdatePatientDto): Promise<void> {
    const patient = await this.findOne(id)

    if (updateDto.medicalRecordNumber !== patient.medicalRecordNumber) {
      const exist = await this.patientRepository.findOneBy({
        medicalRecordNumber: updateDto.medicalRecordNumber,
      })
      if (exist) {
        throw new BusinessException(ErrorEnum.DATA_ALREADY_EXISTS)
      }
    }

    if (updateDto.idCard && updateDto.idCard !== patient.idCard) {
      const idCardExist = await this.patientRepository.findOneBy({
        idCard: updateDto.idCard,
      })
      if (idCardExist) {
        throw new BusinessException(ErrorEnum.DATA_ALREADY_EXISTS)
      }
    }

    Object.assign(patient, updateDto)
    await this.patientRepository.save(patient)
  }

  async remove(id: number): Promise<void> {
    const patient = await this.findOne(id)
    await this.patientRepository.delete(id)
  }

  async updateDiagnosis(id: number, diagnosis: string): Promise<void> {
    const patient = await this.findOne(id)
    patient.currentDiagnosis = diagnosis
    await this.patientRepository.save(patient)
  }

  async updateAllergyHistory(id: number, allergyHistory: string): Promise<void> {
    const patient = await this.findOne(id)
    patient.allergyHistory = allergyHistory
    await this.patientRepository.save(patient)
  }
}
