module.exports = {
  collectCoverageFrom: [
    'packages/**/src/**/*.ts',
    '!packages/**/src/**/*.d.ts',
    '!packages/**/src/**/index.ts',
    '!packages/**/src/polyfills/**.ts',
    '!packages/core/src/utils/helpers.ts',
  ],
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
    },
  },
  preset: 'ts-jest',
  resetMocks: true,
  testEnvironment: 'jest-environment-jsdom-global',
  testMatch: ['**/__tests__/**/*.test.ts'],
  transformIgnorePatterns: ['<rootDir>.*(node_modules)(?!.*@barba.*).*$'],
  verbose: true,
  watchPlugins: ['jest-watch-lerna-packages'],
};
