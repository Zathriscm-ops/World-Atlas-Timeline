import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
  {
    ignores: [
      '**/node_modules/**',
      '.cache/**',
      '.verification/**',
      '.tools/**',
      '**/dist/**',
      'coverage/**',
      'data/research/raw/**',
    ],
  },
  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
    extends: [js.configs.recommended, tseslint.configs.recommended],
    languageOptions: { globals: globals.node },
    rules: { 'no-debugger': 'error', eqeqeq: ['error', 'always'] },
  },
);
