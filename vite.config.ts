import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  build: {
    sourcemap: 'hidden',
  },
  preview: {
    proxy: {
      "/api/deepl/free": {
        target: "https://api-free.deepl.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/deepl\/free/, "/v2/translate"),
      },
      "/api/deepl/pro": {
        target: "https://api.deepl.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/deepl\/pro/, "/v2/translate"),
      },
    },
  },
  server: {
    proxy: {
      "/api/deepl/free": {
        target: "https://api-free.deepl.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/deepl\/free/, "/v2/translate"),
      },
      "/api/deepl/pro": {
        target: "https://api.deepl.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/deepl\/pro/, "/v2/translate"),
      },
    },
  },
  test: {
    environment: "jsdom",
    globals: false,
    setupFiles: "./src/test/setup.ts",
  },
  plugins: [
    react({
      babel: {
        plugins: [
          'react-dev-locator',
        ],
      },
    }),
    tsconfigPaths()
  ],
})
