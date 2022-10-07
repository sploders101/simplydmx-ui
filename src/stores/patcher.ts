import { defineStore } from "pinia";
import { ref } from "vue";
import { getPatcherState, listenForUpdates } from "@/scripts/api/patcher";
import type { PatcherState } from "@/scripts/api/patcher";

export const usePatcherStore = defineStore("patcher", () => {
	const patcherData = ref<null | PatcherState>(null);

	getPatcherState().then((state) => patcherData.value = state);
	listenForUpdates((state) => patcherData.value = state);
});
