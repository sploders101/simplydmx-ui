<script lang="ts" setup>
	const emit = defineEmits<{
		(event: "click"): void,
	}>();
</script>

<template>
	<button
		class="sdmx-button"
		@click="emit('click')"
		><slot/></button>
</template>

<style lang="scss">
	.sdmx-button {
		outline: none;
		background: none;
		border: none;
		padding: 0;

		padding: 0.5rem;
		border: 1px solid var(--unfocused-border-color);
		border-radius: var(--border-radius);

		cursor: pointer;

		&:hover {
			background: var(--button-hover-bg);
		}
	}
</style>
