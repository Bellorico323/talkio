import { defineConfig } from 'vitest/config'
import path from 'node:path'
import { readFileSync } from 'node:fs'

function loadEnvFile(filePath: string): Record<string, string> {
  try {
    const content = readFileSync(filePath, 'utf-8')
    const env: Record<string, string> = {}

    for (const line of content.split('\n')) {
      const trimmed = line.trim()

      if (!trimmed || trimmed.startsWith('#')) continue

      const eqIdx = trimmed.indexOf('=')

      if (eqIdx < 0) continue

      const key = trimmed.slice(0, eqIdx).trim()
      const rawVal = trimmed.slice(eqIdx + 1).trim()
      env[key] = rawVal.replace(/^["']|["']$/g, '')
    }
    return env
  } catch {
    return {}
  }
}

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
          env: loadEnvFile(path.resolve(__dirname, '.env.test')),
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
