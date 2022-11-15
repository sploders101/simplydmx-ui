<script setup lang="ts">
	import { computed } from "vue";
	import { usePatcherState } from "@/stores/patcher";

	const state = usePatcherState();

	const stringifiedData = computed(() => {
		return JSON.stringify(state.value);
	});
</script>

<template>
	<div class="patcher-view">
		{{ stringifiedData }}
	</div>
</template>

<style lang="scss">
	.patcher-view {
	}
</style>
