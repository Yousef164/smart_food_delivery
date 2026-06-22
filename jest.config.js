export default {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.js"],
  moduleFileExtensions: ["js", "json", "node"],
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  verbose: true,
  testTimeout: 20000,
};
