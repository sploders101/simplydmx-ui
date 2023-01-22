<script lang="ts" setup>
	import { computed, ref, watch, nextTick } from "vue";
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


	const props = defineProps<{
		selectedFixture: string,
	}>();


	const patcherState = usePatcherState();
	const personalityOptions = computed(() => {
		if (!patcherState.value) return [];
		let fixture = patcherState.value.fixtures[props.selectedFixture];
		return Object.keys(patcherState.value.library[fixture.fixture_id].personalities).map<Option>((key) => ({
			name: key,
			value: key,
		}));
	});

	function cancelEditingFixture() {
		personality.value = null;
		name.value = "";
	}

	const personality = ref<string | null>(null);
	const name = ref<string>("");

	const addFixtureForm = ref<[FormDescriptor, any] | null>(null);
	watch(() => props.selectedFixture, (queryFixture) => {
		if (queryFixture) {
			let fixture = patcherState.value?.fixtures[queryFixture];
			personality.value = fixture?.personality || null;
			name.value = fixture?.name || "";
			patcher.get_edit_form(queryFixture)
				.then((formResult) => {
					if (props.selectedFixture === queryFixture) {
						let formDescriptor = unwrap(formResult);
						let formData = getDefaultFormData(formDescriptor);
						addFixtureForm.value = [formDescriptor, formData];
						nextTick(() => editsMade.value = false);
					}
				});
		} else {
			addFixtureForm.value = null;
			editsMade.value = false;
		}
	}, { immediate: true });

	const editsMade = ref(false);
	watch([personality, name, addFixtureForm], () => editsMade.value = true, { deep: true });

	const creationError = ref<{ header: string, body: string } | null>(null);

	/** Adds the fixture  */
	async function editFixture() {
		if (personality.value && name.value && addFixtureForm.value) {
			let response = await patcher.edit_fixture(
				props.selectedFixture,
				personality.value,
				name.value,
				"",
				addFixtureForm.value[1],
			);
			exhaustiveMatch(response, {
				"Ok": () => {
					creationError.value = {
						header: "Success!",
						body: "The fixture was successfully updated.",
					};
					editsMade.value = false;
				},
				"Err": (err) => exhaustiveMatch(err, {
					"ControllerMissing": () => creationError.value = {
						header: "An error occurred",
						body: "SimplyDMX does not know how to control this fixture. Please make sure any relevant plugins have been loaded.",
					},
					"FixtureTypeMissing": () => creationError.value = {
						header: "An error occurred",
						body: "SimplyDMX does not recognize the requested fixture. Please file a bug report with the author.",
					},
					"FixtureMissing": () => "The requested fixture does not exist",
					"ErrorFromController": (err) => exhaustiveMatch(err, {
						"InvalidData": () => creationError.value = {
							header: "Form validation failed",
							body: "SimplyDMX failed to convert form data into a valid fixture definition.",
						},
						"Other": (description) => creationError.value = {
							header: "Something went wrong",
							body: description,
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
	
	<div v-if="editsMade" class="fixture-editor__actions">
		<Button @click="cancelEditingFixture()" subtle class="spaced">
			Cancel
		</Button>
		<div class="spacer"/>
		<Button @click="editFixture()" class="spaced">
			Ok
		</Button>
	</div>
	<Dialog
		:visible="!!creationError"
		@close-clicked="creationError = null"
		>
		<template #header>
			{{ creationError && creationError.header }}
		</template>
		{{ creationError && creationError.body }}
		<template #footer>
			<div class="spacer"/>
			<Button @click="creationError = null" class="spaced">
				Ok
			</Button>
		</template>
	</Dialog>
</template>

<style lang="scss">
	.fixture-editor__actions {
		display: flex;
		flex-flow: row nowrap;
	}
</style>
