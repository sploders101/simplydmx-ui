<script lang="ts">
	export interface SelectOption {
		label: string,
		value: any,
	}
</script>

<script lang="ts" setup>
	import { type PropType } from "vue";

	const props = defineProps({
		options: {
			type: Array as PropType<SelectOption[]>,
			required: true,
		},
		modelValue: { required: true },
	});

	const emit = defineEmits<{
		(e: "update:modelValue", value: any): void
	}>();
</script>

<template>
	<div class="sdmx-largeselect">
		<div v-for="option in props.options" class="largeselect-option" :class="{ active: option.value === props.modelValue }" @click="emit('update:modelValue', option.value)">
			<slot name="option" :option="option">
				{{ option.label }}
			</slot>
		</div>
	</div>
</template>

<style lang="scss">
	.sdmx-largeselect {
		display: flex;
		flex-flow: column nowrap;
		justify-content: flex-start;
		align-items: stretch;
		background: var(--largeselect-background);

		& > .largeselect-option {
			height: 3rem;
			cursor: pointer;

			&.active {
				background: var(--largeselect-focused-background);
			}
			&:hover:not(.active) {
				background: var(--largeselect-hover-background);
			}

			display: flex;
			flex-flow: row nowrap;
			align-items: center;
			padding: 0.5rem;

			font-size: 1.125rem;
		}
	}
</style>
