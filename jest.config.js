const config = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  automock: false,
  globals: {
    "ts-jest": {
      isolatedModules: true,
    },
  },
};
export default config;
