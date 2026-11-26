
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  test: {
    environment: 'jsdom',

    setupFiles: ['./src/tests/setup.ts'],

    globals: false,

    include: [
      'src/**/*.test.ts',
      'src/**/*.test.tsx',
    ],

    clearMocks: true,
    restoreMocks: true,

    coverage: {
      provider: 'v8',

      reporter: [
        'text',
        'html',
        'json-summary',
        'lcov',
      ],

      reportsDirectory: './coverage',

      include: [
        'src/api/**/*.ts',
        'src/utils/**/*.ts',
        'src/context/**/*.ts',
        'src/context/**/*.tsx',
        'src/hooks/**/*.ts',
        'src/components/**/*.tsx',
        'src/pages/**/*.tsx',
      ],

      exclude: [
        'src/**/*.test.ts',
        'src/**/*.test.tsx',
        'src/tests/**',
        'src/**/*.d.ts',
      ],
    },
  },
})
