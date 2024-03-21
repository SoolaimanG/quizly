import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import mdx from '@mdx-js/rollup'

export default defineConfig({
  plugins: [
    // { enforce: 'pre', ...mdx() },
    react({ include: /\.(js|jsx|ts|tsx)$/ }),
  ],
});
