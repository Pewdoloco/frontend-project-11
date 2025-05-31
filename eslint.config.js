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
  },
]
