<script lang="ts" setup>
	import { computed, ref, watch } from "vue";
	import { usePatcherState } from "@/stores/patcher";
	import DynamicForm from "@/components/forms/DynamicForm.vue";
	import {
		patcher,
	} from "@/scripts/api/ipc";

	const state = usePatcherState();
	const lightOptions = computed(() => {
		console.log(state.value);
		if (!state.value) return [];
		return state.value.fixture_order.map((value) => {
			const fixture = state.value!.fixtures[value];
			return {
				label: fixture.name || fixture.id,
				value: fixture.id,
			};
		});
	});

	const selectedFixture = ref<string | null>(null);

	watch(lightOptions, () => {
		if (lightOptions.value.length && !lightOptions.value.find((item) => item.value === selectedFixture.value)) {
			selectedFixture.value = lightOptions.value[0].value;
		}
	}, { immediate: true });

	const addFixtureDialog = ref<boolean>(false);
	const newFixtureData = ref<null>(null);
	function cancelAddingFixture() {
		addFixtureDialog.value = false;
		newFixtureData.value = null;
	}

	/** Adds the fixture  */
	function addFixture() {
		return
	}
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

		<Dialog :visible="addFixtureDialog">
			<template #header>
				Add Fixture
			</template>
			
			<template #footer>
				<Button @click="cancelAddingFixture()" subtle class="spaced">
					Cancel
				</Button>
				<div class="spacer"/>
				<Button @click="addFixture()" class="spaced">
					Ok
				</Button>
			</template>
		</Dialog>
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
