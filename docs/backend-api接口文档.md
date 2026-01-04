# 医院药品管理系统 - Backend API接口文档

## 1. 文档概述

### 1.1 文档目的
本API接口文档详细描述医院药品管理系统后端的API设计，包括接口路径、HTTP方法、功能描述、请求参数、响应格式、错误码等内容，为前端开发、测试和集成提供详细的接口依据。

### 1.2 API设计原则

1. **RESTful API设计**：采用RESTful风格设计API，使用HTTP方法表示不同操作
2. **统一API版本**：所有API均包含版本号，如`/api/v1/drugs`
3. **统一响应格式**：所有API返回统一的响应格式，包含状态码、消息和数据
4. **错误处理**：使用HTTP状态码表示错误类型，返回详细的错误信息
5. **分页规范**：列表查询接口支持分页参数（page、pageSize），默认page=1，pageSize=20
6. **排序规范**：支持按字段排序，如`sort=created_at&order=desc`
7. **过滤规范**：支持按字段过滤，如`filter=status:eq:normal`

### 1.3 响应格式规范

```json
{
  "code": 200,
  "message": "成功",
  "data": {
    // 响应数据
  },
  "timestamp": 1640995200000,
  "requestId": "uuid-1234567890"
}
```

### 1.4 错误码规范

| 错误码 | 描述 | HTTP状态码 |
| ---- | ---- | ---- |
| 200 | 成功 | 200 |
| 400 | 请求参数错误 | 400 |
| 401 | 未授权 | 401 |
| 403 | 禁止访问 | 403 |
| 404 | 资源不存在 | 404 |
| 500 | 服务器内部错误 | 500 |
| 501 | 服务未实现 | 501 |
| 502 | 网关错误 | 502 |
| 503 | 服务不可用 | 503 |
| 504 | 网关超时 | 504 |

## 2. 身份认证与授权

### 2.1 登录

**API路径**：`/api/v1/auth/login`
**HTTP方法**：POST
**功能描述**：用户登录，获取访问令牌
**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| username | string | 是 | 用户名 |
| password | string | 是 | 密码 |
| captcha | string | 是 | 验证码 |
| captchaKey | string | 是 | 验证码密钥 |

**响应数据**：

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 86400,
  "userInfo": {
    "userId": "uuid-1234567890",
    "username": "admin",
    "name": "系统管理员",
    "role": "admin",
    "department": "信息科"
  }
}
```

### 2.2 刷新令牌

**API路径**：`/api/v1/auth/refresh-token`
**HTTP方法**：POST
**功能描述**：使用刷新令牌获取新的访问令牌
**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| refreshToken | string | 是 | 刷新令牌 |

**响应数据**：

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 86400
}
```

### 2.3 登出

**API路径**：`/api/v1/auth/logout`
**HTTP方法**：POST
**功能描述**：用户登出，销毁令牌
**请求参数**：无

**响应数据**：

```json
{
  "success": true
}
```

## 3. 字典管理模块

### 3.1 字典类型管理

#### 3.1.1 查询字典类型列表

**API路径**：`/api/v1/dict-types`
**HTTP方法**：GET
**功能描述**：查询字典类型列表，支持分页、排序、过滤
**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| page | number | 否 | 页码，默认1 |
| pageSize | number | 否 | 每页条数，默认20 |
| sort | string | 否 | 排序字段，默认created_at |
| order | string | 否 | 排序方向，asc或desc，默认desc |
| filter | string | 否 | 过滤条件，如`status:eq:active` |

**响应数据**：

```json
{
  "total": 10,
  "page": 1,
  "pageSize": 20,
  "list": [
    {
      "dictTypeId": "uuid-1234567890",
      "dictTypeCode": "drug_type",
      "dictTypeName": "药品类型",
      "description": "药品的类型分类",
      "status": "active",
      "sortOrder": 0,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z",
      "createdBy": "uuid-1234567890",
      "updatedBy": "uuid-1234567890"
    }
  ]
}
```

#### 3.1.2 创建字典类型

**API路径**：`/api/v1/dict-types`
**HTTP方法**：POST
**功能描述**：创建新的字典类型
**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| dictTypeCode | string | 是 | 字典类型编码 |
| dictTypeName | string | 是 | 字典类型名称 |
| description | string | 否 | 字典类型描述 |
| status | string | 否 | 状态，active或inactive，默认active |
| sortOrder | number | 否 | 排序顺序，默认0 |

**响应数据**：

```json
{
  "dictTypeId": "uuid-1234567890",
  "dictTypeCode": "drug_type",
  "dictTypeName": "药品类型",
  "description": "药品的类型分类",
  "status": "active",
  "sortOrder": 0,
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z",
  "createdBy": "uuid-1234567890",
  "updatedBy": "uuid-1234567890"
}
```

#### 3.1.3 查询字典类型详情

**API路径**：`/api/v1/dict-types/:dictTypeId`
**HTTP方法**：GET
**功能描述**：查询字典类型详情
**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| dictTypeId | string | 是 | 字典类型ID |

**响应数据**：

```json
{
  "dictTypeId": "uuid-1234567890",
  "dictTypeCode": "drug_type",
  "dictTypeName": "药品类型",
  "description": "药品的类型分类",
  "status": "active",
  "sortOrder": 0,
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z",
  "createdBy": "uuid-1234567890",
  "updatedBy": "uuid-1234567890"
}
```

#### 3.1.4 更新字典类型

**API路径**：`/api/v1/dict-types/:dictTypeId`
**HTTP方法**：PUT
**功能描述**：更新字典类型信息
**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| dictTypeId | string | 是 | 字典类型ID |
| dictTypeName | string | 否 | 字典类型名称 |
| description | string | 否 | 字典类型描述 |
| status | string | 否 | 状态，active或inactive |
| sortOrder | number | 否 | 排序顺序 |

**响应数据**：

```json
{
  "dictTypeId": "uuid-1234567890",
  "dictTypeCode": "drug_type",
  "dictTypeName": "药品类型",
  "description": "药品的类型分类",
  "status": "active",
  "sortOrder": 0,
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-02T00:00:00.000Z",
  "createdBy": "uuid-1234567890",
  "updatedBy": "uuid-1234567890"
}
```

#### 3.1.5 删除字典类型

**API路径**：`/api/v1/dict-types/:dictTypeId`
**HTTP方法**：DELETE
**功能描述**：删除字典类型
**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| dictTypeId | string | 是 | 字典类型ID |

**响应数据**：

```json
{
  "success": true
}
```

### 3.2 字典项管理

#### 3.2.1 查询字典项列表

**API路径**：`/api/v1/dict-items`
**HTTP方法**：GET
**功能描述**：查询字典项列表，支持分页、排序、过滤
**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| page | number | 否 | 页码，默认1 |
| pageSize | number | 否 | 每页条数，默认20 |
| sort | string | 否 | 排序字段，默认sortOrder |
| order | string | 否 | 排序方向，asc或desc，默认asc |
| filter | string | 否 | 过滤条件，如`dictTypeId:eq:uuid-1234567890&status:eq:active` |

**响应数据**：

```json
{
  "total": 20,
  "page": 1,
  "pageSize": 20,
  "list": [
    {
      "dictItemId": "uuid-1234567890",
      "dictTypeId": "uuid-1234567890",
      "dictItemCode": "chinese_medicine",
      "dictItemName": "中药",
      "dictItemValue": "chinese_medicine",
      "description": "中药药品",
      "status": "active",
      "sortOrder": 0,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z",
      "createdBy": "uuid-1234567890",
      "updatedBy": "uuid-1234567890"
    }
  ]
}
```

#### 3.2.2 按字典类型查询字典项

**API路径**：`/api/v1/dict-items/by-type/:dictTypeCode`
**HTTP方法**：GET
**功能描述**：按字典类型编码查询字典项列表
**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| dictTypeCode | string | 是 | 字典类型编码 |

**响应数据**：

```json
[
  {
    "dictItemId": "uuid-1234567890",
    "dictTypeId": "uuid-1234567890",
    "dictItemCode": "chinese_medicine",
    "dictItemName": "中药",
    "dictItemValue": "chinese_medicine",
    "description": "中药药品",
    "status": "active",
    "sortOrder": 0,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
]
```

#### 3.2.3 创建字典项

**API路径**：`/api/v1/dict-items`
**HTTP方法**：POST
**功能描述**：创建新的字典项
**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| dictTypeId | string | 是 | 字典类型ID |
| dictItemCode | string | 是 | 字典项编码 |
| dictItemName | string | 是 | 字典项名称 |
| dictItemValue | string | 否 | 字典项值 |
| description | string | 否 | 字典项描述 |
| status | string | 否 | 状态，active或inactive，默认active |
| sortOrder | number | 否 | 排序顺序，默认0 |

**响应数据**：

```json
{
  "dictItemId": "uuid-1234567890",
  "dictTypeId": "uuid-1234567890",
  "dictItemCode": "chinese_medicine",
  "dictItemName": "中药",
  "dictItemValue": "chinese_medicine",
  "description": "中药药品",
  "status": "active",
  "sortOrder": 0,
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z",
  "createdBy": "uuid-1234567890",
  "updatedBy": "uuid-1234567890"
}
```

#### 3.2.4 查询字典项详情

**API路径**：`/api/v1/dict-items/:dictItemId`
**HTTP方法**：GET
**功能描述**：查询字典项详情
**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| dictItemId | string | 是 | 字典项ID |

**响应数据**：

```json
{
  "dictItemId": "uuid-1234567890",
  "dictTypeId": "uuid-1234567890",
  "dictItemCode": "chinese_medicine",
  "dictItemName": "中药",
  "dictItemValue": "chinese_medicine",
  "description": "中药药品",
  "status": "active",
  "sortOrder": 0,
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z",
  "createdBy": "uuid-1234567890",
  "updatedBy": "uuid-1234567890"
}
```

#### 3.2.5 更新字典项

**API路径**：`/api/v1/dict-items/:dictItemId`
**HTTP方法**：PUT
**功能描述**：更新字典项信息
**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| dictItemId | string | 是 | 字典项ID |
| dictItemName | string | 否 | 字典项名称 |
| dictItemValue | string | 否 | 字典项值 |
| description | string | 否 | 字典项描述 |
| status | string | 否 | 状态，active或inactive |
| sortOrder | number | 否 | 排序顺序 |

**响应数据**：

```json
{
  "dictItemId": "uuid-1234567890",
  "dictTypeId": "uuid-1234567890",
  "dictItemCode": "chinese_medicine",
  "dictItemName": "中药",
  "dictItemValue": "chinese_medicine",
  "description": "中药药品",
  "status": "active",
  "sortOrder": 0,
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-02T00:00:00.000Z",
  "createdBy": "uuid-1234567890",
  "updatedBy": "uuid-1234567890"
}
```

#### 3.2.6 删除字典项

**API路径**：`/api/v1/dict-items/:dictItemId`
**HTTP方法**：DELETE
**功能描述**：删除字典项
**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| dictItemId | string | 是 | 字典项ID |

**响应数据**：

```json
{
  "success": true
}
```

## 4. 药品管理模块

### 4.1 药品信息管理

#### 4.1.1 查询药品列表

**API路径**：`/api/v1/drugs`
**HTTP方法**：GET
**功能描述**：查询药品列表，支持分页、排序、过滤
**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| page | number | 否 | 页码，默认1 |
| pageSize | number | 否 | 每页条数，默认20 |
| sort | string | 否 | 排序字段，默认created_at |
| order | string | 否 | 排序方向，asc或desc，默认desc |
| filter | string | 否 | 过滤条件，如`drugType:eq:chinese_medicine&status:eq:normal` |
| keyword | string | 否 | 搜索关键词，支持药品名称、编码、生产厂家等 |

**响应数据**：

```json
{
  "total": 100,
  "page": 1,
  "pageSize": 20,
  "list": [
    {
      "drugId": "uuid-1234567890",
      "drugCode": "DRUG00001",
      "genericName": "阿莫西林胶囊",
      "tradeName": "阿莫仙",
      "specification": "0.25g*24粒",
      "dosageForm": "胶囊剂",
      "manufacturer": "珠海联邦制药股份有限公司",
      "approvalNumber": "国药准字H44021351",
      "drugType": "western_medicine",
      "usePurpose": "抗感染",
      "usageMethod": "口服",
      "validFrom": "2023-01-01",
      "validTo": "2025-12-31",
      "retailPrice": 25.00,
      "wholesalePrice": 20.00,
      "medicalInsuranceRate": 0.8,
      "pharmacologicalClassId": "uuid-1234567890",
      "dosageClassId": "uuid-1234567890",
      "departmentClassId": "uuid-1234567890",
      "status": "normal",
      "description": "用于敏感菌所致的感染",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z",
      "createdBy": "uuid-1234567890",
      "updatedBy": "uuid-1234567890"
    }
  ]
}
```

#### 4.1.2 创建药品

**API路径**：`/api/v1/drugs`
**HTTP方法**：POST
**功能描述**：创建新的药品信息
**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| genericName | string | 是 | 通用名 |
| tradeName | string | 否 | 商品名 |
| specification | string | 是 | 规格 |
| dosageForm | string | 是 | 剂型 |
| manufacturer | string | 是 | 生产厂家 |
| approvalNumber | string | 是 | 批准文号 |
| drugType | string | 是 | 药品类型（中药|西药|中成药） |
| usePurpose | string | 否 | 药品用途 |
| usageMethod | string | 否 | 使用方式 |
| validFrom | string | 是 | 有效期起始日期，格式YYYY-MM-DD |
| validTo | string | 是 | 有效期截止日期，格式YYYY-MM-DD |
| retailPrice | number | 是 | 零售价 |
| wholesalePrice | number | 是 | 批发价 |
| medicalInsuranceRate | number | 否 | 医保报销比例 |
| pharmacologicalClassId | string | 否 | 药理分类ID |
| dosageClassId | string | 否 | 剂型分类ID |
| departmentClassId | string | 否 | 科室分类ID |
| description | string | 否 | 药品描述 |

**响应数据**：

```json
{
  "drugId": "uuid-1234567890",
  "drugCode": "DRUG00001",
  "genericName": "阿莫西林胶囊",
  "tradeName": "阿莫仙",
  "specification": "0.25g*24粒",
  "dosageForm": "胶囊剂",
  "manufacturer": "珠海联邦制药股份有限公司",
  "approvalNumber": "国药准字H44021351",
  "drugType": "western_medicine",
  "usePurpose": "抗感染",
  "usageMethod": "口服",
  "validFrom": "2023-01-01",
  "validTo": "2025-12-31",
  "retailPrice": 25.00,
  "wholesalePrice": 20.00,
  "medicalInsuranceRate": 0.8,
  "pharmacologicalClassId": "uuid-1234567890",
  "dosageClassId": "uuid-1234567890",
  "departmentClassId": "uuid-1234567890",
  "status": "normal",
  "description": "用于敏感菌所致的感染",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z",
  "createdBy": "uuid-1234567890",
  "updatedBy": "uuid-1234567890"
}
```

#### 4.1.3 查询药品详情

**API路径**：`/api/v1/drugs/:drugId`
**HTTP方法**：GET
**功能描述**：查询药品详情信息
**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| drugId | string | 是 | 药品ID |

**响应数据**：

```json
{
  "drugId": "uuid-1234567890",
  "drugCode": "DRUG00001",
  "genericName": "阿莫西林胶囊",
  "tradeName": "阿莫仙",
  "specification": "0.25g*24粒",
  "dosageForm": "胶囊剂",
  "manufacturer": "珠海联邦制药股份有限公司",
  "approvalNumber": "国药准字H44021351",
  "drugType": "western_medicine",
  "usePurpose": "抗感染",
  "usageMethod": "口服",
  "validFrom": "2023-01-01",
  "validTo": "2025-12-31",
  "retailPrice": 25.00,
  "wholesalePrice": 20.00,
  "medicalInsuranceRate": 0.8,
  "pharmacologicalClassId": "uuid-1234567890",
  "dosageClassId": "uuid-1234567890",
  "departmentClassId": "uuid-1234567890",
  "status": "normal",
  "description": "用于敏感菌所致的感染",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z",
  "createdBy": "uuid-1234567890",
  "updatedBy": "uuid-1234567890"
}
```

#### 4.1.4 更新药品

**API路径**：`/api/v1/drugs/:drugId`
**HTTP方法**：PUT
**功能描述**：更新药品信息
**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| drugId | string | 是 | 药品ID |
| genericName | string | 否 | 通用名 |
| tradeName | string | 否 | 商品名 |
| specification | string | 否 | 规格 |
| dosageForm | string | 否 | 剂型 |
| manufacturer | string | 否 | 生产厂家 |
| approvalNumber | string | 否 | 批准文号 |
| drugType | string | 否 | 药品类型（中药|西药|中成药） |
| usePurpose | string | 否 | 药品用途 |
| usageMethod | string | 否 | 使用方式 |
| validFrom | string | 否 | 有效期起始日期，格式YYYY-MM-DD |
| validTo | string | 否 | 有效期截止日期，格式YYYY-MM-DD |
| retailPrice | number | 否 | 零售价 |
| wholesalePrice | number | 否 | 批发价 |
| medicalInsuranceRate | number | 否 | 医保报销比例 |
| pharmacologicalClassId | string | 否 | 药理分类ID |
| dosageClassId | string | 否 | 剂型分类ID |
| departmentClassId | string | 否 | 科室分类ID |
| status | string | 否 | 状态（normal/stopped/out_of_stock） |
| description | string | 否 | 药品描述 |

**响应数据**：

```json
{
  "drugId": "uuid-1234567890",
  "drugCode": "DRUG00001",
  "genericName": "阿莫西林胶囊",
  "tradeName": "阿莫仙",
  "specification": "0.25g*24粒",
  "dosageForm": "胶囊剂",
  "manufacturer": "珠海联邦制药股份有限公司",
  "approvalNumber": "国药准字H44021351",
  "drugType": "western_medicine",
  "usePurpose": "抗感染",
  "usageMethod": "口服",
  "validFrom": "2023-01-01",
  "validTo": "2025-12-31",
  "retailPrice": 28.00,
  "wholesalePrice": 22.00,
  "medicalInsuranceRate": 0.8,
  "pharmacologicalClassId": "uuid-1234567890",
  "dosageClassId": "uuid-1234567890",
  "departmentClassId": "uuid-1234567890",
  "status": "normal",
  "description": "用于敏感菌所致的感染",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-02T00:00:00.000Z",
  "createdBy": "uuid-1234567890",
  "updatedBy": "uuid-1234567890"
}
```

#### 4.1.5 删除药品

**API路径**：`/api/v1/drugs/:drugId`
**HTTP方法**：DELETE
**功能描述**：删除药品信息
**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| drugId | string | 是 | 药品ID |

**响应数据**：

```json
{
  "success": true
}
```

#### 4.1.6 批量导入药品

**API路径**：`/api/v1/drugs/import`
**HTTP方法**：POST
**功能描述**：批量导入药品信息
**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| file | file | 是 | Excel文件 |

**响应数据**：

```json
{
  "successCount": 100,
  "failedCount": 5,
  "failedList": [
    {
      "row": 10,
      "error": "药品编码已存在"
    }
  ]
}
```

#### 4.1.7 批量导出药品

**API路径**：`/api/v1/drugs/export`
**HTTP方法**：GET
**功能描述**：批量导出药品信息
**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| filter | string | 否 | 过滤条件 |

**响应数据**：

```
Excel文件流
```

## 5. 药品库存管理模块

### 5.1 库存查询与管理

#### 5.1.1 查询库存列表

**API路径**：`/api/v1/inventory`
**HTTP方法**：GET
**功能描述**：查询库存列表，支持分页、排序、过滤
**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| page | number | 否 | 页码，默认1 |
| pageSize | number | 否 | 每页条数，默认20 |
| sort | string | 否 | 排序字段，默认created_at |
| order | string | 否 | 排序方向，asc或desc，默认desc |
| filter | string | 否 | 过滤条件，如`pharmacyId:eq:uuid-1234567890&drugType:eq:chinese_medicine` |
| keyword | string | 否 | 搜索关键词，支持药品名称、编码等 |

**响应数据**：

```json
{
  "total": 50,
  "page": 1,
  "pageSize": 20,
  "list": [
    {
      "inventoryId": "uuid-1234567890",
      "drugId": "uuid-1234567890",
      "pharmacyId": "uuid-1234567890",
      "batchNumber": "20230101001",
      "quantity": 1000,
      "minimumThreshold": 100,
      "maximumThreshold": 2000,
      "storageLocation": "A1区",
      "validFrom": "2023-01-01",
      "validTo": "2025-12-31",
      "isFrozen": false,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z",
      "updatedBy": "uuid-1234567890",
      "drug": {
        "drugCode": "DRUG00001",
        "genericName": "阿莫西林胶囊",
        "tradeName": "阿莫仙",
        "specification": "0.25g*24粒",
        "dosageForm": "胶囊剂",
        "manufacturer": "珠海联邦制药股份有限公司"
      },
      "pharmacy": {
        "pharmacyCode": "PHARMACY00001",
        "name": "西药房",
        "pharmacyType": "western_medicine"
      }
    }
  ]
}
```

#### 5.1.2 查询库存详情

**API路径**：`/api/v1/inventory/:inventoryId`
**HTTP方法**：GET
**功能描述**：查询库存详情信息
**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| inventoryId | string | 是 | 库存ID |

**响应数据**：

```json
{
  "inventoryId": "uuid-1234567890",
  "drugId": "uuid-1234567890",
  "pharmacyId": "uuid-1234567890",
  "batchNumber": "20230101001",
  "quantity": 1000,
  "minimumThreshold": 100,
  "maximumThreshold": 2000,
  "storageLocation": "A1区",
  "validFrom": "2023-01-01",
  "validTo": "2025-12-31",
  "isFrozen": false,
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z",
  "updatedBy": "uuid-1234567890",
  "drug": {
    "drugCode": "DRUG00001",
    "genericName": "阿莫西林胶囊",
    "tradeName": "阿莫仙",
    "specification": "0.25g*24粒",
    "dosageForm": "胶囊剂",
    "manufacturer": "珠海联邦制药股份有限公司",
    "drugType": "western_medicine"
  },
  "pharmacy": {
    "pharmacyCode": "PHARMACY00001",
    "name": "西药房",
    "pharmacyType": "western_medicine"
  }
}
```

### 5.2 出入库管理

#### 5.2.1 药品入库

**API路径**：`/api/v1/inventory/inbound`
**HTTP方法**：POST
**功能描述**：药品入库操作
**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| drugId | string | 是 | 药品ID |
| pharmacyId | string | 是 | 药房ID |
| batchNumber | string | 是 | 批次号 |
| quantity | number | 是 | 入库数量 |
| unitPrice | number | 是 | 单价 |
| storageLocation | string | 否 | 库存位置 |
| validFrom | string | 是 | 有效期起始日期，格式YYYY-MM-DD |
| validTo | string | 是 | 有效期截止日期，格式YYYY-MM-DD |
| reason | string | 否 | 入库原因 |

**响应数据**：

```json
{
  "transactionId": "uuid-1234567890",
  "drugId": "uuid-1234567890",
  "pharmacyId": "uuid-1234567890",
  "transactionType": "inbound",
  "quantity": 1000,
  "unitPrice": 20.00,
  "totalAmount": 20000.00,
  "batchNumber": "20230101001",
  "reason": "采购入库",
  "createdBy": "uuid-1234567890",
  "createdAt": "2023-01-01T00:00:00.000Z"
}
```

#### 5.2.2 药品出库

**API路径**：`/api/v1/inventory/outbound`
**HTTP方法**：POST
**功能描述**：药品出库操作
**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| drugId | string | 是 | 药品ID |
| pharmacyId | string | 是 | 药房ID |
| batchNumber | string | 是 | 批次号 |
| quantity | number | 是 | 出库数量 |
| unitPrice | number | 是 | 单价 |
| reason | string | 否 | 出库原因 |
| referenceId | string | 否 | 关联ID，如处方ID |

**响应数据**：

```json
{
  "transactionId": "uuid-1234567890",
  "drugId": "uuid-1234567890",
  "pharmacyId": "uuid-1234567890",
  "transactionType": "outbound",
  "quantity": 100,
  "unitPrice": 25.00,
  "totalAmount": 2500.00,
  "batchNumber": "20230101001",
  "reason": "处方出库",
  "referenceId": "uuid-1234567890",
  "createdBy": "uuid-1234567890",
  "createdAt": "2023-01-01T00:00:00.000Z"
}
```

#### 5.2.3 查询出入库记录

**API路径**：`/api/v1/inventory/transactions`
**HTTP方法**：GET
**功能描述**：查询出入库记录，支持分页、排序、过滤
**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| page | number | 否 | 页码，默认1 |
| pageSize | number | 否 | 每页条数，默认20 |
| sort | string | 否 | 排序字段，默认created_at |
| order | string | 否 | 排序方向，asc或desc，默认desc |
| filter | string | 否 | 过滤条件，如`transactionType:eq:inbound&pharmacyId:eq:uuid-1234567890` |

**响应数据**：

```json
{
  "total": 200,
  "page": 1,
  "pageSize": 20,
  "list": [
    {
      "transactionId": "uuid-1234567890",
      "drugId": "uuid-1234567890",
      "pharmacyId": "uuid-1234567890",
      "transactionType": "inbound",
      "quantity": 1000,
      "unitPrice": 20.00,
      "totalAmount": 20000.00,
      "batchNumber": "20230101001",
      "reason": "采购入库",
      "createdBy": "uuid-1234567890",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "drug": {
        "drugCode": "DRUG00001",
        "genericName": "阿莫西林胶囊",
        "tradeName": "阿莫仙"
      },
      "pharmacy": {
        "pharmacyCode": "PHARMACY00001",
        "name": "西药房"
      },
      "operator": {
        "doctorCode": "DOC00001",
        "name": "张三"
      }
    }
  ]
}
```

## 6. 医院管理模块

### 6.1 药房管理

#### 6.1.1 查询药房列表

**API路径**：`/api/v1/pharmacies`
**HTTP方法**：GET
**功能描述**：查询药房列表，支持分页、排序、过滤
**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| page | number | 否 | 页码，默认1 |
| pageSize | number | 否 | 每页条数，默认20 |
| sort | string | 否 | 排序字段，默认created_at |
| order | string | 否 | 排序方向，asc或desc，默认desc |
| filter | string | 否 | 过滤条件，如`pharmacyType:eq:chinese_medicine&hospitalId:eq:uuid-1234567890` |
| keyword | string | 否 | 搜索关键词，支持药房名称、编码等 |

**响应数据**：

```json
{
  "total": 10,
  "page": 1,
  "pageSize": 20,
  "list": [
    {
      "pharmacyId": "uuid-1234567890",
      "pharmacyCode": "PHARMACY00001",
      "name": "西药房",
      "hospitalId": "uuid-1234567890",
      "pharmacyType": "western_medicine",
      "departmentId": "uuid-1234567890",
      "floor": "1楼",
      "contactPerson": "李四",
      "phone": "13800138000",
      "description": "医院西药房",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

#### 6.1.2 创建药房

**API路径**：`/api/v1/pharmacies`
**HTTP方法**：POST
**功能描述**：创建新的药房
**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| pharmacyCode | string | 是 | 药房编码 |
| name | string | 是 | 药房名称 |
| hospitalId | string | 是 | 所属医院ID |
| pharmacyType | string | 是 | 药房类型（中药房|西药房） |
| departmentId | string | 是 | 负责科室ID |
| floor | string | 否 | 所在楼层 |
| contactPerson | string | 否 | 联系人 |
| phone | string | 否 | 联系电话 |
| description | string | 否 | 药房描述 |

**响应数据**：

```json
{
  "pharmacyId": "uuid-1234567890",
  "pharmacyCode": "PHARMACY00001",
  "name": "西药房",
  "hospitalId": "uuid-1234567890",
  "pharmacyType": "western_medicine",
  "departmentId": "uuid-1234567890",
  "floor": "1楼",
  "contactPerson": "李四",
  "phone": "13800138000",
  "description": "医院西药房",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

## 7. 医生管理模块

### 7.1 医生信息维护

#### 7.1.1 查询医生列表

**API路径**：`/api/v1/doctors`
**HTTP方法**：GET
**功能描述**：查询医生列表，支持分页、排序、过滤
**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| page | number | 否 | 页码，默认1 |
| pageSize | number | 否 | 每页条数，默认20 |
| sort | string | 否 | 排序字段，默认created_at |
| order | string | 否 | 排序方向，asc或desc，默认desc |
| filter | string | 否 | 过滤条件，如`departmentId:eq:uuid-1234567890&status:eq:active` |
| keyword | string | 否 | 搜索关键词，支持医生姓名、工号等 |

**响应数据**：

```json
{
  "total": 50,
  "page": 1,
  "pageSize": 20,
  "list": [
    {
      "doctorId": "uuid-1234567890",
      "doctorCode": "DOC00001",
      "name": "张三",
      "gender": "male",
      "title": "主治医师",
      "practiceType": "临床",
      "practiceScope": "内科",
      "departmentId": "uuid-1234567890",
      "phone": "13800138000",
      "email": "zhangsan@example.com",
      "avatar": "https://example.com/avatar.jpg",
      "signature": "https://example.com/signature.jpg",
      "status": "active",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

## 8. 处方管理模块

### 8.1 处方开具

#### 8.1.1 开具处方

**API路径**：`/api/v1/prescriptions`
**HTTP方法**：POST
**功能描述**：开具新的处方
**请求参数**：

```json
{
  "patientId": "uuid-1234567890",
  "departmentId": "uuid-1234567890",
  "diagnosis": "上呼吸道感染",
  "prescriptionDrugs": [
    {
      "drugId": "uuid-1234567890",
      "dosage": 0.5,
      "dosageUnit": "g",
      "frequency": "3次/日",
      "administrationRoute": "口服",
      "duration": 7,
      "quantity": 2,
      "unitPrice": 25.00
    }
  ]
}
```

**响应数据**：

```json
{
  "prescriptionId": "uuid-1234567890",
  "prescriptionNumber": "PRES2023010100001",
  "patientId": "uuid-1234567890",
  "doctorId": "uuid-1234567890",
  "departmentId": "uuid-1234567890",
  "diagnosis": "上呼吸道感染",
  "totalAmount": 50.00,
  "status": "pending_review",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z",
  "prescriptionDrugs": [
    {
      "id": "uuid-1234567890",
      "prescriptionId": "uuid-1234567890",
      "drugId": "uuid-1234567890",
      "dosage": 0.5,
      "dosageUnit": "g",
      "frequency": "3次/日",
      "administrationRoute": "口服",
      "duration": 7,
      "quantity": 2,
      "unitPrice": 25.00,
      "totalPrice": 50.00
    }
  ]
}
```

## 9. 病人管理模块

### 9.1 病人信息维护

#### 9.1.1 查询病人列表

**API路径**：`/api/v1/patients`
**HTTP方法**：GET
**功能描述**：查询病人列表，支持分页、排序、过滤
**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| page | number | 否 | 页码，默认1 |
| pageSize | number | 否 | 每页条数，默认20 |
| sort | string | 否 | 排序字段，默认created_at |
| order | string | 否 | 排序方向，asc或desc，默认desc |
| filter | string | 否 | 过滤条件，如`gender:eq:male&age:gt:18` |
| keyword | string | 否 | 搜索关键词，支持病人姓名、身份证号、病历号等 |

**响应数据**：

```json
{
  "total": 1000,
  "page": 1,
  "pageSize": 20,
  "list": [
    {
      "patientId": "uuid-1234567890",
      "medicalRecordNumber": "MRN2023010100001",
      "name": "王五",
      "gender": "male",
      "age": 30,
      "idCard": "110101199001011234",
      "phone": "13900139000",
      "height": 175.0,
      "weight": 70.0,
      "bloodType": "A",
      "medicalHistory": "无",
      "currentDiagnosis": "上呼吸道感染",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

## 10. 处方管理模块

### 10.1 处方查询与管理

#### 10.1.1 查询处方列表

**API路径**：`/api/v1/prescriptions`
**HTTP方法**：GET
**功能描述**：查询处方列表，支持分页、排序、过滤
**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| page | number | 否 | 页码，默认1 |
| pageSize | number | 否 | 每页条数，默认20 |
| sort | string | 否 | 排序字段，默认created_at |
| order | string | 否 | 排序方向，asc或desc，默认desc |
| filter | string | 否 | 过滤条件，如`status:eq:pending_review&doctorId:eq:uuid-1234567890` |
| keyword | string | 否 | 搜索关键词，支持处方单号、病人姓名等 |

**响应数据**：

```json
{
  "total": 500,
  "page": 1,
  "pageSize": 20,
  "list": [
    {
      "prescriptionId": "uuid-1234567890",
      "prescriptionNumber": "PRES2023010100001",
      "patientId": "uuid-1234567890",
      "doctorId": "uuid-1234567890",
      "departmentId": "uuid-1234567890",
      "diagnosis": "上呼吸道感染",
      "totalAmount": 50.00,
      "status": "pending_review",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z",
      "patient": {
        "name": "王五",
        "gender": "male",
        "age": 30,
        "medicalRecordNumber": "MRN2023010100001"
      },
      "doctor": {
        "name": "张三",
        "doctorCode": "DOC00001",
        "title": "主治医师"
      },
      "department": {
        "name": "内科"
      }
    }
  ]
}
```

## 11. 系统管理模块

### 11.1 操作日志管理

#### 11.1.1 查询操作日志

**API路径**：`/api/v1/operation-logs`
**HTTP方法**：GET
**功能描述**：查询操作日志，支持分页、排序、过滤
**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
| ---- | ---- | ---- | ---- |
| page | number | 否 | 页码，默认1 |
| pageSize | number | 否 | 每页条数，默认20 |
| sort | string | 否 | 排序字段，默认created_at |
| order | string | 否 | 排序方向，asc或desc，默认desc |
| filter | string | 否 | 过滤条件，如`module:eq:drugs&operationType:eq:create` |
| keyword | string | 否 | 搜索关键词，支持操作人员、操作内容等 |

**响应数据**：

```json
{
  "total": 10000,
  "page": 1,
  "pageSize": 20,
  "list": [
    {
      "logId": "uuid-1234567890",
      "userId": "uuid-1234567890",
      "userName": "张三",
      "operationType": "create",
      "module": "drugs",
      "operationContent": "创建药品信息",
      "oldData": null,
      "newData": "{\"drugName\":\"阿莫西林胶囊\"}",
      "ipAddress": "127.0.0.1",
      "userAgent": "Mozilla/5.0...",
      "status": "success",
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

## 12. 错误码表

| 错误码 | 描述 | HTTP状态码 | 解决方案 |
| ---- | ---- | ---- | ---- |
| 200 | 成功 | 200 | 操作成功 |
| 400 | 请求参数错误 | 400 | 检查请求参数是否符合要求 |
| 401 | 未授权 | 401 | 请重新登录或检查Token是否有效 |
| 403 | 禁止访问 | 403 | 没有操作权限，请联系管理员 |
| 404 | 资源不存在 | 404 | 检查请求URL或资源ID是否正确 |
| 500 | 服务器内部错误 | 500 | 服务器内部错误，请联系管理员 |
| 10001 | 用户名或密码错误 | 401 | 请检查用户名和密码是否正确 |
| 10002 | 验证码错误 | 400 | 请输入正确的验证码 |
| 10003 | 账号已锁定 | 401 | 账号已被锁定，请联系管理员 |
| 20001 | 药品编码已存在 | 400 | 请使用其他药品编码 |
| 20002 | 药品不存在 | 404 | 请检查药品ID是否正确 |
| 30001 | 库存不足 | 400 | 库存不足，无法出库 |
| 30002 | 批次号不存在 | 404 | 请检查批次号是否正确 |
| 40001 | 处方不存在 | 404 | 请检查处方ID是否正确 |
| 40002 | 处方已审核 | 400 | 处方已审核，无法修改 |
| 50001 | 字典类型已存在 | 400 | 请使用其他字典类型编码 |
| 50002 | 字典项已存在 | 400 | 请使用其他字典项编码 |
