import { readFileSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// `npm run build:single` (mode "single") inlines everything into one self-contained
// dist-single/index.html, handy for sharing or previewing without a server.
// Single-file build: swap the favicon link for a data URI so nothing is fetched.
const inlineFavicon = () => ({
  name: 'inline-favicon',
  transformIndexHtml: (html) =>
    html.replace(
      /href="\.?\/favicon\.svg"/,
      `href="data:image/svg+xml,${encodeURIComponent(readFileSync('public/favicon.svg', 'utf8'))}"`,
    ),
})

export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), ...(mode === 'single' ? [inlineFavicon(), viteSingleFile()] : [])],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build:
    mode === 'single'
      ? { outDir: 'dist-single', assetsInlineLimit: Number.MAX_SAFE_INTEGER, copyPublicDir: false }
      : {
          // The home page, one page per section (services, work, process, faq, contact),
          // the privacy policy, the terms and the 404 page.
          rollupOptions: {
            input: {
              main: fileURLToPath(new URL('./index.html', import.meta.url)),
              privacy: fileURLToPath(new URL('./privacy.html', import.meta.url)),
              terms: fileURLToPath(new URL('./terms.html', import.meta.url)),
              notfound: fileURLToPath(new URL('./404.html', import.meta.url)),
              services: fileURLToPath(new URL('./services/index.html', import.meta.url)),
              work: fileURLToPath(new URL('./work/index.html', import.meta.url)),
              process: fileURLToPath(new URL('./process/index.html', import.meta.url)),
              faq: fileURLToPath(new URL('./faq/index.html', import.meta.url)),
              contact: fileURLToPath(new URL('./contact/index.html', import.meta.url)),
            },
          },
        },
}))
