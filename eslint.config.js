import stylistic from '@stylistic/eslint-plugin'
import pluginImport from 'eslint-plugin-import'

export default [
  {
    ignores: ['dist/**'],
    languageOptions: {
      ecmaVersion: 12,
      sourceType: 'module',
      globals: {
        browser: true,
        es2021: true,
        node: true,
      },
    },
    plugins: {
      '@stylistic': stylistic,
      'import': pluginImport,
    },
    rules: {
      'prefer-promise-reject-errors': 'off',
      '@stylistic/semi': ['error', 'never'],
      '@stylistic/brace-style': ['error', '1tbs'],
      '@stylistic/arrow-parens': ['error', 'always'],
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/quote-props': ['error', 'consistent-as-needed'],
      '@stylistic/eol-last': ['error', 'always'],
    },
  },
]
