import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { default as prettier } from 'eslint-config-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      'prettier/prettier': 'error',
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      eqeqeq: ['error', 'always'],
      'no-console': 'off',
      'no-var': 'error',
      'prefer-const': 'error',
      curly: ['error', 'all'],
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
      indent: ['error', 2],
    },
  },
  prettier,
]);