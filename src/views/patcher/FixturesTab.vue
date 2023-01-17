<script lang="ts" setup>
	import { computed, ref, watch } from "vue";
	import { usePatcherState } from "@/stores/patcher";
	import DynamicForm from "@/components/forms/DynamicForm.vue";
	import {
		exhaustiveMatch,
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
	const personalityOptions = computed(() => {
		if (!state.value) return [];
		if (!fixtureToAdd.value) return [];
		return Object.keys(state.value.library[fixtureToAdd.value].personalities).map<Option>((key) => ({
			name: key,
			value: key,
		}));
	})

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
		personality.value = null;
		name.value = "";
	}

	const fixtureToAdd = ref<string | null>(null);
	const personality = ref<string | null>(null);
	const name = ref<string>("");

	const addFixtureForm = ref<[FormDescriptor, any] | null>(null);
	watch(fixtureToAdd, (queryFixture) => {
		if (queryFixture) {
			patcher.get_creation_form(queryFixture)
				.then((formResult) => {
					if (fixtureToAdd.value === queryFixture) {
						let formDescriptor = unwrap(formResult);
						let formData = getDefaultFormData(formDescriptor);
						addFixtureForm.value = [formDescriptor, formData];
					}
				});
		} else {
			addFixtureForm.value = null;
		}
	});

	const creationError = ref<{ header: string, body: string } | null>(null);

	/** Adds the fixture  */
	async function addFixture() {
		if (fixtureToAdd.value && personality.value && name.value && addFixtureForm.value) {
			let response = await patcher.create_fixture(
				fixtureToAdd.value,
				personality.value,
				name.value,
				"",
				addFixtureForm.value[1],
			);
			exhaustiveMatch(response, {
				"Ok": () => cancelAddingFixture(),
				"Err": (err) => exhaustiveMatch(err, {
					"ControllerMissing": () => creationError.value = {
						header: "An error occurred",
						body: "SimplyDMX does not know how to control this fixture. Please make sure any relevant plugins have been loaded.",
					},
					"FixtureTypeMissing": () => creationError.value = {
						header: "An error occurred",
						body: "SimplyDMX does not recognize the requested fixture. Please file a bug report with the author.",
					},
					"ErrorFromController": (err) => exhaustiveMatch(err, {
						"InvalidData": () => creationError.value = {
							header: "Form validation failed",
							body: "SimplyDMX failed to convert form data into a valid fixture definition.",
						},
						"Other": (description) => creationError.value = {
							header: "Something went wrong",
							body: description,
						},
						"Unknown": () => creationError.value = {
							header: "An error occurred",
							body: "Unknown error",
						},
					}),
				}),
			});
		} else {
			alert("Invalid form details");
		}
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

		<Dialog :visible="addFixtureDialog" :show-close="false">
			<template #header>
				Add Fixture
			</template>

			<Dropdown
				label="Fixture Type"
				v-model="fixtureToAdd"
				:options="fixtureTypes"
				class="spaced"
				/>

			<Dropdown
				label="Personality"
				v-model="personality"
				:options="personalityOptions"
				class="spaced"
				/>

			<Textbox
				label="Name"
				v-model="name"
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
		<Dialog :visible="!!creationError">
			<template #header>
				{{ creationError && creationError.header }}
			</template>
			{{ creationError && creationError.body }}
			<template #footer>
				<div class="spacer"/>
				<Button @click="creationError = null" subtle class="spaced">
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
