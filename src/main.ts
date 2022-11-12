import { createApp } from "vue";
import "@/assets/theme.scss";
import "@/assets/style.scss";
import App from "./App.vue";
import "normalize.css";

import { unwrap } from "./scripts/helpers";
import * as rpc from "./scripts/api/ipc";
import * as mixer from "./scripts/api/mixer";
import * as patcher from "./scripts/api/patcher";
import { registerGlobals } from "@/globalComponents";
import router from "./router";
import { createPinia } from "pinia";

let app = createApp(App);
app.use(router);
app.use(createPinia());
registerGlobals(app);
app.mount("#app");

(window as any).rpc = rpc;
(window as any).mixer = mixer;
(window as any).patcher = patcher;

function blenderValue(value: number): rpc.BlenderValue {
	return {
		type: "Static",
		value,
	};
}

(window as any).patchtest = async function () {
	console.log("Creating universe");
	let universeId = await rpc.output_dmx.create_universe();
	console.log("Linking universe to sACN ID 1");
	await rpc.output_dmx.link_universe(universeId, "e131", {
		external_universe: 1,
	});
	console.log("Creating fixture");
	let fixtureId = unwrap(await rpc.patcher.create_fixture("c205635c-037a-4e5c-8a68-59a8a86dae8f", "8-bit", "Test Fixture", null, {
		universe: universeId,
		offset: 41,
	} as rpc.DMXFixtureInstance));
	console.log(fixtureId);
	return fixtureId;
};

(window as any).fulltest = async function (fixtureId: string, red: number, green: number, blue: number) {
	console.log("Creating submaster");
	let submasterId = await rpc.mixer.create_layer();
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
	await rpc.mixer.set_layer_contents(submasterId, newContents);
	console.log(`Setting submaster opacity (${submasterId})`);
	await rpc.mixer.set_layer_opacity(submasterId, Math.floor(Math.random() * 65535), true);
	console.log("Finished test");
};

export async function fullTestInvoked() {
	await patcher.importFixtureTest();

	let universeId = await rpc.output_dmx.create_universe();
	await rpc.output_dmx.link_universe(universeId, "e131", {
		external_universe: 1,
	});
	let fixtureId = unwrap(await rpc.patcher.create_fixture("c205635c-037a-4e5c-8a68-59a8a86dae8f", "8-bit", "Test Fixture", null, {
		universe: universeId,
		offset: 40,
	} as rpc.DMXFixtureInstance));

	let submasterId = await rpc.mixer.create_layer();
	let newContents = {
		[fixtureId]: {
			red: blenderValue(255),
			green: blenderValue(30),
			blue: blenderValue(0),
			white: blenderValue(0),
		}
	};
	await rpc.mixer.set_layer_contents(submasterId, newContents);
	await rpc.mixer.set_layer_opacity(submasterId, Math.floor(Math.random() * 65535), true);
}
