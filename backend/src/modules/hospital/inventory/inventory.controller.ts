import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common"
import { ApiOperation, ApiTags } from "@nestjs/swagger"

import { ApiResult } from "~/common/decorators/api-result.decorator"
import { Idempotence } from "~/common/decorators/idempotence.decorator"
import { ApiSecurityAuth } from "~/common/decorators/swagger.decorator"
import { CreatorPipe } from "~/common/pipes/creator.pipe"
import { UpdaterPipe } from "~/common/pipes/updater.pipe"
import { Pagination } from "~/helper/paginate/pagination"
import { AuthUser } from "~/modules/auth/decorators/auth-user.decorator"
import { definePermission, Perm } from "~/modules/auth/decorators/permission.decorator"

import { InventoryEntity } from "./inventory.entity"
import { CreateInventoryDto, UpdateInventoryDto, InventoryQueryDto, AdjustInventoryDto } from "./inventory.dto"
import { InventoryService } from "./inventory.service"

export const permissions = definePermission("inventory:inventory", {
  LIST: "list",
  CREATE: "create",
  READ: "read",
  UPDATE: "update",
  ADJUST: "adjust",
  FREEZE: "freeze",
  DELETE: "delete",
  LOW_STOCK: "lowStock",
  EXPIRING: "expiring",
} as const)

@ApiSecurityAuth()
@ApiTags("Inventory - 库存管理模块")
@Controller("inventory")
export class InventoryController {
  constructor(private inventoryService: InventoryService) {}

  @Get()
  @ApiOperation({ summary: "获取库存列表" })
  @ApiResult({ type: [InventoryEntity], isPage: true })
  @Perm(permissions.LIST)
  async list(@Query() query: InventoryQueryDto): Promise<Pagination<InventoryEntity>> {
    return this.inventoryService.findAll(query)
  }

  @Get("low-stock")
  @ApiOperation({ summary: "获取库存不足的药品" })
  @ApiResult({ type: [InventoryEntity] })
  @Perm(permissions.LOW_STOCK)
  async getLowStock(): Promise<InventoryEntity[]> {
    return this.inventoryService.getLowStock()
  }

  @Get("expiring")
  @ApiOperation({ summary: "获取即将过期的药品" })
  @ApiResult({ type: [InventoryEntity] })
  @Perm(permissions.EXPIRING)
  async getExpiring(@Query("days") days: number = 90): Promise<InventoryEntity[]> {
    return this.inventoryService.getExpiringWithinDays(days)
  }

  @Post()
  @ApiOperation({ summary: "创建库存记录" })
  @Idempotence()
  @Perm(permissions.CREATE)
  async create(@Body(CreatorPipe) createDto: CreateInventoryDto): Promise<InventoryEntity> {
    return this.inventoryService.create(createDto)
  }

  @Get(":id")
  @ApiOperation({ summary: "获取库存详情" })
  @ApiResult({ type: InventoryEntity })
  @Perm(permissions.READ)
  async info(@Param("id") id: number): Promise<InventoryEntity> {
    return this.inventoryService.findOne(id)
  }

  @Put(":id")
  @ApiOperation({ summary: "更新库存信息" })
  @Perm(permissions.UPDATE)
  async update(@Param("id") id: number, @Body(UpdaterPipe) updateDto: UpdateInventoryDto): Promise<void> {
    await this.inventoryService.update(id, updateDto)
  }

  @Post(":id/adjust")
  @ApiOperation({ summary: "调整库存数量" })
  @Perm(permissions.ADJUST)
  async adjust(@Param("id") id: number, @Body() adjustDto: AdjustInventoryDto, @AuthUser("uid") uid: number): Promise<InventoryEntity> {
    return this.inventoryService.adjustQuantity(id, adjustDto, uid)
  }

  @Put(":id/freeze")
  @ApiOperation({ summary: "冻结/解冻库存" })
  @Perm(permissions.FREEZE)
  async freeze(@Param("id") id: number, @Body("isFrozen") isFrozen: boolean): Promise<void> {
    await this.inventoryService.toggleFrozen(id, isFrozen)
  }

  @Delete(":id")
  @ApiOperation({ summary: "删除库存记录" })
  @Perm(permissions.DELETE)
  async delete(@Param("id") id: number): Promise<void> {
    await this.inventoryService.remove(id)
  }
}
