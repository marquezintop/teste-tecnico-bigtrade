const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    '**/tests/**/*.test.ts',
  ],
  globalSetup: './tests/jest-global-setup.js',
}

module.exports = config
