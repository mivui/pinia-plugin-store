import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import typescript from '@rollup/plugin-typescript';
import { defineConfig } from 'rollup';
import { dts } from 'rollup-plugin-dts';

const extensions = ['.mjs', '.cjs', '.js', '.ts', '.json', '.node'];

const input = ['./packages/index.ts'];

const plugins = [
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
];

export default defineConfig([
  {
    input,
    plugins,
    output: [
      {
        file: 'dist/index.cjs.js',
        format: 'cjs',
        plugins: [
          // terser(),
        ],
      },
      {
        file: 'dist/index.esm.js',
        format: 'es',
        plugins: [
          // terser(),
        ],
      },
    ],
  },
  {
    input,
    plugins: [dts()],
    output: [{ file: 'dist/index.d.ts', format: 'es' }],
  },
]);
