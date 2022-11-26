<script lang="ts">
	export interface SelectOption {
		label: string,
		value: any,
	}
</script>

<script lang="ts" setup>
	import { randomId } from "@/scripts/random";
	import { ref, computed, type PropType } from "vue";

	const props = defineProps({
		options: {
			type: Array as PropType<SelectOption[]>,
			required: true,
		},
		modelValue: { required: true },
		enableSearch: {
			type: Boolean,
			required: false,
		},
	});

	const emit = defineEmits<{
		(e: "update:modelValue", value: any): void
	}>();

	const thisInstanceId = randomId();
	const search = ref("");
	const filteredOptions = computed(() => {
		if (!props.enableSearch) return props.options;
		return props.options.filter(({ label }) => label.toLowerCase().includes(search.value.toLowerCase()));
	});
</script>

<template>
	<div class="sdmx-largeselect">
		<div class="largeselect-header spaced">
			<Textbox v-if="props.enableSearch" v-model="search" hint="Search" class="largeselect-search" />
			<slot name="header-right" />
		</div>
		<div v-for="option in filteredOptions" class="largeselect-option" :class="{ active: option.value === props.modelValue }" @click="emit('update:modelValue', option.value)">
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
		
		& > .largeselect-header {
			display: flex;
			flex-flow: row nowrap;
			justify-content: center;
			align-items: center;
			gap: 0.75rem;

			& > .largeselect-search {
				flex-grow: 1;
			}
		}

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
