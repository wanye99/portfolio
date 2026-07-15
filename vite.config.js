import { defineConfig } from "vite";
import { copyFileSync } from "node:fs";

export default defineConfig({
  base: process.env.VITE_BASE_PATH || "/",
  plugins: [
    {
      name: "github-pages-spa-fallback",
      closeBundle() {
        copyFileSync("dist/index.html", "dist/404.html");
      },
    },
  ],
});
