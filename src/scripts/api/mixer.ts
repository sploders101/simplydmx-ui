import { callService } from "./ipc";
import { BlenderValue, Submaster, SubmasterDelta } from "./types/mixer";
import { Uuid } from "./patcher/types/fixtureTypes";

export async function enterBlindMode() {
	let oldBinId = await callService<[], Uuid | null>("mixer", "enter_blind_mode");
	if (!oldBinId) throw new Error("Blind mode already active");
	return oldBinId;
}

export function setBlindOpacity(opacity: number) {
	return callService<[number], void>("mixer", "set_blind_opacity", opacity);
}

export function getBlindOpacity() {
	return callService<[], number | null>("mixer", "get_blind_opacity");
}

export function revertBlind() {
	return callService<[], void>("mixer", "revert_blind");
}

export function commitBlind() {
	return callService<[], void>("mixer", "commit_blind");
}

export function createLayer() {
	return callService<[], Uuid>("mixer", "create_layer");
}

export async function setLayerContents(subId: Uuid, submasterDelta: SubmasterDelta): Promise<void> {
	let foundSubmaster = await callService<[Uuid, SubmasterDelta], boolean>("mixer", "set_layer_contents", subId, submasterDelta);
	if (!foundSubmaster) throw new Error("Submaster not found");
}

export async function getLayerContents(subId: Uuid): Promise<Submaster> {
	let foundSubmaster = await callService<[Uuid], Submaster | null>("mixer", "get_layer_contents", subId);
	if (!foundSubmaster) throw new Error("Submaster not found");
	return foundSubmaster;
}

export async function setLayerOpacity(subId: Uuid, opacity: number, autoInsert: boolean | null = true, layerBinId?: Uuid | null): Promise<void> {
	let foundSubmaster = await callService<[Uuid, number, boolean, Uuid | null], boolean>(
		"mixer",
		"set_layer_opacity",
		subId,
		opacity,
		autoInsert === null ? true : autoInsert,
		layerBinId || null,
	);
	if (!foundSubmaster) throw new Error("Submaster not found");
}

export async function getLayerOpacity(subId: Uuid, layerBinId?: Uuid | null) {
	let foundSubmaster = await callService<[Uuid, Uuid | null], number | null>("mixer", "get_layer_opacity", subId, layerBinId || null);
	if (foundSubmaster === null) throw new Error("Submaster not found");
	return foundSubmaster;
}

export async function deleteLayer(subId: Uuid) {
	await callService<[Uuid], boolean>("mixer", "delete_layer", subId);
}


function blenderValue(value: number): BlenderValue {
	return {
		type: "Static",
		value,
	};
}
export async function createLayerTest(fixture_id: Uuid, red: number, green: number, blue: number) {
	let layerId = await createLayer();
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
	let result = await setLayerContents(layerId, delta);
	await setLayerOpacity(layerId, Math.floor(Math.random() * 65535));
	console.log([layerId, result]);
}
