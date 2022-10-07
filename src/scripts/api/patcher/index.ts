import { callService, listen } from "../ipc";
import {
	Channel,
	ChannelSize,
	FixtureBundle,
	PatcherState,
	Uuid,
} from "./types/fixtureTypes";
export * from "./types/fixtureTypes";

const assert = <T>(v:T)=>v;

export function importFixture(fixtureBundle: FixtureBundle): Promise<void> {
	return callService("patcher", "import_fixture", fixtureBundle);
}

export function createFixture<DriverData>(fixture_type: Uuid, personality: string, name: string | null, comments: string | null, form_data: DriverData) {
	return callService<[Uuid, string, string | null, string | null, DriverData], Uuid>(
		"patcher",
		"create_fixture",
		fixture_type,
		personality,
		name,
		comments,
		form_data,
	);
}

export function getPatcherState() {
	return callService<[], PatcherState>("patcher", "get_patcher_state");
}

export async function listenForUpdates(cb: (state: PatcherState) => void): Promise<() => Promise<void>> {
	const patchUpdates = listen("patcher.patch_updated", { type: "None" }, () => getPatcherState().then(cb));
	const libraryUpdates = listen("patcher.new_fixture", { type: "None" }, () => getPatcherState().then(cb));

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
	const importResponse = await importFixture({
		fixture_info: {
			id: "c205635c-037a-4e5c-8a68-59a8a86dae8f",
			name: "Generic RGBW Fixture",
			short_name: "RGBW",
			family: "Generic",
			metadata: {},
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

export async function createFixtureTest() {
	// const createResponse = await createFixture("c205635c-037a-4e5c-8a68-59a8a86dae8f", "8-bit", "Test Fixture", null, {});
	const createResponse = await createFixture("c205635c-037a-4e5c-8a68-59a8a86dae8f", "8-bit", "Test Fixture", null, {});
	console.log(createResponse);
}
