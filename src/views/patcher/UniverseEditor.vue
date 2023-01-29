<script lang="ts" setup>
	import { ref, watch, nextTick } from "vue";
	import { useUniverseState, waitForUniverseState } from "@/stores/universes";
	import DynamicForm from "@/components/forms/DynamicForm.vue";
	import {
		exhaustiveMatch,
		FormDescriptor,
		output_dmx,
	} from "@/scripts/api/ipc";
	import { unwrap, deepCompare } from "@/scripts/helpers";
	import { getDefaultFormData } from "@/components/forms/helpers";
	import { useTypeSpecState } from "@/stores/typespec";


	const props = defineProps<{
		selectedUniverse: string,
	}>();


	const universeState = useUniverseState();
	const driverOptions = useTypeSpecState("dmx_drivers_optional");

	function cancelEditingUniverse() {
		updateUniverseForm(props.selectedUniverse);
	}

	const driver = ref<string | null>(null);
	const name = ref<string>("");
	const editsMade = ref(false);

	const addUniverseForm = ref<[FormDescriptor, any] | null>(null);
	const formDataOriginal = ref<any>(null);
	watch(() => props.selectedUniverse, updateUniverseForm, { immediate: true });
	function updateUniverseForm(queryUniverse: string | null) {
		if (queryUniverse) {
			waitForUniverseState().then(() => {
				let universeInfo = universeState.value?.universe_list.find(([id]) => queryUniverse == id);
				if (!universeInfo) return; // This will almost always resolve itself one tick later.
				name.value = universeInfo[1];
				output_dmx.get_linked_controller(queryUniverse)
					.then((driverId) => {
						if (driver.value !== driverId) {
							driver.value = driverId;
						} else {
							updateDriver(driverId);
						}
						editsMade.value = false;
						nextTick(() => editsMade.value = false);
					});
			});
		} else {
			addUniverseForm.value = null;
			editsMade.value = false;
			nextTick(() => editsMade.value = false);
		}
	}

	watch(() => driver.value, updateDriver, { immediate: true });
	function updateDriver(queryDriver: string | null) {
		nextTick().then(() => {
			const userEdits = editsMade.value;
			const queryUniverse = props.selectedUniverse;
			if (queryDriver) {
				output_dmx.get_link_universe_form(queryDriver, queryUniverse)
					.then((formResult) => {
						if (props.selectedUniverse === queryUniverse && driver.value === queryDriver) {
							let formDescriptor = unwrap(formResult);
							let formData = getDefaultFormData(formDescriptor);
							formDataOriginal.value = getDefaultFormData(formDescriptor);
							addUniverseForm.value = [formDescriptor, formData];
							// Signal to other watchers that the new changes were not made by the user
							if (!userEdits) {
								editsMade.value = false;
								nextTick(() => editsMade.value = false);
							}
						}
					});
			} else {
				addUniverseForm.value = [[], {}];
				// Signal to other watchers that the new changes were not made by the user
				if (!userEdits) {
					editsMade.value = false;
					nextTick(() => editsMade.value = false);
				}
			}
		});
	}

	watch([driver, name, addUniverseForm], () => editsMade.value = true, { deep: true });

	const creationError = ref<{ header: string, body: string } | null>(null);

	/** Adds the universe  */
	async function editUniverse() {
		if (name.value && addUniverseForm.value) {
			let universeInfo = universeState.value?.universe_list.find(([id]) => props.selectedUniverse == id);
			if (!universeInfo) return creationError.value = {
				header: "Unknown universe",
				body: "The universe you selected could not be found. Please report this error.",
			}
			if (name.value !== universeInfo[1]) {
				await output_dmx.rename_universe(
					props.selectedUniverse,
					name.value,
				);
			}
			let response;
			if (deepCompare(addUniverseForm.value, formDataOriginal.value)) {
				// If the form data didn't change, don't update link
				response = { "Ok": null };
			} else if (driver.value !== null) {
				response = await output_dmx.link_universe(
					props.selectedUniverse,
					driver.value,
					addUniverseForm.value[1],
				);
			} else {
				await output_dmx.unlink_universe(props.selectedUniverse);
				response = { "Ok": null };
			}
			exhaustiveMatch(response, {
				"Ok": () => {
					creationError.value = {
						header: "Success!",
						body: "The universe was successfully updated.",
					};
					editsMade.value = false;
				},
				"Err": (err) => exhaustiveMatch(err, {
					"UniverseNotFound": () => creationError.value = {
						header: "Unknown universe",
						body: "The universe you selected could not be found. Please report this error.",
					},
					"ControllerNotFound": () => creationError.value = {
						header: "Unknown output driver",
						body: "The output driver you selected could not be found. Please report this error.",
					},
					"ErrorFromController": (err) => exhaustiveMatch(err, {
						"InvalidData": () => creationError.value = {
							header: "Form validation failed",
							body: "SimplyDMX failed to convert form data into a valid universe link.",
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
	<Textbox
		label="Name"
		v-model="name"
		class="spaced"
		/>

	<Dropdown
		label="DMX Driver"
		v-model="driver"
		:options="driverOptions || [{ name: 'Loading...', value: driver }]"
		class="spaced"
		/>

	<DynamicForm
		v-if="addUniverseForm"
		class="spaced"
		:form="{ VerticalStack: addUniverseForm[0] }"
		:formData="addUniverseForm[1]"
		/>
	
	<div v-if="editsMade" class="universe-editor__actions">
		<Button @click="cancelEditingUniverse()" subtle class="spaced">
			Cancel
		</Button>
		<div class="spacer"/>
		<Button @click="editUniverse()" class="spaced">
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
	.universe-editor__actions {
		display: flex;
		flex-flow: row nowrap;
	}
</style>
