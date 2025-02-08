// eslint.config.js
import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import astroPlugin from 'eslint-plugin-astro';

export default [
  js.configs.recommended,
  tsPlugin.configs.recommended,
  astroPlugin.configs.recommended,
  {
    // ...otras configuraciones
  },
];
