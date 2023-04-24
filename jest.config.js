/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  projects: [
    {
      displayName: "prompt-ts",
      testMatch: ["**/?(*.)+(spec|test).(js)"],
      moduleFileExtensions: ["js"],
    },
    {
      displayName: "prompt-yml",
      runner: "./dist/jest-runner.js",
      testMatch: ["**/?(*.)+(spec|test).(yml)"],
      moduleFileExtensions: ["yml"],
    },
  ],
};
