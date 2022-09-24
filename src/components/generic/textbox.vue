<script lang="ts" setup>
	import { ref } from "vue";
	import { IconPath } from "./icon.vue";

	const props = defineProps<{
		modelValue: string,
		iconRight?: IconPath,
	}>();
	const emit = defineEmits<{
		(event: "update:modelValue", value: string): void,
		(event: "focus"): void,
		(event: "blur"): void,
	}>();

	const textbox = ref<HTMLInputElement | null>(null);
</script>

<template>
	<div
		class="sdmx-textbox"
		@mousedown.prevent="textbox?.focus()"
		>
		<input
			type="text"
			ref="textbox"
			autocomplete="off"
			spellcheck="false"
			autocapitalize="off"
			:value="props.modelValue"
			@input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
			@focus="emit('focus')"
			@blur="emit('blur')"
			>
		<Icon v-if="props.iconRight" class="trailing-icon" :i="props.iconRight" />
	</div>
</template>

<style lang="scss">
	.sdmx-textbox {
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		margin: 0.75rem;

		outline: none;
		border: 1px solid var(--unfocused-border-color);
		font-size: 1.125rem;
		transition: border-color 200ms, box-shadow 200ms;
		box-shadow: var(--unfocused-shadow);
		border-radius: var(--border-radius);
		background: var(--input-background);
		padding: 0.5rem;

		cursor: text;

		&:has(input:focus) {
			border: 1px solid var(--focused-border-color);
			box-shadow: var(--focused-shadow);
		}

		& > input {
			background: transparent;
			outline: none;
			border: none;

			text-overflow: ellipsis;

			flex-grow: 1;
		}

		& > .trailing-icon {
			height: 1.5em;
			width: 1.5em;
			scale: 1.25;
		}
	}
</style>
