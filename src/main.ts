import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

import * as rpc from "./scripts/api/ipc";
import * as mixer from "./scripts/api/mixer";
import * as patcher from "./scripts/api/patcher";
import { BlenderValue } from "./scripts/api/types/mixer";
import { createUniverse, linkUniverse } from "./scripts/api/outputDrivers/dmx";
import { DMXFixtureInstance } from "./scripts/api/types/outputDriver/dmx";

createApp(App).mount("#app");

(window as any).rpc = rpc;
(window as any).mixer = mixer;
(window as any).patcher = patcher;

function blenderValue(value: number): BlenderValue {
	return {
		type: "Static",
		value,
	};
}

(window as any).patchtest = async function () {
	console.log("Creating universe");
	let universeId = await createUniverse();
	console.log("Linking universe to sACN ID 1");
	await linkUniverse(universeId, "e131", {
		external_universe: 1,
	});
	console.log("Creating fixture");
	let fixtureId = await patcher.createFixture("c205635c-037a-4e5c-8a68-59a8a86dae8f", "8-bit", "Test Fixture", null, {
		universe: universeId,
		offset: 41,
	} as DMXFixtureInstance);
	console.log(fixtureId);
};

(window as any).fulltest = async function (fixtureId: string, red: number, green: number, blue: number) {
	console.log("Creating submaster");
	let submasterId = await mixer.createLayer();
	console.log("Populating submaster");
	let newContents = {
		[fixtureId]: {
			red: blenderValue(red),
			green: blenderValue(green),
			blue: blenderValue(blue),
			white: blenderValue(0),
		}
	};
	console.log(newContents);
	await mixer.setLayerContents(submasterId, newContents);
	console.log(`Setting submaster opacity (${submasterId})`);
	await mixer.setLayerOpacity(submasterId, Math.floor(Math.random() * 65535));
	console.log("Finished test");
};

export async function fullTestInvoked() {
	await patcher.importFixtureTest();

	let universeId = await createUniverse();
	await linkUniverse(universeId, "e131", {
		external_universe: 1,
	});
	let fixtureId = await patcher.createFixture("c205635c-037a-4e5c-8a68-59a8a86dae8f", "8-bit", "Test Fixture", null, {
		universe: universeId,
		offset: 40,
	} as DMXFixtureInstance);

	let submasterId = await mixer.createLayer();
	let newContents = {
		[fixtureId]: {
			red: blenderValue(255),
			green: blenderValue(30),
			blue: blenderValue(0),
			white: blenderValue(0),
		}
	};
	await mixer.setLayerContents(submasterId, newContents);
	await mixer.setLayerOpacity(submasterId, Math.floor(Math.random() * 65535));
}
