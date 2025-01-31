import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import wyw from "@wyw-in-js/vite";
import dotenv from "@dotenvx/dotenvx";
import path from "path"

dotenv.config();

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [
    wyw({
      include: ["**/*.{ts,tsx}"],
      babelOptions: {
        presets: ["@babel/preset-typescript"],
      },
    }),
    solid(),
  ],
  server: {
    proxy: {
      "/auth": {
        target: "http://localhost:42069",
        changeOrigin: true,
      },
      "/api": {
        target: "http://localhost:42069",
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
  root: ".",
});
