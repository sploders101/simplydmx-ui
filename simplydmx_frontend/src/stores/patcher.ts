import { ref, onMounted, onUnmounted } from "vue";
import * as ipc from "@/scripts/api/ipc";
import { listenForUpdates } from "@/scripts/api/patcher";

const patcherData = ref<null | ipc.SharablePatcherState>(null);
let unlisten: (Promise<() => Promise<void>>) | null = null;
let listeners = 0;

export function usePatcherState() {
	onMounted(() => {
		if (listeners === 0) {
			ipc.patcher.get_patcher_state().then((state) => patcherData.value = state);
			unlisten = listenForUpdates((state) => patcherData.value = state);
		}
		listeners += 1;
	});
	onUnmounted(() => {
		listeners -= 1;
		if (listeners === 0) {
			let unlistener = unlisten;
			unlisten = null;
			patcherData.value = null;
			unlistener?.then((unlistener) => unlistener());
		}
	});

	return patcherData;
}
