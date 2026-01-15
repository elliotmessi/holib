const newRoutes = [
  {
    name: "医院管理",
    path: "/hospital",
    component: "./Hospital",
    access: "hospital:hospital:list",
    icon: "home",
  },
  {
    name: "科室管理",
    path: "/department",
    component: "./Department",
    access: "hospital:department:list",
    icon: "project",
  },
  {
    name: "用户管理",
    path: "/user",
    component: "./User",
    access: "system:user:list",
    icon: "user",
  },
  {
    name: "角色管理",
    path: "/role",
    component: "./Role",
    access: "system:role:list",
    icon: "contacts",
  },
  {
    name: "医生管理",
    path: "/doctor",
    access: "hospital:doctor:list",
    icon: "UsergroupAddOutlined",
    routes: [
      {
        name: "医生列表",
        path: "/doctor",
        component: "./Doctor/list",
        access: "hospital:doctor:list",
      },
      {
        name: "新建医生",
        path: "/doctor/create",
        component: "./Doctor/create",
        access: "hospital:doctor:create",
      },
      {
        name: "编辑医生",
        path: "/doctor/edit/:id",
        component: "./Doctor/edit",
        access: "hospital:doctor:update",
      },
      {
        name: "医生详情",
        path: "/doctor/detail/:id",
        component: "./Doctor/detail",
        access: "hospital:doctor:detail",
      },
    ],
  },
  {
    name: "患者管理",
    path: "/patient",
    access: "hospital:patient:list",
    icon: "idcardOutlined",
    routes: [
      {
        name: "患者列表",
        path: "/patient",
        component: "./Patient/list",
        access: "hospital:patient:list",
      },
      {
        name: "新建患者",
        path: "/patient/create",
        component: "./Patient/create",
        access: "hospital:patient:create",
      },
      {
        name: "编辑患者",
        path: "/patient/edit/:id",
        component: "./Patient/edit",
        access: "hospital:patient:update",
      },
      {
        name: "患者详情",
        path: "/patient/detail/:id",
        component: "./Patient/detail",
        access: "hospital:patient:detail",
      },
    ],
  },

  {
    name: "药品管理",
    path: "/drug",
    access: "hospital:drug:list",
    icon: "MedicineBoxOutlined",
    routes: [
      {
        name: "药品列表",
        path: "/drug",
        component: "./Drug/list",
        access: "hospital:drug:list",
      },
      {
        name: "新建药品",
        path: "/drug/create",
        component: "./Drug/create",
        access: "hospital:drug:create",
      },
      {
        name: "编辑药品",
        path: "/drug/edit/:id",
        component: "./Drug/edit",
        access: "hospital:drug:update",
      },
      {
        name: "药品详情",
        path: "/drug/detail/:id",
        component: "./Drug/detail",
        access: "hospital:drug:detail",
      },
    ],
  },
  {
    name: "处方管理",
    path: "/prescription",
    access: "hospital:prescription:list",
    icon: "FileTextOutlined",
    routes: [
      {
        name: "处方列表",
        path: "/prescription",
        component: "./Prescription/list",
        access: "hospital:prescription:list",
      },
      {
        name: "新建处方",
        path: "/prescription/create",
        component: "./Prescription/create",
        access: "hospital:prescription:create",
      },
      {
        name: "编辑处方",
        path: "/prescription/edit/:id",
        component: "./Prescription/edit",
        access: "hospital:prescription:update",
      },
      {
        name: "处方详情",
        path: "/prescription/detail/:id",
        component: "./Prescription/detail",
        access: "hospital:prescription:detail",
      },
    ],
  },
  {
    name: "药房管理",
    path: "/pharmacy",
    access: "hospital:pharmacy:list",
    icon: "shop",
    routes: [
      {
        name: "药房列表",
        path: "/pharmacy",
        component: "./Pharmacy/list",
        access: "hospital:pharmacy:list",
      },
      {
        name: "新建药房",
        path: "/pharmacy/create",
        component: "./Pharmacy/create",
        access: "hospital:pharmacy:create",
      },
      {
        name: "编辑药房",
        path: "/pharmacy/edit/:id",
        component: "./Pharmacy/edit",
        access: "hospital:pharmacy:update",
      },
      {
        name: "药房详情",
        path: "/pharmacy/detail/:id",
        component: "./Pharmacy/detail",
        access: "hospital:pharmacy:detail",
      },
    ],
  },
  {
    name: "库存管理",
    path: "/inventory",
    access: "hospital:inventory:list",
    icon: "database",
    routes: [
      {
        name: "库存列表",
        path: "/inventory",
        component: "./Inventory/list",
        access: "hospital:inventory:list",
      },
      {
        name: "新建库存",
        path: "/inventory/create",
        component: "./Inventory/create",
        access: "hospital:inventory:create",
      },
      {
        name: "编辑库存",
        path: "/inventory/edit/:id",
        component: "./Inventory/edit",
        access: "hospital:inventory:update",
      },
      {
        name: "库存详情",
        path: "/inventory/detail/:id",
        component: "./Inventory/detail",
        access: "hospital:inventory:detail",
      },
      {
        name: "入库管理",
        path: "/inventory/inbound",
        component: "./Inventory/inbound",
        access: "hospital:inventory:inbound",
      },
      {
        name: "出库管理",
        path: "/inventory/outbound",
        component: "./Inventory/outbound",
        access: "hospital:inventory:outbound",
      },
    ],
  },
  {
    name: "系统管理",
    path: "/system",
    routes: [
      {
        name: "字典管理",
        path: "/system/dict-type",
        component: "./System/DictType",
        access: "system:dict-type:list",
        icon: "book",
      },
      {
        name: "系统监控",
        path: "/system/monitor",
        routes: [
          {
            name: "在线用户",
            path: "/system/monitor/online",
            component: "./System/Monitor/Online",
            access: "system:online:list",
          },
          {
            name: "登录日志",
            path: "/system/monitor/login-log",
            component: "./System/Monitor/LoginLog",
            access: "system:log:login:list",
          },
          {
            name: "服务监控",
            path: "/system/monitor/serve",
            component: "./System/Monitor/Serve",
            access: "system:serve:stat",
          },
          {
            name: "健康检查",
            path: "/system/monitor/health",
            component: "./System/Monitor/Health",
          },
        ],
        component: "./System",
        icon: "monitor",
      },
      {
        name: "任务调度",
        path: "/system/schedule",
        routes: [
          {
            name: "任务管理",
            path: "/system/schedule/task",
            component: "./System/Schedule/Task",
          },
          {
            name: "任务日志",
            path: "/system/schedule/task/log",
            component: "./System/Schedule/Task/Log",
            access: "system:task:list",
          },
        ],
        component: "./System",
        icon: "ScheduleFilled",
      },
      {
        name: "参数配置",
        path: "/system/param-config",
        component: "./System/ParamConfig",
        access: "system:param-config:list",
        icon: "edit",
      },
      {
        name: "字典项管理",
        path: "/system/dict-item",
        component: "./System/DictItem",
        access: "system:dict-item:list",
      },
      {
        name: "邮件工具",
        path: "/system/email",
        component: "./System/Email",
        access: "system:tools:email",
        icon: "send",
      },
      {
        name: "存储管理",
        path: "/system/storage",
        component: "./System/Storage",
        access: "tool:storage:list",
        icon: "appstore",
      },
    ],
    component: "./System",
    icon: "setting",
  },
  {
    name: "关于",
    path: "/about",
    component: "./About",
    icon: "InfoCircle",
  },
]

const routes = [
  {
    path: "/",
    redirect: "/home",
    access: "canAccess", // 需要认证的路由
  },
  {
    name: "首页",
    path: "/home",
    component: "./Home",
    access: "canAccess", // 需要认证的路由
    icon: "home",
  },
  ...newRoutes,
  {
    name: "权限演示",
    path: "/access",
    component: "./Access",
    access: "canAccess", // 需要认证的路由
    icon: "security-scan",
  },
  {
    name: "CRUD 示例",
    path: "/table",
    component: "./Table",
    access: "canAccess", // 需要认证的路由
    icon: "table",
  },
  // 认证相关路由
  {
    path: "/login",
    component: "./Login",
    layout: false, // 不使用全局布局
  },
  {
    path: "/register",
    component: "./Register",
    layout: false, // 不使用全局布局
  },
  // 404 路由
  {
    path: "*",
    component: "./404",
    layout: false,
  },
]

export default routes
