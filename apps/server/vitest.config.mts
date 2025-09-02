import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
  test: {
    reporters: 'verbose',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary', 'html'],
      all: true,
      include: ['./src/**/*.ts'],
      exclude: ['**/*.test.ts', './src/tests/**'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
