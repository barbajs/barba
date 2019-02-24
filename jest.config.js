module.exports = {
  collectCoverageFrom: [
    'packages/**/src/**/*.{js,jsx}',
    '!packages/**/src/**/index.js',
    '!packages/**/src/polyfills/**.js',
    '!packages/core/src/utils/helpers.js',
  ],
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
    },
  },
  resetMocks: true,
  setupFiles: ['<rootDir>/jest.init.js'],
  testEnvironment: 'jest-environment-jsdom-global',
  testMatch: ['**/__tests__/**/*.test.js'],
  transformIgnorePatterns: ['<rootDir>.*(node_modules)(?!.*@barba.*).*$'],
  verbose: true,
  watchPlugins: ['jest-watch-lerna-packages'],
};
