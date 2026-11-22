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
  // `npm run build:preview` makes a copy with relative paths, for hosting under a sub-path.
  base: mode === 'preview' ? './' : '/',
  plugins: [react(), tailwindcss(), ...(mode === 'single' ? [inlineFavicon(), viteSingleFile()] : [])],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build:
    mode === 'single'
      ? { outDir: 'dist-single', assetsInlineLimit: Number.MAX_SAFE_INTEGER, copyPublicDir: false }
      : {
          ...(mode === 'preview' ? { outDir: 'dist-preview' } : {}),
          // Four pages: the site, the privacy policy, the terms and the 404 page.
          rollupOptions: {
            input: {
              main: fileURLToPath(new URL('./index.html', import.meta.url)),
              privacy: fileURLToPath(new URL('./privacy.html', import.meta.url)),
              terms: fileURLToPath(new URL('./terms.html', import.meta.url)),
              notfound: fileURLToPath(new URL('./404.html', import.meta.url)),
            },
          },
        },
}))
