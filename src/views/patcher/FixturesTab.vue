<script lang="ts" setup>
	import { computed, ref, watch } from "vue";
	import { usePatcherState } from "@/stores/patcher";
	import DynamicForm from "@/components/forms/DynamicForm.vue";
	import {
		FormDescriptor,
		patcher,
	} from "@/scripts/api/ipc";
	import { Option } from "@/components/generic/dropdown.vue";
	import { unwrap } from "@/scripts/helpers";
	import { getDefaultFormData } from "@/components/forms/helpers";

	const state = usePatcherState();
	const fixtureTypes = computed<Option[]>(() => {
		if (!state.value) return [];

		return Object.values(state.value.library).map((info) => {
			return {
				name: info.name,
				value: info.id,
			};
		});
	});
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

	const selectedFixture = ref<string | null>(null);

	watch(lightOptions, () => {
		if (lightOptions.value.length && !lightOptions.value.find((item) => item.value === selectedFixture.value)) {
			selectedFixture.value = lightOptions.value[0].value;
		}
	}, { immediate: true });

	const addFixtureDialog = ref<boolean>(false);
	function cancelAddingFixture() {
		addFixtureDialog.value = false;
		fixtureToAdd.value = null;
	}

	const fixtureToAdd = ref<string | null>(null);

	const addFixtureForm = ref<[FormDescriptor, any] | null>(null);
	watch(fixtureToAdd, (queryFixture) => {
		if (queryFixture) {
			patcher.get_creation_form(queryFixture)
				.then((formResult) => {
					if (fixtureToAdd.value === queryFixture) {
						let formDescriptor = unwrap(formResult);
						let formData = getDefaultFormData(formDescriptor);
						console.log([formDescriptor, formData]);
						addFixtureForm.value = [formDescriptor, formData];
					}
				});
		} else {
			addFixtureForm.value = null;
		}
	});

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

			<Dropdown
				label="Fixture Type"
				v-model="fixtureToAdd"
				:options="fixtureTypes"
				class="spaced"
				/>

			<DynamicForm
				v-if="addFixtureForm"
				class="spaced"
				:form="{ VerticalStack: addFixtureForm[0] }"
				:formData="addFixtureForm[1]"
				/>
			
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
