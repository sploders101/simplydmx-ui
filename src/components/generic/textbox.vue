<script lang="ts" setup>
	import { ref } from "vue";
	import { IconPath } from "./icon.vue";

	const props = defineProps<{
		modelValue: string,
		iconRight?: IconPath,
		textboxId?: string,
		hint?: string,
		label?: string,
		error?: boolean | string | null,
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
		:class="{ error: props.error }"
		@click.stop="textbox?.focus()"
		>
		<div class="sdmx-textbox__label" v-if="props.label || props.error">
			{{ props.label }}
			<span v-if="props.error" class="error-text">
				<Icon
					i="arrowDownLeft"
					:style="{ height: '0.5em', fill: 'var(--error-color)' }"
					/>
				{{ props.error === true ? "Invalid" : props.error }}
			</span>
		</div>
		<div class="sdmx-textbox__wrapper">
			<input
				type="text"
				:id="props.textboxId"
				ref="textbox"
				autocomplete="off"
				spellcheck="false"
				autocapitalize="off"
				:value="props.modelValue"
				:placeholder="props.hint"
				@input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
				@focus="emit('focus')"
				@blur="emit('blur')"
				@keypress.esc.prevent="textbox!.blur()"
				>
			<Icon v-if="props.iconRight" class="trailing-icon" :i="props.iconRight" />
		</div>
	</div>
</template>

<style lang="scss">
	.sdmx-textbox {

		& > .sdmx-textbox__label {
			margin-left: 5px;
			color: var(--label-color);

			& > .error-text {
				color: var(--error-color);
			}
		}

		&.error > .sdmx-textbox__wrapper {
			border-color: var(--error-color);

			&:has(input:focus) {
				border-color: var(--error-color);
				box-shadow: var(--error-shadow);
			}
		}

		& > .sdmx-textbox__wrapper {
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
