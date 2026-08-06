import { defineConfig, globalIgnores } from 'eslint/config';

import js from '@eslint/js';
import next from '@next/eslint-plugin-next';
import prettier from 'eslint-config-prettier';
import globals from 'globals';
import importX from 'eslint-plugin-import-x';
import perfectionist from 'eslint-plugin-perfectionist';
import reactHooks from 'eslint-plugin-react-hooks';
import unusedImports from 'eslint-plugin-unused-imports';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores([
    '.next',
    '.turbo',
    'out',
    'dist',
    'coverage',
    'node_modules',
    '*.config.js',
    '*.config.ts',
    '*.config.mjs',
  ]),

  // ============================================================================
  // JavaScript
  // ============================================================================

  js.configs.recommended,

  // ============================================================================
  // TypeScript
  // ============================================================================

  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,

  // ============================================================================
  // React Hooks
  // ============================================================================

  reactHooks.configs.flat.recommended,

  // ============================================================================
  // Import-X
  // ============================================================================

  importX.flatConfigs.recommended,

  // ============================================================================
  // Perfectionist
  // ============================================================================

  perfectionist.configs['recommended-natural'],

  // ============================================================================
  // Prettier
  // ============================================================================

  prettier,

  // ============================================================================
  // Projeto
  // ============================================================================

  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },

      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',

        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    plugins: {
      '@next/next': next,
      'unused-imports': unusedImports,
    },

    rules: {
      // ==========================================================================
      // Next.js
      // ==========================================================================

      ...next.configs.recommended.rules,
      ...next.configs['core-web-vitals'].rules,

      // ==========================================================================
      // Unused Imports
      // ==========================================================================

      'unused-imports/no-unused-imports': 'error',

      'unused-imports/no-unused-vars': [
        'warn',
        {
          args: 'after-used',
          argsIgnorePattern: '^_',
          vars: 'all',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],

      // ==========================================================================
      // Import-X
      // ==========================================================================

      'import-x/first': 'error',
      'import-x/newline-after-import': 'error',
      'import-x/no-duplicates': 'error',
      'import-x/no-unresolved': 'off',

      // ==========================================================================
      // Perfectionist
      // ==========================================================================

      'perfectionist/sort-imports': [
        'error',
        {
          type: 'natural',
          order: 'asc',
        },
      ],

      'perfectionist/sort-named-imports': [
        'error',
        {
          type: 'natural',
          order: 'asc',
        },
      ],

      'perfectionist/sort-objects': [
        'warn',
        {
          type: 'natural',
          order: 'asc',
        },
      ],

      'perfectionist/sort-jsx-props': [
        'warn',
        {
          type: 'natural',
          order: 'asc',
        },
      ],

      'perfectionist/sort-interfaces': 'warn',
      'perfectionist/sort-union-types': 'warn',
    },
  },
]);
