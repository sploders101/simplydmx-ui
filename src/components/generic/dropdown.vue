<script lang="ts">
	export interface Option {
		name: string,
		value: any;
	}
</script>

<script lang="ts" setup>
	import {
		computed,
		nextTick,
		onBeforeUnmount,
		PropType,
		reactive,
		ref,
		watch,
	} from "vue";
	import { useElementSize } from "@vueuse/core";
	import { computePosition, flip, autoUpdate } from "@floating-ui/dom";
	import Textbox from "./textbox.vue";

	const props = defineProps({
		label: { required: false, type: String },
		hint: { required: false, type: String },
		modelValue: { required: true, type: undefined as unknown as PropType<Option["value"]> },
		options: { required: true, type: Array as PropType<Option[]> },
		class: { required: false, type: undefined as unknown as PropType<string | string[] | Record<string, boolean>> },
	});

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
	const useSearchValue = ref(false);
	const filteredOptions = computed(() => {
		if (!useSearchValue.value || searchValue.value === "") return props.options;
		const regex = new RegExp(searchValue.value.replace(/([\\\[\]\(\)\.\?\*\+\^\$\/\|])/g, "\\$1"), "i");
		return props.options.filter((option) => {
			return Boolean(option.name.match(regex));
		});
	});

	watch(() => props.modelValue, resetSearch, { immediate: true });

	function updateValue(option: Option) {
		emit('update:modelValue', option.value);
		dropdownOpen.value = false;
	}

	function resetSearch() {
		let foundOption = props.options.find((option) => option.value === props.modelValue);
		if (foundOption) {
			searchValue.value = foundOption.name;
		} else if (props.modelValue !== null) {
			emit("update:modelValue", null);
		}
	}

	function handleBlur() {
		dropdownOpen.value = false;
		resetSearch();
	}

	/** Compensates for a safari bug in which adding new elements with -webkit-backdrop-filter doesn't work */
	const bdFilterFix = ref<string | undefined>("none");
	watch(dropdownOpen, async (value) => {
		if (value) {
			await nextTick();
			bdFilterFix.value = "none";
			await new Promise((res) => setTimeout(res, 100));
			bdFilterFix.value = undefined;
		}
	});

	const classes = computed(() => {
		if (typeof props.class === "string") {
			const obj: Record<string, boolean> = {};
			props.class.split(" ").forEach((value) => obj[value] = true);
			return obj;
		} else if (Array.isArray(props.class)) {
			const obj: Record<string, boolean> = {};
			props.class.forEach((value) => obj[value] = true);
			return obj;
		} else if (typeof props.class == "object" && props.class !== null) {
			return props.class;
		} else {
			return {};
		}
	});
</script>

<template>
	<Textbox
		ref="textbox"
		:label="props.label"
		:hint="props.hint"
		v-model="searchValue"
		icon-right="chevronDown"
		:class="{ 'dropdown-open': dropdownOpen, ...classes }"
		@focus="dropdownOpen = true; useSearchValue = false"
		@input="dropdownOpen = true; useSearchValue = true"
		@blur="handleBlur()"
		@mousedown="dropdownOpen = true"
		@keypress.esc.prevent="dropdownOpen = false"
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
				'-webkit-backdrop-filter': bdFilterFix,
			}"
			@mousedown.prevent
			>
			<div ref="dropdownOverlayInner" class="sdmx-dropdown-wrapper">
				<div
					v-for="option in filteredOptions"
					class="sdmx-dropdown-option"
					@click="updateValue(option)"
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
		background: var(--popover-background);
		backdrop-filter: var(--popover-backdrop-filter);
		-webkit-backdrop-filter: var(--popover-backdrop-filter);
		border-radius: var(--border-radius);
		margin-top: 0;
		overflow: auto;
		border: $border-size solid var(--focused-border-color);
		z-index: 1;

		// -webkit-backdrop-filter needed here to mitigate the noticability of a safari bug
		transition: height 200ms, -webkit-backdrop-filter 200ms;

		@include dropdown-animation-dest();

		.sdmx-dropdown-wrapper {
			width: 100%;
			padding: 0.5rem;

			.sdmx-dropdown-option {
				padding: 0.5rem;
				border-radius: var(--border-radius);
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
