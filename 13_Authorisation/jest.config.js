module.exports = {
  // The test environment that will be used for testing
  testEnvironment: "node",

  // The glob patterns Jest uses to detect test files
  testMatch: [
    "**/__tests__/**/*.test.[jt]s?(x)",
    "**/?(*.)+(spec|test).[jt]s?(x)",
  ],

  // Modules to be transformed before running tests
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },

  // File extensions that Jest should treat as TypeScript
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],

  // Ignore files/directories when running tests
  // For example, to ignore the 'node_modules' directory
  // ignore: ['node_modules'],

  // Other Jest configuration options...
};
