import Vue from '@vitejs/plugin-vue';
import VueJsx from '@vitejs/plugin-vue-jsx';
import { defineConfig, mergeConfig } from 'vitest/config';

export default mergeConfig(
  defineConfig({
    plugins: [Vue(), VueJsx()],
  }),
  defineConfig({
    test: {
      globals: true,
      environment: 'happy-dom',
      testTransformMode: {
        web: ['.vue', '.ts', '.tsx', '.js', '.jsx'],
      },
    },
  }),
);
