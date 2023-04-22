import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import path from "path";
import { internalIpV4 } from "internal-ip";

// https://vitejs.dev/config/
export default defineConfig(async () => {
	const host = await internalIpV4();

	return {
		plugins: [vue()],
		clearScreen: false,
		server: {
			port: 1420,
			host: '0.0.0.0',
			strictPort: true,
			hmr: {
				protocol: 'ws',
				host,
				port: 5183,
			},
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
	}
});
