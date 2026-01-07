import { defineConfig } from '@umijs/max'
import tailwindcss from '@tailwindcss/postcss'

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '医药后台管理系统',
  },
  // vite: {},
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      name: '首页',
      path: '/home',
      component: './Home',
    },
    {
      name: '权限演示',
      path: '/access',
      component: './Access',
    },
    {
      name: ' CRUD 示例',
      path: '/table',
      component: './Table',
    },
  ],

  npmClient: 'pnpm',
  mfsu: {
    esbuild: true,
  },
  extraPostCSSPlugins: [tailwindcss],
})
