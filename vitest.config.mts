import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    tsconfigPaths: true, // <--- Vite's new native alias resolution
  },
  test: {
    // your existing test config...
  },
});
