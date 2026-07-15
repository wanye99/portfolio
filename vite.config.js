import { defineConfig } from "vite";
import { copyFileSync, mkdirSync } from "node:fs";

const projectRoutes = [
  "afterparty",
  "monster-rescue",
  "casual-extraction",
  "sekiro-combat",
  "monster-hunter-combat",
  "semilinear",
  "campus-events",
];

export default defineConfig({
  base: process.env.VITE_BASE_PATH || "/",
  plugins: [
    {
      name: "github-pages-spa-fallback",
      closeBundle() {
        copyFileSync("dist/index.html", "dist/404.html");
        for (const slug of projectRoutes) {
          const routeDirectory = `dist/projects/${slug}`;
          mkdirSync(routeDirectory, { recursive: true });
          copyFileSync("dist/index.html", `${routeDirectory}/index.html`);
        }
      },
    },
  ],
});
