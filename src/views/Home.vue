<script lang="ts" setup>
	import { ref } from "vue";
	import { unwrap } from "@/scripts/helpers";
	import * as rpc from "@/scripts/api/ipc";
	import * as mixer from "@/scripts/api/mixer";
	import * as patcher from "@/scripts/api/patcher";
	import { SelectEvent } from "@/components/generic/largeselect.vue";
	import { usePatcherState } from "@/stores/patcher";

	const patcherState = usePatcherState();

	const test = ref("Testing");
	const test2 = ref("test1");
	const options = [
		{
			name: "Test 1",
			value: "test1",
		},
		{
			name: "Test 2",
			value: "test2",
		},
		{
			name: "Test 3",
			value: "test3",
		},
		{
			name: "This is a test of a really long name that probably won't fit in the width that has been allocated to the dropdown",
			value: "test4",
		},
	]

	function testButton() {
		if (patcherState.value && patcherState.value.fixture_order.length === 0) {
			fullTestInvoked();
			dialogVisible.value = true;
		}
	}

	const dialogVisible = ref(false);
	const selectValue = ref(1);

	function log(event: SelectEvent) {
		console.log("User clicked", event.value);
	}

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

	async function fullTestInvoked() {
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
	
</script>

<template>
	<Tabs :tabs="[{label:'Test1',id:'test1'}, {label:'Test2',id:'test2'}, {label:'Test3',id:'test3'}, {label:'Test4',id:'test4'}]">
		<Tabitem tab="test1">
			<p>
				This is currently my testing ground for all of the UI elements in SimplyDMX. Anything with functionality
				will be demonstrated here using a component. By isolating all user interactivity problems into a set of
				components, I get reusability and upgradability. For example, if I need a custom dropdown for a specific
				part of the app to augment its function, it will be defined first in the dropdown component, then used
				here, then used in the part of the app where I need it. By architecting user-interactivity in this way,
				I can easily add more input devices later like UI control via MIDI, or even more useful, touch for the
				eventual mobile build (This <strong><i>is</i></strong> coming; I've already done it, it just needs to
				be brought up to date with the new APIs and needs a bit more work to be stable. I'm also waiting on an
				official build of Wry that is declared as stable on mobile).
			</p>
			<p>{{ test }}</p>
			<p>{{ test2 }}</p>
		</Tabitem>
		<Tabitem tab="test2">
			<LargeSelect :options="[1, 2, 3, 4, 5].map((i) => ({ label: 'Test ' + i, value: i}))" v-model="selectValue" enableSearch />
		</Tabitem>
		<Tabitem tab="test3">
			<LargeSelect :options="[1, 2, 3, 4, 5].map((i) => ({ label: 'Test ' + i, value: i}))" @select="log" enableSearch>
				<template #header-right>
					<Tooltip text="Add Fixture">
						<Button icon subtle><Icon i="plus"/></Button>
					</Tooltip>
				</template>
			</LargeSelect>
		</Tabitem>
	</Tabs>

	<Textbox v-model="test" class="spaced" />
	<Dropdown v-model="test2" :options="options" class="spaced" />
	<Button @click="testButton()" class="spaced">Run initialization test</button>
	<Dialog v-model:visible="dialogVisible">
		<template #header>
			Test Ran
		</template>

		The initialization test has been run. This test cannot be run again until the app has been restarted, as it may yield
		unexpected results. This will not be needed in the future as more UI elements are implemented.

		<template #footer>
			<Button @click="dialogVisible = false" subtle class="spaced">
				Cancel
			</Button>
			<div class="spacer"/>
			<Button @click="dialogVisible = false" class="spaced">
				Ok
			</Button>
		</template>
	</Dialog>
</template>

<style lang="scss">
</style>
