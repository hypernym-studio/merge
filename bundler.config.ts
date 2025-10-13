import { defineConfig } from '@hypernym/bundler'

export default defineConfig({
  externals: [],
  entries: [
    { input: './src/index.ts' },
    {
      input: './src/index.ts',
      output: './dist/index.min.js',
      minify: true,
    },
    {
      dts: './src/types.ts',
      output: './dist/index.d.ts',
    },
  ],
})
