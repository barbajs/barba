module.exports = {
  collectCoverageFrom: [
    'packages/**/src/**/*.{js,jsx}',
    '!packages/core/src/(polyfills|schema|utils).js',
    '!packages/prefetch/src/polyfills.js',
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
  testMatch: ['**/__tests__/**/*.test.js'],
  transformIgnorePatterns: ['<rootDir>.*(node_modules)(?!.*@barba.*).*$'],
  verbose: true,
  watchPlugins: ['jest-watch-lerna-packages'],
};
