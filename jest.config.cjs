module.exports = {
  transform: {
    "^.+\\.js$": "babel-jest",
    "^.+\\.mjs$": "babel-jest",
    "^.+\\.ts$": "babel-jest",
  },
  transformIgnorePatterns: [
    "node_modules/(?!unsubscriber)"
  ],
  moduleNameMapper: {
    "^provi$": "<rootDir>",
    "^provi/client$": "<rootDir>/client/src",
    "^provi/server$": "<rootDir>/server/src",
  }
}