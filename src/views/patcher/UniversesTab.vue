<script lang="ts" setup>
	import { computed, ref } from "vue";
	import { useUniverseState } from "@/stores/universes";
	import CreateFixtureDialog from "./CreateFixtureDialog.vue";
	import FixtureEditor from "./FixtureEditor.vue";

	const state = useUniverseState();
	const universeOptions = computed(() => {
		if (!state.value) return [];
		return state.value.universe_list.map(([universe_id, universe_name]) => {
			return {
				label: universe_name,
				value: universe_id,
			};
		});
	});

	const selectedUniverse = ref(null);
	const addUniverseDialog = ref(false);
</script>

<template>
	<div class="patcher-add">
		<LargeSelect
			class="patcher-left-sidebar"
			v-model="selectedUniverse"
			:options="universeOptions"
			enable-search
			>
			<template #header-right>
				<Tooltip text="Add Fixture">
					<Button @click="addUniverseDialog = true" icon subtle><Icon i="plus"/></Button>
				</Tooltip>
			</template>
		</LargeSelect>
		<div class="patcher-fixture-prefs">
			<FixtureEditor v-if="selectedUniverse" :selectedFixture="selectedUniverse" />
		</div>
		<CreateFixtureDialog v-model:visible="addUniverseDialog" />
	</div>
</template>

<style lang="scss">
	.patcher-add {
		width: 100%;
		height: 100%;
		
		display: flex;
		flex-flow: row nowrap;

		.patcher-left-sidebar {
		    height: 100%;
		    max-width: 20rem;
		    min-width: 15rem;
		    width: 25%;
		}

		.patcher-fixture-prefs {
			flex-grow: 1;

			display: flex;
			flex-flow: column nowrap;
		}
	}
</style>
