import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  build: {
    rollupOptions: {
      // https://stackoverflow.com/questions/76079913/trying-to-include-multiple-html-pages-in-vite-build
      input: {
        main: "index.html",
        wpbc: "wpbc.html"
      }
    }
  }
})
