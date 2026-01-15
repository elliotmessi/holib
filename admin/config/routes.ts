const newRoutes = [
  {
    name: "医院管理",
    path: "/hospital",
    component: "./Home",
    access: "hospital:hospital:list",
    icon: "home",
  },
  {
    name: "科室管理",
    path: "/department",
    component: "./Home",
    access: "hospital:department:list",
    icon: "project",
  },
  {
    name: "用户管理",
    path: "/user",
    component: "./Home",
    access: "system:user:list",
    icon: "user",
  },
  {
    name: "角色管理",
    path: "/role",
    component: "./Home",
    access: "system:role:list",
    icon: "contacts",
  },
  {
    name: "医生管理",
    path: "/doctor",
    component: "./Home",
    access: "hospital:doctor:list",
    icon: "UsergroupAddOutlined",
  },
  {
    name: "患者管理",
    path: "/patient",
    component: "./Home",
    access: "hospital:patient:list",
    icon: "idcardOutlined",
  },

  {
    name: "药品管理",
    path: "/drug",
    component: "./Home",
    access: "hospital:drug:list",
    icon: "MedicineBoxOutlined",
  },
  {
    name: "处方管理",
    path: "/prescription",
    component: "./Home",
    access: "hospital:prescription:list",
    icon: "FileTextOutlined",
  },
  {
    name: "药房管理",
    path: "/pharmacy",
    component: "./Home",
    access: "hospital:pharmacy:list",
    icon: "shop",
  },
  {
    name: "库存管理",
    path: "/inventory",
    component: "./Home",
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
        component: "./Home",
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
            component: "./Home",
            access: "system:online:list",
          },
          {
            name: "登录日志",
            path: "/system/monitor/login-log",
            component: "./Home",
            access: "system:log:login:list",
          },
          {
            name: "服务监控",
            path: "/system/monitor/serve",
            component: "./Home",
            access: "system:serve:stat",
          },
          {
            name: "健康检查",
            path: "/system/monitor/health",
            component: "./Home",
          },
        ],
        component: "./Home",
        icon: "monitor",
      },
      {
        name: "任务调度",
        path: "/system/schedule",
        routes: [
          {
            name: "任务管理",
            path: "/system/schedule/task",
            component: "./Home",
          },
          {
            name: "任务日志",
            path: "/system/schedule/task/log",
            component: "./Home",
            access: "system:task:list",
          },
        ],
        component: "./Home",
        icon: "ScheduleFilled",
      },
      {
        name: "参数配置",
        path: "/system/param-config",
        component: "./Home",
        access: "system:param-config:list",
        icon: "edit",
      },
      {
        name: "字典项管理",
        path: "/system/dict-item",
        component: "./Home",
        access: "system:dict-item:list",
      },
      {
        name: "邮件工具",
        path: "/system/email",
        component: "./Home",
        access: "system:tools:email",
        icon: "send",
      },
      {
        name: "存储管理",
        path: "/system/storage",
        component: "./Home",
        access: "tool:storage:list",
        icon: "appstore",
      },
    ],
    icon: "setting",
  },
  {
    name: "关于",
    path: "/about",
    component: "./Home",
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
  // {
  //   name: "权限演示",
  //   path: "/access",
  //   component: "./Access",
  //   access: "canAccess", // 需要认证的路由
  // },
  // {
  //   name: " CRUD 示例",
  //   path: "/table",
  //   component: "./Table",
  //   access: "canAccess", // 需要认证的路由
  // },
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
