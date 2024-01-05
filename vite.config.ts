import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    //打包后文件目录
    outDir: 'es',
    //压缩
    minify: false,
    rollupOptions: {
      //忽略打包vue文件
      external: ['vue'],
      input: [
        './packages/index.ts',
      ],
      output: [
        {
          format: 'es',
          entryFileNames: '[name].mjs',
          //让打包目录和我们目录对应
          preserveModules: true,
          exports: 'named',
          //配置打包根目录
          dir: './dist/es'
        },
        {
          format: 'cjs',
          entryFileNames: '[name].js',
          preserveModules: true,
          exports: 'named',
          dir: './dist/lib'
        }
      ]
    },
    lib: {
      entry: '',
      name: 'genshin-ui',
      fileName: 'genshin-ui',
      formats: ['es', 'umd', 'cjs']
    }
  },
  plugins: [
    vue(),
    vueJsx(),
    dts({
      outDir: ['./dist/'],
      tsconfigPath: 'tsconfig.app.json'
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./packages', import.meta.url)),
      '@@': fileURLToPath(new URL('./packages/components', import.meta.url))
    },
    extensions: ['.ts', '.tsx']
  }
})
