import { defineConfig } from 'tsdown';

export default defineConfig({
  dts: true,
  platform: 'node',
  entry: 'src/index.ts',
  format: 'esm',
  outExtensions: () => {
    return {
      js: '.js',
      dts: '.d.ts',
    };
  },
  outDir: 'dist',
  alias: {
    '~/': 'src/',
  },
});
