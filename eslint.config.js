// @ts-check
import { defineConfig } from '@debbl/eslint-config'

export default defineConfig({
  ignores: {
    files: ['public'],
  },
  typescript: true,
  react: true,
  tailwindcss: true,
})
