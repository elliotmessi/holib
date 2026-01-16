import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import * as crypto from "crypto"

import { paginate } from "~/helper/paginate"
import { Pagination } from "~/helper/paginate/pagination"
import { BusinessException } from "~/common/exceptions/biz.exception"
import { ErrorEnum } from "~/constants/error-code.constant"

import { DoctorEntity } from "./doctor.entity"
import { CreateDoctorDto, UpdateDoctorDto, DoctorQueryDto, ChangePasswordDto } from "./doctor.dto"

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(DoctorEntity)
    private doctorRepository: Repository<DoctorEntity>
  ) {}

  private hashPassword(password: string, salt: string): string {
    return crypto
      .createHash("sha256")
      .update(password + salt)
      .digest("hex")
  }

  private generateSalt(): string {
    return crypto.randomBytes(16).toString("hex")
  }

  async create(createDto: CreateDoctorDto): Promise<DoctorEntity> {
    const exist = await this.doctorRepository.findOneBy({
      doctorCode: createDto.doctorCode,
    })
    if (exist) {
      throw new BusinessException(ErrorEnum.DATA_ALREADY_EXISTS)
    }

    const salt = this.generateSalt()
    const defaultPassword = "a123456"
    const passwordHash = this.hashPassword(createDto.password || defaultPassword, salt)

    const doctor = this.doctorRepository.create({
      ...createDto,
      passwordHash,
      salt,
    })
    return this.doctorRepository.save(doctor)
  }

  async findAll(query: DoctorQueryDto): Promise<Pagination<DoctorEntity>> {
    const queryBuilder = this.doctorRepository.createQueryBuilder("doctor")
    queryBuilder.leftJoinAndSelect("doctor.department", "department")

    if (query.name) {
      queryBuilder.andWhere("doctor.name LIKE :name", { name: `%${query.name}%` })
    }
    if (query.doctorCode) {
      queryBuilder.andWhere("doctor.doctorCode LIKE :doctorCode", {
        doctorCode: `%${query.doctorCode}%`,
      })
    }
    if (query.departmentId) {
      queryBuilder.andWhere("doctor.departmentId = :departmentId", {
        departmentId: query.departmentId,
      })
    }
    if (query.title) {
      queryBuilder.andWhere("doctor.title = :title", { title: query.title })
    }
    if (query.status) {
      queryBuilder.andWhere("doctor.status = :status", { status: query.status })
    }

    queryBuilder.orderBy("doctor.createdAt", "DESC")
    return paginate<DoctorEntity>(queryBuilder, {
      page: query.page,
      pageSize: query.pageSize,
    })
  }

  async findOne(id: number): Promise<DoctorEntity> {
    const doctor = await this.doctorRepository.findOne({
      where: { id },
      relations: ["department"],
    })
    if (!doctor) {
      throw new BusinessException(ErrorEnum.DATA_NOT_FOUND)
    }
    return doctor
  }

  async update(id: number, updateDto: UpdateDoctorDto): Promise<void> {
    const doctor = await this.findOne(id)

    if (updateDto.doctorCode !== doctor.doctorCode) {
      const exist = await this.doctorRepository.findOneBy({
        doctorCode: updateDto.doctorCode,
      })
      if (exist) {
        throw new BusinessException(ErrorEnum.DATA_ALREADY_EXISTS)
      }
    }

    Object.assign(doctor, updateDto)
    await this.doctorRepository.save(doctor)
  }

  async changePassword(id: number, changePasswordDto: ChangePasswordDto): Promise<void> {
    const doctor = await this.findOne(id)

    const oldPasswordHash = this.hashPassword(changePasswordDto.oldPassword, doctor.salt!)
    if (oldPasswordHash !== doctor.passwordHash) {
      throw new BusinessException(ErrorEnum.PASSWORD_MISMATCH)
    }

    const newSalt = this.generateSalt()
    const newPasswordHash = this.hashPassword(changePasswordDto.newPassword, newSalt)

    doctor.salt = newSalt
    doctor.passwordHash = newPasswordHash
    await this.doctorRepository.save(doctor)
  }

  async remove(id: number): Promise<void> {
    const doctor = await this.findOne(id)
    await this.doctorRepository.delete(id)
  }

  async validatePassword(id: number, password: string): Promise<boolean> {
    const doctor = await this.findOne(id)
    const passwordHash = this.hashPassword(password, doctor.salt!)
    return passwordHash === doctor.passwordHash
  }
}
