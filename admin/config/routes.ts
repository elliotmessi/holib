const newRoutes = [
  {
    path: "/document",
    routes: [
      {
        path: "https://www.typeorm.org/",
      },
      {
        path: "https://docs.nestjs.cn/",
      },
      {
        path: "https://antdv.com/components/overview-cn",
      },
    ],
    // component: "./Home",
    icon: "ion:tv-outline",
  },
  {
    path: "/hospital",
    routes: [
      {
        path: "hospital",
        component: "./Home",
        access: "hospital:hospital:list",
        icon: "home",
      },
      {
        path: "department",
        component: "./Home",
        access: "hospital:department:list",
        icon: "project",
      },
      {
        path: "doctor",
        component: "./Home",
        access: "hospital:doctor:list",
        icon: "user",
      },
      {
        path: "patient",
        component: "./Home",
        access: "hospital:patient:list",
        icon: "idcard",
      },
      {
        path: "drug",
        component: "./Home",
        access: "hospital:drug:list",
        icon: "medicine-box",
      },
      {
        path: "pharmacy",
        component: "./Home",
        access: "hospital:pharmacy:list",
        icon: "shop",
      },
      {
        path: "inventory",
        component: "./Home",
        access: "hospital:inventory:list",
        icon: "database",
      },
      {
        path: "prescription",
        component: "./Home",
        access: "hospital:prescription:list",
        icon: "file-text",
      },
    ],
    // component: "./Home",
    icon: "bank",
  },
  {
    path: "/system",
    routes: [
      {
        path: "/system/user",
        component: "./Home",
        access: "system:user:list",
        icon: "ant-design:user-outlined",
      },
      {
        path: "/system/role",
        component: "./Home",
        access: "system:role:list",
        icon: "ep:user",
      },
      {
        path: "/system/menu",
        component: "./Home",
        access: "system:menu:list",
        icon: "ep:menu",
      },
      {
        path: "/system/dept",
        component: "./Home",
        access: "system:dept:list",
        icon: "ant-design:deployment-unit-outlined",
      },
      {
        path: "/system/dict-type",
        component: "./Home",
        access: "system:dict-type:list",
        icon: "ant-design:book-outlined",
      },
      {
        path: "/system/monitor",
        routes: [
          {
            path: "/system/monitor/online",
            component: "./Home",
            access: "system:online:list",
          },
          {
            path: "/system/monitor/login-log",
            component: "./Home",
            access: "system:log:login:list",
          },
          {
            path: "/system/monitor/serve",
            component: "./Home",
            access: "system:serve:stat",
          },
          {
            path: "/system/monitor/health",
            component: "./Home",
          },
        ],
        component: "./Home",
        icon: "ep:monitor",
      },
      {
        path: "/system/schedule",
        routes: [
          {
            path: "/system/schedule/task",
            component: "./Home",
          },
          {
            path: "/system/schedule/task/log",
            component: "./Home",
            access: "system:task:list",
          },
        ],
        component: "./Home",
        icon: "ant-design:schedule-filled",
      },
      {
        path: "/system/param-config",
        component: "./Home",
        access: "system:param-config:list",
        icon: "ep:edit",
      },
      {
        path: "/system/dict-item",
        component: "./Home",
        access: "system:dict-item:list",
        icon: "ant-design:facebook-outlined",
      },
    ],
    // component: "./Home",
    icon: "setting",
  },
  {
    path: "/tool",
    routes: [
      {
        path: "/tool/email",
        component: "./Home",
        access: "system:tools:email",
        icon: "ant-design:send-outlined",
      },
      {
        path: "/tool/storage",
        component: "./Home",
        access: "tool:storage:list",
        icon: "ant-design:appstore-outlined",
      },
    ],
    component: "./Home",
    icon: "ant-design:tool-outlined",
    access: "tool:storage:list",
  },
  {
    path: "/netdisk",
    routes: [
      {
        path: "/netdisk/manage",
        component: "./Home",
        access: "netdisk:manage:list",
      },
      {
        path: "/netdisk/overview",
        component: "./Home",
        access: "netdisk:overview:desc",
      },
    ],
    redirect: '/netdisk/overview',
    icon: "ant-design:cloud-server-outlined",
  },
  {
    path: "/about",
    component: "./Home",
    icon: "info-circle",
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
  {
    name: "权限演示",
    path: "/access",
    component: "./Access",
    access: "canAccess", // 需要认证的路由
  },
  {
    name: " CRUD 示例",
    path: "/table",
    component: "./Table",
    access: "canAccess", // 需要认证的路由
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
  ...newRoutes,
]

export default routes
