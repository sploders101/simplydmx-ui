import {
	listen,
	patcher,
} from "../ipc";
import type {
	Channel,
	ChannelSize,
	SharablePatcherState,
} from "../ipc";


export async function listenForUpdates(cb: (state: SharablePatcherState) => void): Promise<() => Promise<void>> {
	const patchUpdates = listen("patcher.patch_updated", { type: "None" }, () => patcher.get_patcher_state().then(cb));
	const libraryUpdates = listen("patcher.new_fixture", { type: "None" }, () => patcher.get_patcher_state().then(cb));

	const stopPatchUpdates = await patchUpdates;
	const stopLibraryUpdates = await libraryUpdates;

	return async () => {
		await stopPatchUpdates();
		await stopLibraryUpdates();
	};
}

// Examples
const intensityChannel = (size: ChannelSize): Channel => ({
	size,
	ch_type: {
		type: "Linear",
		priority: "HTP",
	},
});
const colorChannel = (size: ChannelSize): Channel => ({
	size: size,
	ch_type: {
		type: "Linear",
		priority: "LTP",
	},
});

export async function importFixtureTest() {
	const importResponse = await patcher.import_fixture({
		fixture_info: {
			id: "c205635c-037a-4e5c-8a68-59a8a86dae8f",
			name: "Generic RGBW Fixture",
			short_name: "RGBW",
			manufacturer: "Generic",
			family: "Generic",
			metadata: {
				manual_link: null,
				manufacturer: null,
			},
			channels: {
				red: colorChannel("U8"),
				green: colorChannel("U8"),
				blue: colorChannel("U8"),
				white: colorChannel("U8"),
			},
			personalities: {
				"8-bit": {
					available_channels: ["red", "green", "blue", "white"],
				},
			},
			output_driver: "DMX",
		},
		output_info: {
			personalities: {
				"8-bit": {
					dmx_channel_order: ["red", "green", "blue", "white"],
				},
			},
		},
	});

	console.log(importResponse);
}
