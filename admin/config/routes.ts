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
    component: "./Doctor",
    access: "hospital:doctor:list",
    icon: "UsergroupAddOutlined",
  },
  {
    name: "患者管理",
    path: "/patient",
    component: "./Patient",
    access: "hospital:patient:list",
    icon: "idcardOutlined",
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
    component: "./Prescription",
    access: "hospital:prescription:list",
    icon: "FileTextOutlined",
  },
  {
    name: "药房管理",
    path: "/pharmacy",
    component: "./Pharmacy",
    access: "hospital:pharmacy:list",
    icon: "shop",
  },
  {
    name: "库存管理",
    path: "/inventory",
    component: "./Inventory",
    access: "hospital:inventory:list",
    icon: "database",
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
