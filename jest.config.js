module.exports = {
  preset: 'ts-jest',
  clearMocks: true,
  collectCoverage: true,
  testEnvironment: 'jsdom',
  coverageDirectory: 'coverage',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/packages/**/**/$1',
  },
  testMatch: [
    '**/__tests__/**/*.+(js|ts|tsx)',
    '**/?(*.)+(spec|test).+(js|ts|tsx)',
  ],
  transform: {
    '^.+\\.(ts)$': 'ts-jest',
  },
  testPathIgnorePatterns: ['/node_modules/'],
  moduleFileExtensions: ['ts', 'js', 'tsx', 'jsx', 'json', 'vue'],
};
