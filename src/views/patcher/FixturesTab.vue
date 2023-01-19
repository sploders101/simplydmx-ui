<script lang="ts" setup>
	import { computed, ref } from "vue";
	import { usePatcherState } from "@/stores/patcher";
	import CreateFixtureDialog from "./CreateFixtureDialog.vue";

	const state = usePatcherState();
	const lightOptions = computed(() => {
		if (!state.value) return [];
		return state.value.fixture_order.map((value) => {
			const fixture = state.value!.fixtures[value];
			return {
				label: fixture.name || fixture.id,
				value: fixture.id,
			};
		});
	});

	const selectedFixture = ref(null);
	const addFixtureDialog = ref(false);
</script>

<template>
	<div class="patcher-add">
		<LargeSelect
			class="patcher-left-sidebar"
			v-model="selectedFixture"
			:options="lightOptions"
			enable-search
			>
			<template #header-right>
				<Tooltip text="Add Fixture">
					<Button @click="addFixtureDialog = true" icon subtle><Icon i="plus"/></Button>
				</Tooltip>
			</template>
		</LargeSelect>
		<div class="patcher-fixture-prefs">
		</div>
		<CreateFixtureDialog v-model:visible="addFixtureDialog" />
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
