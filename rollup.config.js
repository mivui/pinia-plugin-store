import { getBabelOutputPlugin } from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import replace from '@rollup/plugin-replace';
import path from 'path';

const extensions = ['.js', '.ts'];

export default {
  input: ['./packages/index.ts'],
  output: [
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      plugins: [
        getBabelOutputPlugin({
          configFile: path.resolve(__dirname, 'babel.config.js'),
        }),
      ],
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
    },
  ],
  plugins: [
    commonjs(),
    resolve({
      extensions,
      modulesOnly: true,
      preferredBuiltins: false,
    }),
    json({
      namedExports: false,
    }),
    typescript({
      tsconfig: 'tsconfig.json',
      tsconfigOverride: {
        declaration: true,
        declarationMap: false,
      },
    }),
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify('production'),
      __buildDate__: () => JSON.stringify(new Date()),
      __buildVersion: 15,
    }),
  ],
};
