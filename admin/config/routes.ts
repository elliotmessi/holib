const newRoutes = [
  {
    name: "医院管理",
    path: "/hospital",
    access: "hospital:hospital:list",
    icon: "home",
    routes: [
      {
        name: "医院列表",
        path: "list",
        component: "./Hospital/list",
        access: "hospital:hospital:list",
      },
      {
        name: "新建医院",
        path: "create",
        component: "./Hospital/create",
        access: "hospital:hospital:create",
      },
      {
        name: "编辑医院",
        path: "edit/:id",
        component: "./Hospital/edit",
        access: "hospital:hospital:update",
      },
      {
        name: "医院详情",
        path: "detail/:id",
        component: "./Hospital/detail",
        access: "hospital:hospital:detail",
      },
    ],
  },
  {
    name: "科室管理",
    path: "/department",
    access: "hospital:department:list",
    icon: "project",
    routes: [
      {
        name: "科室列表",
        path: "list",
        component: "./Department/list",
        access: "hospital:department:list",
      },
      {
        name: "新建科室",
        path: "create",
        component: "./Department/create",
        access: "hospital:department:create",
      },
      {
        name: "编辑科室",
        path: "edit/:id",
        component: "./Department/edit",
        access: "hospital:department:update",
      },
      {
        name: "科室详情",
        path: "detail/:id",
        component: "./Department/detail",
        access: "hospital:department:detail",
      },
    ],
  },
  {
    name: "用户管理",
    path: "/user",
    access: "system:user:list",
    icon: "user",
    routes: [
      {
        name: "用户列表",
        path: "list",
        component: "./User/list",
        access: "system:user:list",
      },
      {
        name: "新建用户",
        path: "create",
        component: "./User/create",
        access: "system:user:create",
      },
      {
        name: "编辑用户",
        path: "edit/:id",
        component: "./User/edit",
        access: "system:user:update",
      },
      {
        name: "用户详情",
        path: "detail/:id",
        component: "./User/detail",
        access: "system:user:detail",
      },
    ],
  },
  {
    name: "角色管理",
    path: "/role",
    access: "system:role:list",
    icon: "contacts",
    routes: [
      {
        name: "角色列表",
        path: "list",
        component: "./Role/list",
        access: "system:role:list",
      },
      {
        name: "新建角色",
        path: "create",
        component: "./Role/create",
        access: "system:role:create",
      },
      {
        name: "编辑角色",
        path: "edit/:id",
        component: "./Role/edit",
        access: "system:role:update",
      },
      {
        name: "角色详情",
        path: "detail/:id",
        component: "./Role/detail",
        access: "system:role:detail",
      },
    ],
  },
  {
    name: "医生管理",
    path: "/doctor",
    access: "hospital:doctor:list",
    icon: "UsergroupAddOutlined",
    routes: [
      {
        name: "医生列表",
        path: "list",
        component: "./Doctor/list",
        access: "hospital:doctor:list",
      },
      {
        name: "新建医生",
        path: "create",
        component: "./Doctor/create",
        access: "hospital:doctor:create",
      },
      {
        name: "编辑医生",
        path: "edit/:id",
        component: "./Doctor/edit",
        access: "hospital:doctor:update",
      },
      {
        name: "医生详情",
        path: "detail/:id",
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
        path: "list",
        component: "./Patient/list",
        access: "hospital:patient:list",
      },
      {
        name: "新建患者",
        path: "create",
        component: "./Patient/create",
        access: "hospital:patient:create",
      },
      {
        name: "编辑患者",
        path: "edit/:id",
        component: "./Patient/edit",
        access: "hospital:patient:update",
      },
      {
        name: "患者详情",
        path: "detail/:id",
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
        path: "list",
        component: "./Drug/list",
        access: "hospital:drug:list",
      },
      {
        name: "新建药品",
        path: "create",
        component: "./Drug/create",
        access: "hospital:drug:create",
      },
      {
        name: "编辑药品",
        path: "edit/:id",
        component: "./Drug/edit",
        access: "hospital:drug:update",
      },
      {
        name: "药品详情",
        path: "detail/:id",
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
        path: "list",
        component: "./Prescription/list",
        access: "hospital:prescription:list",
      },
      {
        name: "新建处方",
        path: "create",
        component: "./Prescription/create",
        access: "hospital:prescription:create",
      },
      {
        name: "编辑处方",
        path: "edit/:id",
        component: "./Prescription/edit",
        access: "hospital:prescription:update",
      },
      {
        name: "处方详情",
        path: "detail/:id",
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
        path: "list",
        component: "./Pharmacy/list",
        access: "hospital:pharmacy:list",
      },
      {
        name: "新建药房",
        path: "create",
        component: "./Pharmacy/create",
        access: "hospital:pharmacy:create",
      },
      {
        name: "编辑药房",
        path: "edit/:id",
        component: "./Pharmacy/edit",
        access: "hospital:pharmacy:update",
      },
      {
        name: "药房详情",
        path: "detail/:id",
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
        path: "list",
        component: "./Inventory/list",
        access: "hospital:inventory:list",
      },
      {
        name: "新建库存",
        path: "create",
        component: "./Inventory/create",
        access: "hospital:inventory:create",
      },
      {
        name: "编辑库存",
        path: "edit/:id",
        component: "./Inventory/edit",
        access: "hospital:inventory:update",
      },
      {
        name: "库存详情",
        path: "detail/:id",
        component: "./Inventory/detail",
        access: "hospital:inventory:detail",
      },
      {
        name: "入库管理",
        path: "inbound",
        component: "./Inventory/inbound",
        access: "hospital:inventory:inbound",
      },
      {
        name: "出库管理",
        path: "outbound",
        component: "./Inventory/outbound",
        access: "hospital:inventory:outbound",
      },
    ],
  },
  {
    name: "系统管理",
    path: "/system",
    icon: "setting",
    routes: [
      {
        name: "字典管理",
        path: "dict-type",
        access: "system:dict-type:list",
        icon: "book",
        routes: [
          {
            name: "字典列表",
            path: "list",
            component: "./System/DictType/list.tsx",
            access: "system:dict-type:list",
          },
          {
            name: "新建字典",
            path: "create",
            component: "./System/DictType/create.tsx",
            access: "system:dict-type:create",
          },
          {
            name: "编辑字典",
            path: "edit/:id",
            component: "./System/DictType/edit.tsx",
            access: "system:dict-type:update",
          },
          {
            name: "字典详情",
            path: "detail/:id",
            component: "./System/DictType/detail.tsx",
            access: "system:dict-type:detail",
          },
        ],
      },
      {
        name: "系统监控",
        path: "monitor",
        icon: "monitor",
        routes: [
          {
            name: "在线用户",
            path: "online",
            component: "./System/Monitor/Online",
            access: "system:online:list",
          },
          {
            name: "登录日志",
            path: "login-log",
            component: "./System/Monitor/LoginLog",
            access: "system:log:login:list",
          },
          {
            name: "服务监控",
            path: "serve",
            component: "./System/Monitor/Serve",
            access: "system:serve:stat",
          },
          {
            name: "健康检查",
            path: "health",
            component: "./System/Monitor/Health",
          },
        ],
      },
      {
        name: "任务调度",
        path: "schedule",
        icon: "ScheduleFilled",
        routes: [
          {
            name: "任务管理",
            path: "task",
            routes: [
              {
                name: "任务列表",
                path: "list",
                component: "./System/Schedule/Task/list.tsx",
                access: "system:task:list",
              },
              {
                name: "新建任务",
                path: "create",
                component: "./System/Schedule/Task/create.tsx",
                access: "system:task:create",
              },
              {
                name: "编辑任务",
                path: "edit/:id",
                component: "./System/Schedule/Task/edit.tsx",
                access: "system:task:update",
              },
              {
                name: "任务详情",
                path: "detail/:id",
                component: "./System/Schedule/Task/detail.tsx",
                access: "system:task:detail",
              },
              {
                name: "任务日志",
                path: "log",
                component: "./System/Schedule/Task/Log",
                access: "system:task:list",
              },
            ],
          },
        ],
      },
      {
        name: "参数配置",
        path: "param-config",
        access: "system:param-config:list",
        icon: "edit",
        routes: [
          {
            name: "参数列表",
            path: "list",
            component: "./System/ParamConfig/list.tsx",
            access: "system:param-config:list",
          },
          {
            name: "新建参数",
            path: "create",
            component: "./System/ParamConfig/create.tsx",
            access: "system:param-config:create",
          },
          {
            name: "编辑参数",
            path: "edit/:id",
            component: "./System/ParamConfig/edit.tsx",
            access: "system:param-config:update",
          },
          {
            name: "参数详情",
            path: "detail/:id",
            component: "./System/ParamConfig/detail.tsx",
            access: "system:param-config:detail",
          },
        ],
      },
      {
        name: "字典项管理",
        path: "dict-item",
        access: "system:dict-item:list",
        routes: [
          {
            name: "字典项列表",
            path: "list",
            component: "./System/DictItem/list.tsx",
            access: "system:dict-item:list",
          },
          {
            name: "新建字典项",
            path: "create",
            component: "./System/DictItem/create.tsx",
            access: "system:dict-item:create",
          },
          {
            name: "编辑字典项",
            path: "edit/:id",
            component: "./System/DictItem/edit.tsx",
            access: "system:dict-item:update",
          },
          {
            name: "字典项详情",
            path: "detail/:id",
            component: "./System/DictItem/detail.tsx",
            access: "system:dict-item:detail",
          },
        ],
      },
      {
        name: "邮件工具",
        path: "email",
        access: "system:tools:email",
        icon: "send",
        routes: [
          {
            name: "邮件配置",
            path: "config",
            component: "./System/Email/config.tsx",
            access: "system:tools:email",
          },
          {
            name: "发送邮件",
            path: "send",
            component: "./System/Email/send.tsx",
            access: "system:tools:email",
          },
        ],
      },
      {
        name: "存储管理",
        path: "storage",
        access: "tool:storage:list",
        icon: "appstore",
        routes: [
          {
            name: "存储列表",
            path: "list",
            component: "./System/Storage/list.tsx",
            access: "tool:storage:list",
          },
          {
            name: "新建存储",
            path: "create",
            component: "./System/Storage/create.tsx",
            access: "tool:storage:create",
          },
          {
            name: "编辑存储",
            path: "edit/:id",
            component: "./System/Storage/edit.tsx",
            access: "tool:storage:update",
          },
          {
            name: "存储详情",
            path: "detail/:id",
            component: "./System/Storage/detail.tsx",
            access: "tool:storage:detail",
          },
        ],
      },
    ],
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
