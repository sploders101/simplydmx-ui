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
</script>

<template>
	<p>{{ test }}</p>
	<p>{{ test2 }}</p>
	<Textbox v-model="test" />
	<Dropdown v-model="test2" :options="options" />
</template>

<style lang="scss" scoped>

</style>
