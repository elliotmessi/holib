import { defineConfig } from 'vitest/config'
import swc from 'unplugin-swc'
import { resolve } from 'path'

export default defineConfig({
  plugins: [swc.vite()],

  resolve: {
    alias: {
      // Ensure Vitest correctly resolves TypeScript path aliases
      '~': resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.d.ts',
        '**/*.spec.ts',
        '**/*.module.ts',
        '**/main.ts',
        '**/bootstrap.ts',
      ],
    },
  },
})
