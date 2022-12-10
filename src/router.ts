import { createRouter, createWebHashHistory } from "vue-router";
import Home from "./views/Home.vue";
import Patcher from "./views/patcher/patcher.vue";

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
			path: "/patch",
			component: Patcher,
			name: "DMX Patching",
			meta: {
				icon: "xlr5",
			},
		},
	],
});

export default router;
