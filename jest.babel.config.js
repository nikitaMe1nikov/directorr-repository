const baseConfig = require('./jest.typescript.config');

module.exports = {
  ...baseConfig,
  transform: { '^.+\\.(ts|tsx)$': '<rootDir>/../../node_modules/ts-jest' },
};
