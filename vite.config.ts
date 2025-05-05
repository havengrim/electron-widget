import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import type { ComponentResolver } from 'unplugin-vue-components'

const MazUIResolver = (): ComponentResolver => {
  return (name: string) => {
    if (name.startsWith('Maz')) {
      return {
        name,
        from: 'maz-ui/components',
      }
    }
    return undefined
  }
}

export default defineConfig({
  base: './',
  plugins: [
    vue(),
    Components({
      resolvers: [MazUIResolver()],
    }),
  ],
  build: {
    outDir: 'dist',
    sourcemap: false,
  },  
  optimizeDeps: {
    exclude: ['maz-ui'],
  },
})
