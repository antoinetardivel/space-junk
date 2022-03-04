import { defineConfig } from "vite";
import wasmPack from "vite-plugin-wasm-pack";

export default defineConfig({
  server: {
    port: 8080,
    https: false,
    open: true,
  },
  plugins: [wasmPack(["./crate"])],
});
