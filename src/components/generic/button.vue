<script lang="ts" setup>
	const emit = defineEmits<{
		(event: "click"): void,
	}>();
	const props = defineProps<{
		subtle?: boolean,
	}>();
</script>

<template>
	<button
		class="sdmx-button"
		:class="{ subtle }"
		@click="emit('click')"
		><slot/></button>
</template>

<style lang="scss">
	.sdmx-button {
		display: block;
		margin: 0.75rem;
		padding: 0.5rem;
		outline: none;
		background: var(--input-background);
		border: 1px solid var(--unfocused-border-color);
		border-radius: var(--border-radius);

		color: var(--text-color);

		cursor: pointer;

		transition: background-color 200ms, border 200ms, box-shadow 200ms;

		&.subtle {
			background: var(--button-subtle-bg);

			&, &:hover, &:active {
				border: none;
			}

			&:hover {
				background: var(--button-subtle-bg-hovered);
			}

			&:active {
				box-shadow: var(--button-shadow-depressed);
			}
		}

		&:hover {
			background: var(--button-hover-bg);
			border: 1px solid var(--button-hover-border-color);
		}

		&:active {
			background: var(--button-hover-bg);
			border: 1px solid var(--button-hover-border-color);
			box-shadow: var(--button-shadow-depressed);
		}
	}
</style>
