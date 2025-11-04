import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import configPrettier from 'eslint-config-prettier';
import importX from 'eslint-plugin-import-x';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
  globalIgnores([
    'node_modules',
    '.claude/node_modules',
    'bun.lockb',
    'dist',
    'coverage',
    '.cache',
  ]),
  {
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.node,
        Bun: 'readonly', // Bun runtime global
      },
    },
  },
  js.configs.recommended,
  unicorn.configs['recommended'],
  {
    plugins: {
      'import-x': importX,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      eqeqeq: 'error',
      'import-x/first': 'error',
      'import-x/newline-after-import': 'error',
      'import-x/no-duplicates': ['error', { 'prefer-inline': true }],
      'no-console': 'off', // Hooks/scripts need console output
      'simple-import-sort/exports': 'error',
      'simple-import-sort/imports': 'error',
      'unicorn/filename-case': [
        'error',
        {
          cases: {
            camelCase: false,
            kebabCase: true,
            pascalCase: false,
          },
        },
      ],
      'unicorn/no-null': 'off',
      'unicorn/no-process-exit': 'off', // Hooks/scripts need process.exit
      'unicorn/prefer-class-fields': 'error',
      'unicorn/prefer-top-level-await': 'off',
      'unicorn/prevent-abbreviations': 'off',
    },
  },
  {
    extends: [
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
    ],
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/consistent-type-exports': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn', // Warn instead of error for scripts
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/prefer-return-this-type': 'error',
      '@typescript-eslint/restrict-template-expressions': 'off',
    },
  },
  {
    files: ['eslint.config.js', '*.config.ts'],
    rules: {
      'sort-keys': [
        'error',
        'asc',
        {
          caseSensitive: false,
          minKeys: 3,
        },
      ],
    },
  },
  {
    files: ['.claude/hooks/**/*.ts', 'plugins/**/hooks/**/*.ts'],
    rules: {
      '@typescript-eslint/no-floating-promises': 'off', // main() calls at top level are ok
    },
  },
  configPrettier,
);
