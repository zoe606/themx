import { defineConfig } from "vitest/config";

export default defineConfig({
  esbuild: { jsx: "automatic", jsxImportSource: "preact" },
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}"],
    // Disable Node's Web Storage API so jsdom supplies localStorage.
    execArgv: process.allowedNodeEnvironmentFlags.has("--no-experimental-webstorage")
      ? ["--no-experimental-webstorage"] : [],
  },
});
