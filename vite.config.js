import { defineConfig } from "vite";
import shopify from "vite-plugin-shopify";
import react from "@vitejs/plugin-react";
import mkcert from "vite-plugin-mkcert";

export default defineConfig({
  plugins: [
    shopify({
      themeRoot: "extensions/threedee-app",
    }),
    react(),
    mkcert(),
  ],
  server: {
    // Allow requests from your Shopify store origin.
    cors: {
      origin: "https://quickstart-60f5396d.myshopify.com",
    },
    https: true,
  },
});
