const config = {
  root: true,
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  env: {
    node: true,
    browser: true,
    mocha: true,
    jest: true,
    es6: true,
  },
  globals: {
    __GLOBAL__: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [],
  rules: {
    // "off" or 0
    // "warn" or 1
    // "error" or 2
    '@typescript-eslint/no-unused-vars': ['error'],
    'array-callback-return': 0,
    '@typescript-eslint/no-explicit-any': 1,
    '@typescript-eslint/explicit-member-accessibility': 2,
    complexity: ['error', 10],
    "linebreak-style": ['off', 'windows'],
    "quotes": ["error", "single"],
    "semi": ["error", "never"]
  },
};

module.exports = config;