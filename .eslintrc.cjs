module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'no-console': 'warn',
    'import/extensions': ['error', 'ignorePackages', {
      js: 'never',
      mjs: 'never',
      cjs: 'never',
    }],
  },
  ignorePatterns: ['node_modules/', 'dist/'],
};