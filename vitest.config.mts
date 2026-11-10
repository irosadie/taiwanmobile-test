import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
export default defineConfig({ resolve: { alias: { "@": fileURLToPath(new URL("./apps/web/", import.meta.url)) } }, test: { include: ["packages/**/*.test.ts", "apps/web/**/*.test.ts"], exclude: ["e2e/**", "node_modules/**"] } });
