<script lang="ts" setup>
	import { nextTick, ref } from "vue";
	import { IconPath } from "./icon.vue";

	const props = defineProps<{
		modelValue: number,
		iconRight?: IconPath,
		textboxId?: string,
		hint?: string,
	}>();
	const emit = defineEmits<{
		(event: "update:modelValue", value: number): void,
		(event: "focus"): void,
		(event: "blur"): void,
	}>();

	const textbox = ref<HTMLInputElement | null>(null);

	function handleInput(event: InputEvent) {
		const strValue = (event.target as HTMLInputElement).value;
		const value = Number(strValue);
		if (strValue && !Number.isNaN(value) && value != props.modelValue) {
			emit("update:modelValue", value);
		}
	}
	function handleBlur(event: FocusEvent) {
		const element = (event.target as HTMLInputElement);
		element.value = String(props.modelValue);
		emit('blur');
	}
</script>

<template>
	<div
		class="sdmx-textbox"
		@click.stop="textbox?.focus()"
		>
		<input
			type="number"
			:id="props.textboxId"
			ref="textbox"
			autocomplete="off"
			spellcheck="false"
			autocapitalize="off"
			:value="String(props.modelValue)"
			:placeholder="props.hint"
			@input="handleInput($event as InputEvent)"
			@focus="emit('focus')"
			@blur="handleBlur($event)"
			@keypress.esc.prevent="textbox!.blur()"
			>
		<Icon v-if="props.iconRight" class="trailing-icon" :i="props.iconRight" />
	</div>
</template>

<style lang="scss">
	.sdmx-textbox {
		display: flex;
		flex-flow: row nowrap;
		align-items: center;

		outline: none;
		border: 1px solid var(--unfocused-border-color);
		font-size: 1.125rem;
		transition: border-color 200ms, box-shadow 200ms;
		box-shadow: var(--unfocused-shadow);
		border-radius: var(--border-radius);
		background: var(--input-background);
		padding: 0.5rem;

		cursor: text;

		label + & {
			margin-top: 0;
		}

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
