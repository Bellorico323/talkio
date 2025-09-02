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
    projects: [
      {
        test: {
          name: 'unit',
          include: ['**/*.spec.ts'],
        },
        resolve: {
          alias: {
            '@': path.resolve(__dirname, './src'),
          },
        },
      },
      {
        test: {
          name: 'e2e',
          include: ['**/*.e2e-spec.ts'],
        },
        resolve: {
          alias: {
            '@': path.resolve(__dirname, './src'),
          },
        },
      },
    ],
  },
})
