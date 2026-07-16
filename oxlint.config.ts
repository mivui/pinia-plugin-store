import { defineConfig } from 'oxlint';

export default defineConfig({
  plugins: ['typescript', 'eslint', 'oxc', 'import', 'vitest'],
  categories: {
    correctness: 'error',
    suspicious: 'warn',
    perf: 'warn',
  },
  options: {
    typeAware: true,
    typeCheck: true,
  },
  globals: {},
  rules: { 'import/no-unassigned-import': ['off'], 'typescript/consistent-return': ['off'] },
  env: {
    builtin: true,
    browser: true,
    node: true,
    vue: true,
    vitest: true,
    es2026: true,
  },
  ignorePatterns: ['dist', 'coverage', 'node_modules'],
});
