// jest.config.ts
module.exports = {
   preset: 'ts-jest',
   testEnvironment: 'jsdom',
   roots: ['<rootDir>/src', '<rootDir>/tests/unit'],
   setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
   moduleNameMapper: {
      '\\.(css|scss)$': 'identity-obj-proxy'
   },
   testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
};
