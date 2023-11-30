module.exports = {
  transform: {
    "^.+\\.mjs$": "babel-jest",
    "^.+\\.ts$": "babel-jest",
  },
  transformIgnorePatterns: [
    "node_modules/(?!unsubscriber)"
  ],
  moduleNameMapper: {
    "^provi$": "<rootDir>",
    "^provi/client$": "<rootDir>/client",
    "^provi/server$": "<rootDir>/server",
  }
}