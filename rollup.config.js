import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import compiler from '@ampproject/rollup-plugin-closure-compiler';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/barba.js',
    format: 'iife',
    name: 'Barba',
  },
  plugins: [
    json(),
    resolve(),
    babel({
      exclude: 'node_modules/**',
    }),
    compiler(),
  ],
};
