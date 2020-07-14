import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

export default {
  input: ['src/index.js'],
  output: [
    {
      format: 'es',
      dir: 'dist',
      entryFileNames: 'bundle.js',
      sourcemap: true,
    },
  ],
  external: ['leaflet'],
  plugins: [
    resolve(),
    terser({
      keep_classnames: true,
      output: {
        comments: false,
      },
    }),
  ],
};
