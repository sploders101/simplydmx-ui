import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	clearScreen: false,
	server: {
		port: 1420,
		strictPort: true,
	},
	envPrefix: ["VITE_", "TAURI_"],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
			"rpc__internal": path.resolve(__dirname, "./src/scripts/api/ipc/ipc_tauri"),
		},
	},
	build: {
		// Tauri supports es2021
		target: ['es2021', 'chrome100', 'safari13'],
		// don't minify for debug builds
		minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
		// produce sourcemaps for debug builds
		sourcemap: !!process.env.TAURI_DEBUG,
	},
});
