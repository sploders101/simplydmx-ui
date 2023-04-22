<script lang="ts">
	import {
		mdiHome,
		mdiTuneVerticalVariant,
		mdiChevronDown,
		mdiChevronUp,
		mdiSpotlightBeam,
		mdiClose,
		mdiPlus,
		mdiArrowDownLeft,
	} from "@mdi/js";

	const paths = {
		home: mdiHome,
		xlr5: "M12,2c-5.5,0 -10,4.5 -10,10c0,5.5 4.5,10 10,10c5.5,0 10,-4.5 10,-10c0,-5.5 -4.5,-10 -10,-10Zm0,2c4.41,0 8,3.59 8,8c0,4.41 -3.59,8 -8,8c-4.41,0 -8,-3.59 -8,-8c0,-4.41 3.59,-8 8,-8Zm1.5,13.5c0,-0.83 -0.67,-1.5 -1.5,-1.5c-0.83,0 -1.5,0.67 -1.5,1.5c0,0.83 0.67,1.5 1.5,1.5c0.83,0 1.5,-0.67 1.5,-1.5Zm-3.5,-1.5c0,-0.83 -0.67,-1.5 -1.5,-1.5c-0.83,0 -1.5,0.67 -1.5,1.5c0,0.83 0.67,1.5 1.5,1.5c0.83,0 1.5,-0.67 1.5,-1.5Zm7,0c0,-0.83 -0.67,-1.5 -1.5,-1.5c-0.83,0 -1.5,0.67 -1.5,1.5c0,0.83 0.67,1.5 1.5,1.5c0.83,0 1.5,-0.67 1.5,-1.5Zm-9,-4c0,-0.83 -0.67,-1.5 -1.5,-1.5c-0.83,0 -1.5,0.67 -1.5,1.5c0,0.83 0.67,1.5 1.5,1.5c0.83,0 1.5,-0.67 1.5,-1.5Zm11,0c0,-0.83 -0.67,-1.5 -1.5,-1.5c-0.83,0 -1.5,0.67 -1.5,1.5c0,0.83 0.67,1.5 1.5,1.5c0.83,0 1.5,-0.67 1.5,-1.5Z",
		midi: mdiTuneVerticalVariant,
		chevronDown: mdiChevronDown,
		chevronUp: mdiChevronUp,
		stageLight: mdiSpotlightBeam,
		close: mdiClose,
		plus: mdiPlus,
		arrowDownLeft: mdiArrowDownLeft,
	} as const;

	export type IconPath = keyof typeof paths;
</script>

<script lang="ts" setup>
	const props = defineProps<{
		i: keyof typeof paths,
	}>();
</script>

<template>
	<svg class="sdmx-icon" viewBox="0 0 24 24">
		<path :d="paths[props.i]" />
	</svg>
</template>

<style lang="scss">
	.sdmx-icon {
		fill: var(--text-color);
	}
</style>
