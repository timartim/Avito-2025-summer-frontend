// jest.config.ts
module.exports = {
   preset: 'ts-jest/presets/js-with-ts-esm',
   testEnvironment: 'jest-environment-jsdom',
   roots: ['<rootDir>/src', '<rootDir>/tests/unit'],
   setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
   moduleNameMapper: {
      '\\.(css|scss)$': 'identity-obj-proxy'
   },
   testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
   globals: {
      'ts-jest': {
         diagnostics: false,
         isolatedModules: true
      }
   }
};
