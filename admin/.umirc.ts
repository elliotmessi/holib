import { defineConfig } from "@umijs/max"
import tailwindcss from "@tailwindcss/postcss"
import routes from "./config/routes"

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  layout: {
    title: "医药后台管理系统",
  },
  routes,

  npmClient: "pnpm",
  mfsu: {
    esbuild: true,
  },
  esbuildMinifyIIFE: true,
  extraPostCSSPlugins: [tailwindcss],
  // 配置代理，解决跨域问题
  proxy: {
    "/api": {
      target: "http://localhost:7001",
      changeOrigin: true,
      pathRewrite: {
        "^/api": "/api",
      },
    },
  },
})
