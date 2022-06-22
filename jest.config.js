module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|webp|svg)$': 'identity-obj-proxy',
    '\\.(ts)$': '<rootDir>/.jest/identity-obj-proxy-esm.js',
  }
};