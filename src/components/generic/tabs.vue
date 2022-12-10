<script lang="ts">
	import { Ref } from "vue";

	export interface TabSlot {
		/// This can be used with the `Teleport` element to inject custom content into the tab. Use with caution, as it can screw up alignment
		tabSlot: Ref<HTMLDivElement | null>,
		id: string,
	}

	export interface TabLabel {
		label: string,
		id: string,
		disabled?: boolean,
	}

	export type Tab = TabSlot | TabLabel;
</script>

<script lang="ts" setup>
	import { ref, computed, provide, type PropType } from "vue";
	import { useElementBounding } from "@vueuse/core";

	const props = defineProps({
		tabs: Object as PropType<Tab[]>,
	});

	let activeTabId = ref(props.tabs![0]?.id);
	provide("sdmx-tabs__current-tab-id", activeTabId);

	const tabsContainer = ref<HTMLDivElement | null>(null);
	const tabElements = ref<Array<HTMLDivElement>>([]);
	const tabsContainerBounds = useElementBounding(tabsContainer);
	const activeTabElementBounds = useElementBounding(() => tabElements.value[props.tabs!.findIndex((tab) => tab.id === activeTabId.value)]);
	const activeLineWidth = computed(() => activeTabElementBounds.width.value);
	const activeLineOffset = computed(() => (activeTabElementBounds.left.value || 0) - (tabsContainerBounds.left.value || 0));
</script>

<template>
	<div class="sdmx-tabs">
		<div class="tabs-container" ref="tabsContainer" :style="{ '--active-line-width': `${activeLineWidth}px`, '--active-line-offset': `${activeLineOffset}px` }">
			<div class="tab-container" ref="tabElements" v-for="tab in props.tabs" @click.stop="activeTabId = tab.id">
				<template v-if="'label' in tab">{{ tab.label }}</template>
			</div>
		</div>

		<div class="tab-contents">
			<slot/>
		</div>
	</div>
</template>

<style lang="scss">
	.sdmx-tabs {
		display: flex;
		flex-flow: column nowrap;

		& > .tabs-container {
			// border: 1px solid red;
			display: flex;

			position: relative;

			&::after {
				height: 0px;
				width: var(--active-line-width);

				box-shadow: var(--focused-tab-shadow);
				border-bottom: 1px solid var(--focused-tab-color);

				position: absolute;
				bottom: 0;
				left: var(--active-line-offset);
				content: '';

				transition: left 200ms, width 200ms, opacity 200ms;
			}

			& > .tab-container {
				flex: 1 1 0;

				user-select: none;
				-webkit-user-select: none;
				cursor: pointer;

				display: flex;
				flex-flow: row nowrap;
				justify-content: center;
				align-items: center;
				padding: 0.75rem;

				&:hover {
					background-color: var(--tab-bg-hovered);
				}

				transition: background-color 100ms;
			}
		}
		& > .tab-contents {
			flex-grow: 1;
		}
	}
</style>
