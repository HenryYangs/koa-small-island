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
  plugins: ['@typescript-eslint', 'import'],
  extends: [],
  rules: {
    // 'off' or 0
    // 'warn' or 1
    // 'error' or 2
    quotes: ['error', 'single'],
    '@typescript-eslint/no-unused-vars': ['error'],
    'array-callback-return': 0,
    '@typescript-eslint/no-explicit-any': 1,
    '@typescript-eslint/explicit-member-accessibility': 2,
    complexity: ['error', 10],
    'linebreak-style': ['off', 'windows'],
    // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
          'object',
          'type',
        ],
      },
    ],
    // https://eslint.org/docs/latest/rules/sort-imports
    'sort-imports': [
      'error',
      {
        ignoreCase: true,
        ignoreDeclarationSort: true, // 忽略声明排序，由 import/order 根据 groups 的配置排序
      },
    ],
  },
};

module.exports = config;
