<script lang="ts" setup>
	import { randomId } from "@/scripts/random";
	import { computePosition, flip, offset,  } from "@floating-ui/dom";
	import { reactive, ref } from "vue";

	const tooltipId = randomId();

	const props = defineProps<{
		text: string,
		placement?: "top" | "bottom" | "left" | "right",
	}>();

	const tooltip = ref<HTMLDivElement | null>(null);
	const tooltipWrapper = ref<HTMLDivElement | null>(null);

	const tooltipData = reactive({
		visible: false,
		x: 0,
		y: 0,
	});

	function showTooltip(show: boolean) {
		tooltipData.visible = show;
		updateTooltip();
	}

	function updateTooltip() {
		computePosition(tooltipWrapper.value!, tooltip.value!, {
			placement: props.placement,
			middleware: [flip(), offset({
				mainAxis: 10,
			})],
			strategy: "fixed",
		})
		.then(({ x, y }) => {
			tooltipData.x = x;
			tooltipData.y = y;
		});
	}
</script>

<template>
	<div
		ref="tooltipWrapper"
		class="tooltip-wrapper"
		@mouseenter="showTooltip(true)"
		@mouseleave="showTooltip(false)"
		@mousemove="updateTooltip()"
		@touchstart="showTooltip(true)"
		@touchend="showTooltip(false)"
		:aria-describedby="tooltipId"
		>
		<slot/>
	</div>
	<Teleport to="body">
		<div
			ref="tooltip"
			:id="tooltipId"
			class="tooltip"
			role="tooltip"
			:class="{ 'visible': tooltipData.visible }"
			:style="{ 'left': `${Math.round(tooltipData.x)}px`, 'top': `${Math.round(tooltipData.y)}px` }"
			>
			{{ props.text }}
		</div>
	</Teleport>
</template>

<style lang="scss" scoped>
	.tooltip {
		background-color: var(--tooltip-background);
		backdrop-filter: var(--tooltip-backdrop-filter);
		-webkit-backdrop-filter: var(--tooltip-backdrop-filter);
		color: var(--tooltip-text-color);
		pointer-events: none;
		border-radius: var(--border-radius-tooltip);
		padding: 0.2rem;
		position: fixed;
		top: 0;
		left: 0;

		opacity: 0;

		&.visible {
			opacity: 1;
		}

		transition: opacity 200ms;
	}
</style>
