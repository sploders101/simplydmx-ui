import { callService, sendRPC } from "./ipc";
import { Channel, ChannelSize, FixtureBundle, Uuid } from "./types/patcherFixtureTypes";

export function assert<T>(msg: T): T {
	return msg;
}

export function importFixture(fixtureBundle: FixtureBundle): Promise<void> {
	return callService("patcher", "import_fixture", fixtureBundle);
}

export function createFixture<DriverData>(fixture_type: Uuid, personality: String, name: string | null, comments: string | null, form_data: DriverData) {
	return callService("patcher", "create_fixture", fixture_type, personality, name, comments, form_data);
}

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

// export async function importFixtureTest() {
// 	const importResponse = await importFixture({
// 		fixture_info: {
// 			id: "c205635c-037a-4e5c-8a68-59a8a86dae8f",
// 			name: "Generic IRGBW Fixture",
// 			short_name: "IRGBW",
// 			family: "Generic",
// 			metadata: {},
// 			channels: {
// 				int: intensityChannel("U8"),
// 				red: colorChannel("U8"),
// 				green: colorChannel("U8"),
// 				blue: colorChannel("U8"),
// 				white: colorChannel("U8"),
// 				int16: intensityChannel("U16"),
// 				red16: colorChannel("U16"),
// 				green16: colorChannel("U16"),
// 				blue16: colorChannel("U16"),
// 				white16: colorChannel("U16"),
// 			},
// 			personalities: {
// 				"8-bit": {
// 					available_channels: ["int", "red", "green", "blue", "white"],
// 				},
// 				"16-bit": {
// 					available_channels: ["int16", "red16", "green16", "blue16", "white16"],
// 				},
// 			},
// 			output_driver: "DMX",
// 		},
// 		output_info: {
// 			personalities: {
// 				"8-bit": {
// 					dmx_channel_order: ["int", "red", "green", "blue", "white"],
// 				},
// 				"16-bit": {
// 					dmx_channel_order: ["int16", "red16", "green16", "blue16", "white16"],
// 				},
// 			},
// 		},
// 	});

// 	console.log(importResponse);
// }

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
