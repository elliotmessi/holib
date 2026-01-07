import { MigrationInterface, QueryRunner } from 'typeorm'

export class InitHospitalData1767760000001 implements MigrationInterface {
  name = 'InitHospitalData1767760000001'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO \`hospitals\` (\`hospitalCode\`, \`name\`, \`address\`, \`phone\`, \`contactPerson\`, \`level\`, \`description\`) VALUES
      ('H001', '市中心医院', '北京市朝阳区建国路88号', '010-12345678', '张主任', '三级甲等', '北京市重点综合性医院'),
      ('H002', '第二人民医院', '北京市海淀区中关村大街100号', '010-87654321', '李院长', '三级甲等', '综合性教学医院'),
      ('H003', '妇幼保健院', '北京市西城区复兴门内大街10号', '010-11223344', '王院长', '三级甲等', '专科医院')
    `)

    const hospitalResult = await queryRunner.query(
      `SELECT \`id\`, \`hospitalCode\` FROM \`hospitals\` WHERE \`hospitalCode\` IN ('H001', 'H002', 'H003')`,
    )
    const hospitals = {}
    hospitalResult.forEach((row) => {
      hospitals[row.hospitalCode] = row.id
    })

    await queryRunner.query(`
      INSERT INTO \`departments\` (\`departmentCode\`, \`name\`, \`type\`, \`hospitalId\`, \`parentId\`, \`mpath\`, \`director\`, \`phone\`, \`location\`, \`description\`) VALUES
      ('D001', '内科', 'clinical', ${hospitals['H001']}, NULL, '1.', '刘主任', '010-12345601', '门诊楼3楼', '内科诊疗科室'),
      ('D002', '外科', 'clinical', ${hospitals['H001']}, NULL, '2.', '陈主任', '010-12345602', '门诊楼4楼', '外科诊疗科室'),
      ('D003', '儿科', 'clinical', ${hospitals['H001']}, NULL, '3.', '赵主任', '010-12345603', '儿科楼2楼', '儿科诊疗科室'),
      ('D004', '内科', 'clinical', ${hospitals['H002']}, NULL, '4.', '孙主任', '010-87654301', '门诊楼2楼', '内科诊疗科室'),
      ('D005', '外科', 'clinical', ${hospitals['H002']}, NULL, '5.', '周主任', '010-87654302', '门诊楼3楼', '外科诊疗科室'),
      ('D006', '妇产科', 'clinical', ${hospitals['H003']}, NULL, '6.', '吴主任', '010-11223301', '门诊楼3楼', '妇产科诊疗科室'),
      ('D007', '儿科', 'clinical', ${hospitals['H003']}, NULL, '7.', '郑主任', '010-11223302', '儿科楼1楼', '儿科诊疗科室')
    `)

    const deptResult = await queryRunner.query(
      `SELECT \`id\`, \`departmentCode\` FROM \`departments\` WHERE \`departmentCode\` IN ('D001', 'D002', 'D003', 'D004', 'D005', 'D006', 'D007')`,
    )
    const departments = {}
    deptResult.forEach((row) => {
      departments[row.departmentCode] = row.id
    })

    await queryRunner.query(`
      INSERT INTO \`pharmacies\` (\`pharmacyCode\`, \`name\`, \`hospitalId\`, \`pharmacyType\`, \`departmentId\`, \`floor\`, \`contactPerson\`, \`phone\`, \`description\`) VALUES
      ('P001', '中心药房', ${hospitals['H001']}, 'western_medicine', ${departments['D001']}, '1楼', '张药师', '010-12345610', '西药房'),
      ('P002', '中药房', ${hospitals['H001']}, 'chinese_medicine', ${departments['D001']}, '2楼', '李药师', '010-12345611', '中药房'),
      ('P003', '门诊药房', ${hospitals['H002']}, 'western_medicine', ${departments['D004']}, '1楼', '王药师', '010-87654310', '门诊西药房'),
      ('P004', '住院药房', ${hospitals['H002']}, 'western_medicine', ${departments['D004']}, '3楼', '赵药师', '010-87654311', '住院部药房'),
      ('P005', '综合药房', ${hospitals['H003']}, 'western_medicine', ${departments['D006']}, '1楼', '刘药师', '010-11223310', '综合药房')
    `)

    await queryRunner.query(`
      INSERT INTO \`drug_categories\` (\`name\`, \`type\`, \`parentId\`, \`mpath\`, \`description\`) VALUES
      ('抗生素', 'pharmacological', NULL, '1.', '抗生素类药物'),
      ('解热镇痛药', 'pharmacological', NULL, '2.', '解热镇痛类药物'),
      ('心血管药', 'pharmacological', NULL, '3.', '心血管类药物'),
      ('消化系统药', 'pharmacological', NULL, '4.', '消化系统类药物'),
      ('片剂', 'dosage', NULL, '5.', '片剂类药品'),
      ('注射剂', 'dosage', NULL, '6.', '注射剂类药品'),
      ('口服液', 'dosage', NULL, '7.', '口服液类药品'),
      ('内科用药', 'department', NULL, '8.', '内科专用药品'),
      ('外科用药', 'department', NULL, '9.', '外科专用药品'),
      ('儿科用药', 'department', NULL, '10.', '儿科专用药品')
    `)

    const categoryResult = await queryRunner.query(
      `SELECT \`id\`, \`name\`, \`type\` FROM \`drug_categories\``,
    )
    const categories = {}
    categoryResult.forEach((row) => {
      categories[`${row.name}_${row.type}`] = row.id
    })

    await queryRunner.query(`
      INSERT INTO \`drugs\` (\`drugCode\`, \`genericName\`, \`tradeName\`, \`specification\`, \`dosageForm\`, \`manufacturer\`, \`approvalNumber\`, \`drugType\`, \`validFrom\`, \`validTo\`, \`retailPrice\`, \`wholesalePrice\`, \`pharmacologicalClassId\`, \`dosageClassId\`, \`departmentClassId\`, \`status\`, \`description\`) VALUES
      ('D001', '阿莫西林胶囊', '阿莫西林', '0.25g*24粒', '胶囊剂', '华北制药股份有限公司', '国药准字H20012345', '西药', '2024-01-01', '2026-12-31', 25.00, 20.00, ${categories['抗生素_pharmacological']}, ${categories['片剂_dosage']}, ${categories['内科用药_department']}, 'normal', '青霉素类抗生素，用于敏感菌感染'),
      ('D002', '布洛芬缓释胶囊', '芬必得', '0.3g*20粒', '胶囊剂', '中美天津史克制药有限公司', '国药准字H20013062', '西药', '2024-01-01', '2026-12-31', 18.50, 15.00, ${categories['解热镇痛药_pharmacological']}, ${categories['片剂_dosage']}, ${categories['内科用药_department']}, 'normal', '非甾体抗炎药，用于缓解轻至中度疼痛'),
      ('D003', '硝苯地平控释片', '拜新同', '30mg*7片', '片剂', '拜耳医药保健有限公司', '国药准字J20080091', '西药', '2024-01-01', '2026-12-31', 45.00, 38.00, ${categories['心血管药_pharmacological']}, ${categories['片剂_dosage']}, ${categories['内科用药_department']}, 'normal', '钙通道阻滞剂，用于高血压和心绞痛'),
      ('D004', '奥美拉唑肠溶胶囊', '洛赛克', '20mg*14粒', '胶囊剂', '阿斯利康制药有限公司', '国药准字H20046379', '西药', '2024-01-01', '2026-12-31', 35.00, 30.00, ${categories['消化系统药_pharmacological']}, ${categories['片剂_dosage']}, ${categories['内科用药_department']}, 'normal', '质子泵抑制剂，用于胃溃疡和反流性食管炎'),
      ('D005', '小儿氨酚黄那敏颗粒', '护彤', '2g*10袋', '颗粒剂', '葵花药业集团股份有限公司', '国药准字H20056687', '西药', '2024-01-01', '2026-12-31', 12.00, 10.00, ${categories['解热镇痛药_pharmacological']}, ${categories['口服液_dosage']}, ${categories['儿科用药_department']}, 'normal', '儿童感冒用药，用于缓解感冒症状'),
      ('D006', '小儿止咳糖浆', '小儿止咳糖浆', '100ml', '糖浆剂', '华润三九医药股份有限公司', '国药准字Z20053123', '中成药', '2024-01-01', '2026-12-31', 28.00, 24.00, ${categories['解热镇痛药_pharmacological']}, ${categories['口服液_dosage']}, ${categories['儿科用药_department']}, 'normal', '中成药，用于小儿咳嗽')
    `)

    await queryRunner.query(`
      INSERT INTO \`doctors\` (\`doctorCode\`, \`name\`, \`gender\`, \`title\`, \`practiceType\`, \`practiceScope\`, \`departmentId\`, \`phone\`, \`email\`, \`status\`) VALUES
      ('DOC001', '张医生', '男', '主任医师', '临床', '内科常见病诊疗', ${departments['D001']}, '13800138001', 'zhang@hospital.com', 'active'),
      ('DOC002', '李医生', '女', '副主任医师', '临床', '外科常见病诊疗', ${departments['D002']}, '13800138002', 'li@hospital.com', 'active'),
      ('DOC003', '王医生', '男', '主治医师', '临床', '儿科常见病诊疗', ${departments['D003']}, '13800138003', 'wang@hospital.com', 'active'),
      ('DOC004', '赵医生', '女', '主任医师', '临床', '内科常见病诊疗', ${departments['D004']}, '13800138004', 'zhao@hospital.com', 'active'),
      ('DOC005', '陈医生', '男', '副主任医师', '临床', '外科常见病诊疗', ${departments['D005']}, '13800138005', 'chen@hospital.com', 'active')
    `)

    await queryRunner.query(`
      INSERT INTO \`patients\` (\`medicalRecordNumber\`, \`name\`, \`gender\`, \`age\`, \`idCard\`, \`phone\`, \`height\`, \`weight\`, \`bloodType\`, \`medicalHistory\`, \`currentDiagnosis\`) VALUES
      ('P001', '张三', '男', 35, '110101198901011234', '13900139001', 175.5, 70.0, 'A型', '高血压病史', '高血压'),
      ('P002', '李四', '女', 28, '110101199502021234', '13900139002', 162.0, 52.0, 'B型', '无', '上呼吸道感染'),
      ('P003', '王五', '男', 42, '110101198103031234', '13900139003', 170.0, 75.0, 'O型', '糖尿病病史', '2型糖尿病'),
      ('P004', '赵六', '女', 55, '110101196904041234', '13900139004', 158.0, 60.0, 'AB型', '冠心病病史', '冠心病'),
      ('P005', '小明', '男', 8, '110101201605051234', '13900139005', 125.0, 25.0, 'A型', '无', '急性支气管炎')
    `)

    await queryRunner.query(`
      INSERT INTO \`sys_config\` (\`key\`, \`name\`, \`value\`, \`remark\`) VALUES
      ('prescription_validity_days', '处方有效期（天）', '7', '电子处方的有效期'),
      ('inventory_warning_days', '库存预警天数', '90', '药品效期预警天数'),
      ('login_failed_limit', '登录失败次数限制', '5', '连续登录失败次数限制'),
      ('account_locked_minutes', '账号锁定分钟数', '30', '登录失败后账号锁定时间'),
      ('jwt_expiration_hours', 'JWT有效期（小时）', '24', 'JWT令牌的有效期'),
      ('data_backup_time', '数据备份时间', '02:00', '每日自动备份数据的时间')
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM \`sys_config\` WHERE \`key\` IN ('prescription_validity_days', 'inventory_warning_days', 'login_failed_limit', 'account_locked_minutes', 'jwt_expiration_hours', 'data_backup_time')`,
    )
    await queryRunner.query(
      `DELETE FROM \`patients\` WHERE \`medicalRecordNumber\` IN ('P001', 'P002', 'P003', 'P004', 'P005')`,
    )
    await queryRunner.query(
      `DELETE FROM \`doctors\` WHERE \`doctorCode\` IN ('DOC001', 'DOC002', 'DOC003', 'DOC004', 'DOC005')`,
    )
    await queryRunner.query(
      `DELETE FROM \`drugs\` WHERE \`drugCode\` IN ('D001', 'D002', 'D003', 'D004', 'D005', 'D006')`,
    )
    await queryRunner.query(
      `DELETE FROM \`drug_categories\` WHERE \`name\` IN ('抗生素', '解热镇痛药', '心血管药', '消化系统药', '片剂', '注射剂', '口服液', '内科用药', '外科用药', '儿科用药')`,
    )
    await queryRunner.query(
      `DELETE FROM \`pharmacies\` WHERE \`pharmacyCode\` IN ('P001', 'P002', 'P003', 'P004', 'P005')`,
    )
    await queryRunner.query(
      `DELETE FROM \`departments\` WHERE \`departmentCode\` IN ('D001', 'D002', 'D003', 'D004', 'D005', 'D006', 'D007')`,
    )
    await queryRunner.query(
      `DELETE FROM \`hospitals\` WHERE \`hospitalCode\` IN ('H001', 'H002', 'H003')`,
    )
  }
}
