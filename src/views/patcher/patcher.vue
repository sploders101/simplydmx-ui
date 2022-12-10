<script setup lang="ts">
	import { computed } from "vue";
	import { usePatcherState } from "@/stores/patcher";
	import FixturesTab from "./FixturesTab.vue";

	const state = usePatcherState();

	const stringifiedData = computed(() => {
		return JSON.stringify(state.value);
	});
</script>

<template>
	<Tabs class="patcher-view" :tabs="[ { label:'Fixtures', id:'fixtures' }, { label:'Universes', id:'universes' } ]">
		<Tabitem tab="fixtures" class="patcher-add-tab-container">
			<FixturesTab/>
		</Tabitem>
		<Tabitem tab="universes">
			<!--<LargeSelect :options="[1, 2, 3, 4, 5].map((i) => ({ label: 'Test ' + i, value: i}))" @select="log" enableSearch>
				<template #header-right>
					<Tooltip text="Add Fixture">
						<Button icon subtle><Icon i="plus"/></Button>
					</Tooltip>
				</template>
			</LargeSelect>-->
		</Tabitem>
	</Tabs>
</template>

<style lang="scss">
	.patcher-view {
		height: 100%;
		width: 100%;
		
		.patcher-add-tab-container {
			width: 100%;
			height: 100%;
		}
	}
</style>
