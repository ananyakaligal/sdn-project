/* eslint-env node */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  env: {
    es2021: true,
    node: true,
    browser: false,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  ignorePatterns: ['dist/**', 'node_modules/**', '.next/**'],
  overrides: [
    {
      files: ['apps/client/**/*.{ts,tsx}'],
      env: { browser: true, node: false },
      extends: ['next/core-web-vitals', 'prettier'],
      settings: {
        next: { rootDir: ['apps/client'] },
      },
    },
  ],
};

