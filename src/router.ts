import { createRouter, createWebHashHistory } from "vue-router";
import Home from "./views/Home.vue";

const router = createRouter({
	history: createWebHashHistory(),
	routes: [
		{
			path: "/",
			component: Home,
			name: "Home",
			meta: {
				icon: "home",
			},
		},
		{
			path: "/test",
			component: Home,
			name: "DMX Patching",
			meta: {
				icon: "xlr5",
			},
		},
	],
});

export default router;
