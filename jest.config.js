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
      statements: 95,
      branches: 95,
      functions: 95,
      lines: 95,
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
