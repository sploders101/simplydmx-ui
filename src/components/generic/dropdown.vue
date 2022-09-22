<script lang="ts">
	export interface Option {
		name: string,
		value: any;
	}
</script>

<script lang="ts" setup>
	import { computed, onBeforeUnmount, PropType, reactive, ref, watch } from "vue";
	import { useElementSize } from "@vueuse/core";
	import { computePosition, flip, autoUpdate } from "@floating-ui/dom";
	import Textbox from "./textbox.vue";

	const props = defineProps({
		modelValue: { required: true, type: undefined as unknown as PropType<Option["name"]> },
		options: { required: true, type: Array as PropType<Option[]> },
	})

	// const props = defineProps<{
	// 	modelValue: Option["name"],
	// 	options: Option[],
	// }>();

	const emit = defineEmits<{
		(event: "update:modelValue", value: Option["value"]): void;
	}>();

	const textbox = ref<InstanceType<typeof Textbox> | null>(null);
	const dropdownOverlay = ref<HTMLElement | null>(null);
	const dropdownOverlayInner = ref<HTMLElement | null>(null);

	const textboxSize = useElementSize(() => textbox.value?.$el);
	const dropdownInnerSize = useElementSize(dropdownOverlayInner);
	const dropdownOpen = ref(false);

	const dropdownPos = reactive({
		top: 0,
		left: 0,
	});

	// Floating UI
	const cleanupFloater = ref<(() => void) | null>(null);
	watch(dropdownOverlay, () => {
		if (textbox.value && dropdownOverlay.value) {
			cleanupFloater.value = autoUpdate(textbox.value.$el, dropdownOverlay.value, () => {
				if (textbox.value && dropdownOverlay.value) {
					computePosition(textbox.value.$el, dropdownOverlay.value, {
						placement: "bottom",
						middleware: [ flip() ],
						strategy: "absolute",
					}).then(({ x, y }) => {
						dropdownPos.top = y;
						dropdownPos.left = x;
					});
				}
			});
		} else if (cleanupFloater.value) {
			cleanupFloater.value();
			cleanupFloater.value = null;
		}
	}, { immediate: true });
	onBeforeUnmount(() => {
		if (cleanupFloater.value) {
			cleanupFloater.value();
			cleanupFloater.value = null;
		}
	});

	// User searchability
	const searchValue = ref("");
	const filteredOptions = computed(() => {
		if (searchValue.value === "") return props.options;
		return props.options.filter((option) => {
			return option.name.includes(searchValue.value);
		});
	});

	watch(() => props.modelValue, () => {
		let foundOption = props.options.find((option) => option.value === props.modelValue);
		if (foundOption) {
			searchValue.value = foundOption.name;
		} else if (props.modelValue !== null) {
			emit("update:modelValue", null);
		}
	}, { immediate: true });
</script>

<template>
	<Textbox
		ref="textbox"
		v-model="searchValue"
		icon-right="chevronDown"
		:class="{ 'dropdown-open': dropdownOpen }"
		@focus="dropdownOpen = true"
		@blur="dropdownOpen = false"
		/>
	<transition name="sdmx-dropdown-overlay">
		<div
			v-if="dropdownOpen"
			ref="dropdownOverlay"
			class="sdmx-dropdown-overlay"
			:style="{
				width: textboxSize.width.value + 'px',
				top: dropdownPos.top + 'px',
				left: dropdownPos.left + 'px',
				'--target-height': dropdownInnerSize.height.value + 'px',
			}">
			<div ref="dropdownOverlayInner" class="sdmx-dropdown-wrapper">
				<div
					v-for="option in filteredOptions"
					class="sdmx-dropdown-option"
					@mousedown="emit('update:modelValue', option.value)"
					>
					{{ option.name }}
				</div>
			</div>
		</div>
	</transition>
</template>

<style lang="scss">
	$border-size: 1px;

	@mixin dropdown-animation-dest {
		height: calc(var(--target-height) + 1rem + #{$border-size * 2});
		box-shadow: var(--focused-shadow);
		border: $border-size solid var(--focused-border-color);
		scale: 1;
		transform: translate(0, 0.5rem);
	}

	.sdmx-textbox {
		.trailing-icon {
			pointer-events: none;
			transition: transform 200ms;
		}
		&.dropdown-open .trailing-icon {
			transform: rotate(180deg);
		}
	}

	.sdmx-dropdown-overlay {
		position: absolute;
		max-height: 20rem;
		background: var(--input-background);
		border-radius: 0.5rem;
		margin-top: 0;
		overflow: auto;
		transition: height 200ms;

		@include dropdown-animation-dest();

		.sdmx-dropdown-wrapper {
			width: 100%;
			padding: 0.5rem;

			.sdmx-dropdown-option {
				padding: 0.5rem;
				// margin: 0.25rem;
				border-radius: 10px;
				cursor: pointer;

				&:hover {
					background-color: var(--option-hover);
				}
			}
		}

	}
	.sdmx-dropdown-overlay-enter-from, .sdmx-dropdown-overlay-leave-to {
		height: 0;
		box-shadow: var(--unfocused-shadow);
		border: none;
		scale: 0.75;
		transform: translate(0, 0);
	}
	.sdmx-dropdown-overlay-enter-to, .sdmx-dropdown-overlay-leave-from {
		@include dropdown-animation-dest();
	}
	.sdmx-dropdown-overlay-enter-active, .sdmx-dropdown-overlay-leave-active {
		transition: transform 200ms, margin-top 200ms, scale 200ms, border 200ms, box-shadow 200ms, height 200ms;
		overflow: hidden;
	}

</style>
