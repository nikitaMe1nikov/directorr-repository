const baseConfig = require('./jest.babel.config')

module.exports = {
  ...baseConfig,
  preset: 'ts-jest',
  transform: { '^.+\\.(ts|tsx)$': '<rootDir>/../../node_modules/ts-jest' },
  // globals: {
  //   'ts-jest': {
  //     tsconfig: '<rootDir>/../../tsconfig.json',
  //   },
  // },
}
