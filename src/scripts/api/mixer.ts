import * as ipc from "./ipc";
import type {
	BlenderValue,
	Uuid,
} from "./ipc";

function blenderValue(value: number): BlenderValue {
	return {
		Static: value,
	};
}
export async function createLayerTest(fixture_id: Uuid, red: number, green: number, blue: number) {
	let layerId = await ipc.mixer.create_layer();
	let delta = {
		[fixture_id]: {
			int: blenderValue(0),
			red: blenderValue(red),
			green: blenderValue(green),
			blue: blenderValue(blue),
			white: blenderValue(0),
		}
	};
	console.log(delta);
	let result = await ipc.mixer.set_layer_contents(layerId, delta);
	await ipc.mixer.set_layer_opacity(layerId, Math.floor(Math.random() * 65535), true);
	console.log([layerId, result]);
}
