// import Icon, { IconPath } from "@/components/icon.vue";
import { CustomGlobalComponents } from "./globalComponents";

declare module '@vue/runtime-core' {
	export interface GlobalComponents extends CustomGlobalComponents {
	}
}

declare module 'vue-router' {
	interface RouteMeta {
		icon?: IconPath;
	}
}
