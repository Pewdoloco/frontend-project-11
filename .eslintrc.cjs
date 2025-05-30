module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['airbnb-base'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  ignorePatterns: ['dist/**'],
  rules: {
    'no-console': 'warn',
    'import/prefer-default-export': 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        mjs: 'never',
        cjs: 'never',
      },
    ],
    'no-param-reassign': ['error', { props: false }],
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: ['vite.config.js'] },
    ],
    'prefer-promise-reject-errors': 'off',
  },
};
