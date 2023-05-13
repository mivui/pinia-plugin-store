import { mergeConfig } from 'vite';
import { defineConfig } from 'vitest/config';
import Vue from '@vitejs/plugin-vue';
import VueJsx from '@vitejs/plugin-vue-jsx';

export default mergeConfig(
  defineConfig({
    plugins: [Vue(), VueJsx()],
  }),
  defineConfig({
    test: {
      globals: true,
      environment: 'happy-dom',
      transformMode: {
        web: [/\.(vue|[tj]s|[tj]sx)$/],
      },
    },
  }),
);
