import { defineConfig } from '@hypernym/bundler'

export default defineConfig({
  externals: [],
  entries: [
    {
      input: './src/index.ts',
      transformers: { resolve: true },
    },
    {
      input: './src/index.ts',
      output: './dist/index.min.mjs',
      transformers: { resolve: true },
      minify: true,
    },
    {
      dts: './src/types.ts',
      output: './dist/index.d.mts',
    },
  ],
})
