import { defineConfig } from 'oxfmt'

export default defineConfig({
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 100,
  bracketSameLine: true,
  sortPackageJson: false,
  ignorePatterns: [
    '**/.git',
    '**/.svn',
    '**/.hg',
    '**/node_modules',
    'dist',
    'coverage',
    '**/*.svg',
    '**/*.html',
  ],
})
