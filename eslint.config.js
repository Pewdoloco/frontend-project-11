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
      'no-console': 0, 
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
        { devDependencies: ['vite.config.js', 'eslint.config.js'] },
      ],
      'prefer-promise-reject-errors': 'off',
      '@stylistic/semi': ['error', 'never'],
      '@stylistic/brace-style': ['error', '1tbs'],
      '@stylistic/arrow-parens': ['error', 'as-needed'],
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/quote-props': ['error', 'consistent-as-needed'],
      '@stylistic/eol-last': ['error', 'always'],
    },
  },
]
