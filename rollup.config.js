import { defineConfig } from 'rollup';
import { getBabelOutputPlugin } from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import replace from '@rollup/plugin-replace';
// import terser from '@rollup/plugin-terser';
import path from 'path';

const extensions = ['.mjs', '.cjs', '.js', '.ts', '.json', '.node'];

export default defineConfig({
  input: ['./packages/index.ts'],
  plugins: [
    commonjs(),
    resolve({
      extensions,
      preferBuiltins: false,
    }),
    json({
      namedExports: false,
    }),
    typescript({ tsconfig: './tsconfig.build.json' }),
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify('production'),
      __buildDate__: () => JSON.stringify(new Date()),
      __buildVersion: 15,
    }),
  ],
  output: [
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      plugins: [
        getBabelOutputPlugin({
          configFile: path.resolve(__dirname, 'babel.config.js'),
        }),
        // terser(),
      ],
    },
    {
      file: 'dist/index.esm.js',
      format: 'es',
      plugins: [
        getBabelOutputPlugin({
          presets: ['@babel/preset-env'],
          plugins: [['@babel/plugin-transform-runtime', { useESModules: true }]],
        }),
        // terser(),
      ],
    },
  ],
});
