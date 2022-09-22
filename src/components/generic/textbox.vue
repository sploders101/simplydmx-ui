<script lang="ts" setup>
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
</script>

<template>
	<div class="sdmx-textbox">
		<input
			type="text"
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
		display: block;
		position: relative;
		margin: 0.75rem;

		& > input {
			height: 100%;
			width: 100%;
			outline: none;
			border: 1px solid var(--unfocused-border-color);
			padding: 0.5rem;
			font-size: 1.125rem;
			transition: border-color 200ms, box-shadow 200ms;
			box-shadow: var(--unfocused-shadow);
			border-radius: 0.5rem;
			background: var(--input-background);

			&:focus {
				border: 1px solid var(--focused-border-color);
				box-shadow: var(--focused-shadow);
			}
		}

		& > .trailing-icon {
			position: absolute;
			top: 10%;
			right: 5px;
			height: 80%;
		}
	}
</style>
