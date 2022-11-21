<script lang="ts" setup>
	import { ref } from "vue";

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
		dialogVisible.value = true;
	}

	const dialogVisible = ref(false);
	const selectValue = ref(1);
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
			<LargeSelect :options="[1, 2, 3, 4, 5].map((i) => ({ label: 'Test ' + i, value: i}))" v-model="selectValue" />
		</Tabitem>
	</Tabs>

	<Textbox v-model="test" />
	<Dropdown v-model="test2" :options="options" />
	<Button @click="testButton()">Hello</button>
	<Dialog :visible="dialogVisible" show-close @close-clicked="dialogVisible = false" @modal-clicked="dialogVisible = false">
		<template #header>
			Test Header
		</template>
		Test Content
		<template #footer>
			<Button @click="dialogVisible = false" subtle>
				Cancel
			</Button>
			<div class="spacer"/>
			<Button @click="dialogVisible = false">
				Ok
			</Button>
		</template>
	</Dialog>
</template>

<style lang="scss" scoped>

</style>
