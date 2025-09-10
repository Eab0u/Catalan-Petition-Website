module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
    browser: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    // Remove project reference to stop the tsconfig error
    // project: ["tsconfig.json", "tsconfig.dev.json"],
  },
  plugins: ["@typescript-eslint", "import"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  rules: {
    indent: "off",
    "import/no-unresolved": 0,
  },
  ignorePatterns: [
    "node_modules/",
    "dist/",
    "lib/",
  ],
};
