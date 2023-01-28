import { ref, onMounted, onUnmounted } from "vue";
import * as ipc from "@/scripts/api/ipc";
import { listen } from "@/scripts/api/ipc";

interface UniverseData {
	driver_list: ipc.DisplayableDMXDriver[],
	/** Array<[universe_id, universe_name]> */
	universe_list: Array<[string, string]>,
}

const universeData = ref<null | UniverseData>(null);
let unlisten: (() => void) | null = null;
let listeners = 0;

function listenForUpdates() {
	let unlisteners = [
		listen<void>("dmx.drivers_updated", { type: "None" }, () => {
			if (universeData.value) {
				ipc.output_dmx.list_drivers()
					.then((drivers) => {
						if (universeData.value) universeData.value.driver_list = drivers;
					}, console.error);
			}
		}),
		listen<void>("dmx.universes_updated", { type: "None" }, () => {
			if (universeData.value) {
				ipc.output_dmx.list_universes()
					.then((universes) => {
						if (universeData.value) universeData.value.universe_list = universes;
					}, console.error);
			}
		}),
		// This event also exists, but will get used in the universe linking form to update
		// the user if this is changed elsewhere
		// listen<void>("dmx.universe_link_changed", { type: "None" }, () => {}),
	];

	return () => {
		Promise.allSettled(unlisteners)
			.then((results) => results.forEach((result) => {
				if (result.status == "fulfilled") {
					result.value().catch(console.error);
				}
			}));
	};
}

async function getUniverseState(): Promise<UniverseData> {
	const [driver_list, universe_list] = await Promise.all([
		ipc.output_dmx.list_drivers(),
		ipc.output_dmx.list_universes(),
	]);
	return {
		driver_list,
		universe_list,
	};
}

export function useUniverseState() {
	onMounted(() => {
		if (listeners === 0) {
			getUniverseState().then((state) => universeData.value = state, console.error);
			unlisten = listenForUpdates();
		}
		listeners += 1;
	});
	onUnmounted(() => {
		listeners -= 1;
		if (listeners === 0 && unlisten) {
			let unlistener = unlisten;
			unlisten = null;
			universeData.value = null;
			unlistener();
		}
	});

	return universeData;
}
