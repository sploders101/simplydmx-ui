<script lang="ts" setup>
	import { ref } from "vue";
	import { IconPath } from "./icon.vue";

	const props = defineProps<{
		modelValue: number,
		iconRight?: IconPath,
		textboxId?: string,
		label?: string,
		error?: boolean | string | null,
	}>();
	const emit = defineEmits<{
		(event: "update:modelValue", value: number): void,
		(event: "focus"): void,
		(event: "blur"): void,
	}>();

	const numberbox = ref<HTMLInputElement | null>(null);

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
		class="sdmx-numberbox"
		:class="{ error: props.error }"
		@click.stop="numberbox?.focus()"
		>
		<div class="sdmx-numberbox__label" v-if="props.label || props.error">
			{{ props.label }}
			<span v-if="props.error" class="error-text">
				<Icon
					i="arrowDownLeft"
					:style="{ height: '0.5em', fill: 'var(--error-color)' }"
					/>
				{{ props.error === true ? "Invalid" : props.error }}
			</span>
		</div>
		<div class="sdmx-numberbox__wrapper">
			<input
				type="number"
				:id="props.textboxId"
				ref="numberbox"
				autocomplete="off"
				spellcheck="false"
				autocapitalize="off"
				:value="String(props.modelValue)"
				@input="handleInput($event as InputEvent)"
				@focus="emit('focus')"
				@blur="handleBlur($event)"
				@keypress.esc.prevent="numberbox!.blur()"
				>
			<Icon v-if="props.iconRight" class="trailing-icon" :i="props.iconRight" />
		</div>
	</div>
</template>

<style lang="scss">
	.sdmx-numberbox {

		& > .sdmx-numberbox__label {
			margin-left: 5px;
			color: var(--label-color);

			& > .error-text {
				color: var(--error-color);
			}
		}

		&.error > .sdmx-numberbox__wrapper {
			border-color: var(--error-color);

			&:has(input:focus) {
				border-color: var(--error-color);
				box-shadow: var(--error-shadow);
			}
		}

		& > .sdmx-numberbox__wrapper {
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
	}
</style>
