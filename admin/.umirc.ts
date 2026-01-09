import { defineConfig } from '@umijs/max'
import tailwindcss from '@tailwindcss/postcss'

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  layout: {
    title: '医药后台管理系统',
  },
  routes: [
    {
      path: '/',
      redirect: '/home',
      access: 'canAccess', // 需要认证的路由
    },
    {
      name: '首页',
      path: '/home',
      component: './Home',
      access: 'canAccess', // 需要认证的路由
    },
    {
      name: '权限演示',
      path: '/access',
      component: './Access',
      access: 'canAccess', // 需要认证的路由
    },
    {
      name: ' CRUD 示例',
      path: '/table',
      component: './Table',
      access: 'canAccess', // 需要认证的路由
    },
    // 认证相关路由
    {
      path: '/login',
      component: './Login',
      layout: false, // 不使用全局布局
    },
    {
      path: '/register',
      component: './Register',
      layout: false, // 不使用全局布局
    },
    // 404 路由
    {
      path: '*',
      component: './404',
      layout: false,
    },
  ],

  npmClient: 'pnpm',
  mfsu: {
    esbuild: true,
  },
  esbuildMinifyIIFE: true,
  extraPostCSSPlugins: [tailwindcss],
  // 配置代理，解决跨域问题
  proxy: {
    '/api': {
      target: 'http://localhost:7001',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/api',
      },
    },
  },
})
