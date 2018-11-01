const jestBase = require('../../jest.config.js');

module.exports = {
  ...jestBase,
  collectCoverageFrom: [
    ...jestBase.collectCoverageFrom,
    '!<rootDir>/src/utils.js',
  ],
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
    },
  },
  testMatch: ['**/__tests__/**/*.test.js'],
  transformIgnorePatterns: ['<rootDir>.*(node_modules)(?!.*@barba.*).*$'],
};
