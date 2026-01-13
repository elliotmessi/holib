import { MigrationInterface, QueryRunner } from "typeorm"

export class InitHospitalMenuData1767760000002 implements MigrationInterface {
  name = "InitHospitalMenuData1767760000002"

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. 修复路由路径问题
    // 将 /sys/monitor/login-log 改为 /system/monitor/login-log
    await queryRunner.query(`UPDATE sys_menu SET path = '/system/monitor/login-log' WHERE id = 7`)
    // 将 /health 改为 /system/monitor/health
    await queryRunner.query(`UPDATE sys_menu SET path = '/system/monitor/health' WHERE id = 68`)
    // 将 /system/task 改为 /system/schedule/task
    await queryRunner.query(`UPDATE sys_menu SET path = '/system/schedule/task' WHERE id = 10`)
    // 将 /system/task/log 改为 /system/schedule/task/log
    await queryRunner.query(`UPDATE sys_menu SET path = '/system/schedule/task/log' WHERE id = 11`)
    // 将 /param-config 改为 /system/param-config
    await queryRunner.query(`UPDATE sys_menu SET path = '/system/param-config' WHERE id = 86`)
    // 将 /system/dict-item/:id 改为 /system/dict-item
    await queryRunner.query(`UPDATE sys_menu SET path = '/system/dict-item' WHERE id = 107`)
    // 将 /netdisk 改为 /netdisk
    await queryRunner.query(`UPDATE sys_menu SET path = '/netdisk' WHERE id = 115`)
    // 将 manage 改为 /netdisk/manage
    await queryRunner.query(`UPDATE sys_menu SET path = '/netdisk/manage' WHERE id = 116`)
    // 将 overview 改为 /netdisk/overview
    await queryRunner.query(`UPDATE sys_menu SET path = '/netdisk/overview' WHERE id = 127`)
    // 将 sys/dict-item/:id 改为 /system/dict-item
    await queryRunner.query(`UPDATE sys_menu SET path = '/system/dict-item' WHERE id = 107`)

    // 2. 添加医院模块的路由信息
    // 2.1 医院模块主菜单
    await queryRunner.query(`
      INSERT INTO sys_menu (
        parent_id, path, name, permission, type, icon, order_no, component, keep_alive, \`show\`, status, is_ext, ext_open_mode
      ) VALUES (
        NULL, '/hospital', '医院管理', '', 0, 'ant-design:bank-outlined', 100, '', 0, 1, 1, 0, 1
      )
    `)
    const hospitalMenuId = await queryRunner.query(`SELECT LAST_INSERT_ID() as id`)
    const hospitalMenuIdValue = hospitalMenuId[0].id

    // 2.2 医院管理子菜单
    await queryRunner.query(`
      INSERT INTO sys_menu (
        parent_id, path, name, permission, type, icon, order_no, component, keep_alive, \`show\`, status, is_ext, ext_open_mode
      ) VALUES
        (${hospitalMenuIdValue}, 'hospital', '医院信息', 'hospital:hospital:list', 1, 'ant-design:home-outlined', 1, '/hospital/hospital/index', 0, 1, 1, 0, 1),
        (${hospitalMenuIdValue}, 'department', '科室管理', 'hospital:department:list', 1, 'ant-design:project-outlined', 2, '/hospital/department/index', 0, 1, 1, 0, 1),
        (${hospitalMenuIdValue}, 'doctor', '医生管理', 'hospital:doctor:list', 1, 'ant-design:user-outlined', 3, '/hospital/doctor/index', 0, 1, 1, 0, 1),
        (${hospitalMenuIdValue}, 'patient', '患者管理', 'hospital:patient:list', 1, 'ant-design:idcard-outlined', 4, '/hospital/patient/index', 0, 1, 1, 0, 1),
        (${hospitalMenuIdValue}, 'drug', '药品管理', 'hospital:drug:list', 1, 'ant-design:medicine-box-outlined', 5, '/hospital/drug/index', 0, 1, 1, 0, 1),
        (${hospitalMenuIdValue}, 'pharmacy', '药房管理', 'hospital:pharmacy:list', 1, 'ant-design:shop-outlined', 6, '/hospital/pharmacy/index', 0, 1, 1, 0, 1),
        (${hospitalMenuIdValue}, 'inventory', '库存管理', 'hospital:inventory:list', 1, 'ant-design:database-outlined', 7, '/hospital/inventory/index', 0, 1, 1, 0, 1),
        (${hospitalMenuIdValue}, 'prescription', '处方管理', 'hospital:prescription:list', 1, 'ant-design:file-text-outlined', 8, '/hospital/prescription/index', 0, 1, 1, 0, 1)
    `)

    // 2.3 添加医院管理子菜单的操作权限
    // 先查询子菜单ID
    const hospitalSubMenuIds = await queryRunner.query(`
      SELECT 
        CASE path 
          WHEN 'hospital' THEN 'hospitalId'
          WHEN 'department' THEN 'departmentId'
          WHEN 'doctor' THEN 'doctorId'
          WHEN 'patient' THEN 'patientId'
          WHEN 'drug' THEN 'drugId'
          WHEN 'pharmacy' THEN 'pharmacyId'
          WHEN 'inventory' THEN 'inventoryId'
          WHEN 'prescription' THEN 'prescriptionId'
        END as menuType, 
        id 
      FROM sys_menu 
      WHERE parent_id = ${hospitalMenuIdValue}
    `)

    // 转换为便于使用的对象
    const subMenuIds: Record<string, number> = {}
    for (const menu of hospitalSubMenuIds) {
      subMenuIds[menu.menuType] = menu.id
    }

    // 添加操作权限
    await queryRunner.query(`
      INSERT INTO sys_menu (
        parent_id, path, name, permission, type, order_no, component, keep_alive, \`show\`, status, is_ext, ext_open_mode
      ) VALUES
        -- 医院信息操作权限
        (${subMenuIds.hospitalId}, NULL, '新增', 'hospital:hospital:create', 2, 0, NULL, 0, 1, 1, 0, 1),
        (${subMenuIds.hospitalId}, NULL, '删除', 'hospital:hospital:delete', 2, 0, NULL, 0, 1, 1, 0, 1),
        (${subMenuIds.hospitalId}, NULL, '更新', 'hospital:hospital:update', 2, 0, NULL, 0, 1, 1, 0, 1),
        (${subMenuIds.hospitalId}, NULL, '查询', 'hospital:hospital:read', 2, 0, NULL, 0, 1, 1, 0, 1),
        
        -- 科室管理操作权限
        (${subMenuIds.departmentId}, NULL, '新增', 'hospital:department:create', 2, 0, NULL, 0, 1, 1, 0, 1),
        (${subMenuIds.departmentId}, NULL, '删除', 'hospital:department:delete', 2, 0, NULL, 0, 1, 1, 0, 1),
        (${subMenuIds.departmentId}, NULL, '更新', 'hospital:department:update', 2, 0, NULL, 0, 1, 1, 0, 1),
        (${subMenuIds.departmentId}, NULL, '查询', 'hospital:department:read', 2, 0, NULL, 0, 1, 1, 0, 1),
        
        -- 医生管理操作权限
        (${subMenuIds.doctorId}, NULL, '新增', 'hospital:doctor:create', 2, 0, NULL, 0, 1, 1, 0, 1),
        (${subMenuIds.doctorId}, NULL, '删除', 'hospital:doctor:delete', 2, 0, NULL, 0, 1, 1, 0, 1),
        (${subMenuIds.doctorId}, NULL, '更新', 'hospital:doctor:update', 2, 0, NULL, 0, 1, 1, 0, 1),
        (${subMenuIds.doctorId}, NULL, '查询', 'hospital:doctor:read', 2, 0, NULL, 0, 1, 1, 0, 1),
        
        -- 患者管理操作权限
        (${subMenuIds.patientId}, NULL, '新增', 'hospital:patient:create', 2, 0, NULL, 0, 1, 1, 0, 1),
        (${subMenuIds.patientId}, NULL, '删除', 'hospital:patient:delete', 2, 0, NULL, 0, 1, 1, 0, 1),
        (${subMenuIds.patientId}, NULL, '更新', 'hospital:patient:update', 2, 0, NULL, 0, 1, 1, 0, 1),
        (${subMenuIds.patientId}, NULL, '查询', 'hospital:patient:read', 2, 0, NULL, 0, 1, 1, 0, 1),
        
        -- 药品管理操作权限
        (${subMenuIds.drugId}, NULL, '新增', 'hospital:drug:create', 2, 0, NULL, 0, 1, 1, 0, 1),
        (${subMenuIds.drugId}, NULL, '删除', 'hospital:drug:delete', 2, 0, NULL, 0, 1, 1, 0, 1),
        (${subMenuIds.drugId}, NULL, '更新', 'hospital:drug:update', 2, 0, NULL, 0, 1, 1, 0, 1),
        (${subMenuIds.drugId}, NULL, '查询', 'hospital:drug:read', 2, 0, NULL, 0, 1, 1, 0, 1),
        
        -- 药房管理操作权限
        (${subMenuIds.pharmacyId}, NULL, '新增', 'hospital:pharmacy:create', 2, 0, NULL, 0, 1, 1, 0, 1),
        (${subMenuIds.pharmacyId}, NULL, '删除', 'hospital:pharmacy:delete', 2, 0, NULL, 0, 1, 1, 0, 1),
        (${subMenuIds.pharmacyId}, NULL, '更新', 'hospital:pharmacy:update', 2, 0, NULL, 0, 1, 1, 0, 1),
        (${subMenuIds.pharmacyId}, NULL, '查询', 'hospital:pharmacy:read', 2, 0, NULL, 0, 1, 1, 0, 1),
        
        -- 库存管理操作权限
        (${subMenuIds.inventoryId}, NULL, '新增', 'hospital:inventory:create', 2, 0, NULL, 0, 1, 1, 0, 1),
        (${subMenuIds.inventoryId}, NULL, '删除', 'hospital:inventory:delete', 2, 0, NULL, 0, 1, 1, 0, 1),
        (${subMenuIds.inventoryId}, NULL, '更新', 'hospital:inventory:update', 2, 0, NULL, 0, 1, 1, 0, 1),
        (${subMenuIds.inventoryId}, NULL, '查询', 'hospital:inventory:read', 2, 0, NULL, 0, 1, 1, 0, 1),
        
        -- 处方管理操作权限
        (${subMenuIds.prescriptionId}, NULL, '新增', 'hospital:prescription:create', 2, 0, NULL, 0, 1, 1, 0, 1),
        (${subMenuIds.prescriptionId}, NULL, '删除', 'hospital:prescription:delete', 2, 0, NULL, 0, 1, 1, 0, 1),
        (${subMenuIds.prescriptionId}, NULL, '更新', 'hospital:prescription:update', 2, 0, NULL, 0, 1, 1, 0, 1),
        (${subMenuIds.prescriptionId}, NULL, '查询', 'hospital:prescription:read', 2, 0, NULL, 0, 1, 1, 0, 1)
    `)

    // 3. 确保超级管理员（role_id=1）有医院模块的相关权限
    await queryRunner.query(`
      INSERT INTO sys_role_menus (role_id, menu_id) 
      SELECT 1, id FROM sys_menu 
      WHERE parent_id = ${hospitalMenuIdValue} OR parent_id IN (SELECT id FROM sys_menu WHERE parent_id = ${hospitalMenuIdValue})
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 删除医院模块相关数据
    const hospitalMenuId = await queryRunner.query(`SELECT id FROM sys_menu WHERE path = '/hospital'`)
    if (hospitalMenuId.length > 0) {
      const hospitalMenuIdValue = hospitalMenuId[0].id
      // 删除角色菜单关联
      await queryRunner.query(`
        DELETE FROM sys_role_menus 
        WHERE menu_id = ${hospitalMenuIdValue} OR menu_id IN (SELECT id FROM sys_menu WHERE parent_id = ${hospitalMenuIdValue})
      `)
      // 删除子菜单和操作权限
      await queryRunner.query(`DELETE FROM sys_menu WHERE parent_id = ${hospitalMenuIdValue}`)
      // 删除主菜单
      await queryRunner.query(`DELETE FROM sys_menu WHERE id = ${hospitalMenuIdValue}`)
    }
    // 恢复路由路径
    await queryRunner.query(`UPDATE sys_menu SET path = '/sys/monitor/login-log' WHERE id = 7`)
    await queryRunner.query(`UPDATE sys_menu SET path = '/health' WHERE id = 68`)
    await queryRunner.query(`UPDATE sys_menu SET path = '/system/task' WHERE id = 10`)
    await queryRunner.query(`UPDATE sys_menu SET path = '/system/task/log' WHERE id = 11`)
    await queryRunner.query(`UPDATE sys_menu SET path = '/param-config' WHERE id = 86`)
    await queryRunner.query(`UPDATE sys_menu SET path = 'system/dict-item/:id' WHERE id = 107`)
    await queryRunner.query(`UPDATE sys_menu SET path = 'netdisk' WHERE id = 115`)
    await queryRunner.query(`UPDATE sys_menu SET path = 'manage' WHERE id = 116`)
    await queryRunner.query(`UPDATE sys_menu SET path = 'overview' WHERE id = 127`)
  }
}
