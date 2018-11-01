const jestBase = require('../../jest.config.js');

module.exports = {
  ...jestBase,
  collectCoverageFrom: ['<rootDir>/src/*.{js,jsx}'],
};
