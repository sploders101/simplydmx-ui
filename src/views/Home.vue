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
			name: "Test 4",
			value: "test4",
		},
		{
			name: "Test 5",
			value: "test5",
		},
		{
			name: "Test 6",
			value: "test6",
		},
		{
			name: "Test 7",
			value: "test7",
		},
		{
			name: "Test 8",
			value: "test8",
		},
		{
			name: "Test 9",
			value: "test9",
		},
		{
			name: "Test 10",
			value: "test10",
		},
		{
			name: "Test 11",
			value: "test11",
		},
		{
			name: "Test 12",
			value: "test12",
		},
		{
			name: "Test 13",
			value: "test13",
		},
		{
			name: "Test 14",
			value: "test14",
		},
		{
			name: "Test 15",
			value: "test15",
		},
		{
			name: "Test 16",
			value: "test16",
		},
		{
			name: "Test 17",
			value: "test17",
		},
		{
			name: "Test 18",
			value: "test18",
		},
		{
			name: "Test 19",
			value: "test19",
		},
		{
			name: "Test 20",
			value: "test20",
		},
	]

	function testButton() {
		alert("Hello!");
	}
</script>

<template>
	<p>{{ test }}</p>
	<p>{{ test2 }}</p>
	<Textbox v-model="test" />
	<Dropdown v-model="test2" :options="options" />
	<Button @click="testButton()">Hello</button>
</template>

<style lang="scss" scoped>

</style>
