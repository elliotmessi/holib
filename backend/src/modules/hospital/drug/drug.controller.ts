import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common"
import { ApiOperation, ApiTags } from "@nestjs/swagger"

import { ApiResult } from "~/common/decorators/api-result.decorator"
import { Idempotence } from "~/common/decorators/idempotence.decorator"
import { ApiSecurityAuth } from "~/common/decorators/swagger.decorator"
import { CreatorPipe } from "~/common/pipes/creator.pipe"
import { UpdaterPipe } from "~/common/pipes/updater.pipe"
import { Pagination } from "~/helper/paginate/pagination"
import { definePermission, Perm } from "~/modules/auth/decorators/permission.decorator"

import { DrugEntity } from "./drug.entity"
import { CreateDrugDto, UpdateDrugDto, DrugQueryDto } from "./drug.dto"
import { DrugService } from "./drug.service"

export const permissions = definePermission("drug:drug", {
  LIST: "list",
  CREATE: "create",
  READ: "read",
  UPDATE: "update",
  DELETE: "delete",
  UPDATE_STATUS: "updateStatus",
} as const)

@ApiSecurityAuth()
@ApiTags("Drug - 药品管理模块")
@Controller("drugs")
export class DrugController {
  constructor(private drugService: DrugService) {}

  @Get()
  @ApiOperation({ summary: "获取药品列表" })
  @ApiResult({ type: [DrugEntity], isPage: true })
  @Perm(permissions.LIST)
  async list(@Query() query: DrugQueryDto): Promise<Pagination<DrugEntity>> {
    return this.drugService.findAll(query)
  }

  @Post()
  @ApiOperation({ summary: "创建药品" })
  @Idempotence()
  @Perm(permissions.CREATE)
  async create(@Body(CreatorPipe) createDto: CreateDrugDto): Promise<DrugEntity> {
    return this.drugService.create(createDto)
  }

  @Get(":id")
  @ApiOperation({ summary: "获取药品详情" })
  @ApiResult({ type: DrugEntity })
  @Perm(permissions.READ)
  async info(@Param("id") id: number): Promise<DrugEntity> {
    return this.drugService.findOne(id)
  }

  @Put(":id")
  @ApiOperation({ summary: "更新药品信息" })
  @Perm(permissions.UPDATE)
  async update(@Param("id") id: number, @Body(UpdaterPipe) updateDto: UpdateDrugDto): Promise<void> {
    await this.drugService.update(id, updateDto)
  }

  @Put(":id/status")
  @ApiOperation({ summary: "更新药品状态" })
  @Perm(permissions.UPDATE_STATUS)
  async updateStatus(@Param("id") id: number, @Body("status") status: string): Promise<void> {
    await this.drugService.updateStatus(id, status as any)
  }

  @Delete(":id")
  @ApiOperation({ summary: "删除药品" })
  @Perm(permissions.DELETE)
  async delete(@Param("id") id: number): Promise<void> {
    await this.drugService.remove(id)
  }
}
