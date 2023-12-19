import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from 'path'

// noinspection JSUnusedGlobalSymbols
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
  },
})
