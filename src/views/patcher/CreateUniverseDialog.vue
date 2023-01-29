<script lang="ts" setup>
	import { ref, watch } from "vue";
	import { useUniverseState } from "@/stores/universes";
	import DynamicForm from "@/components/forms/DynamicForm.vue";
	import {
		exhaustiveMatch,
		FormDescriptor,
		output_dmx,
	} from "@/scripts/api/ipc";
	import { unwrap } from "@/scripts/helpers";
	import { getDefaultFormData } from "@/components/forms/helpers";
	import { useTypeSpecState } from "@/stores/typespec";


	const props = defineProps<{
		visible: boolean;
	}>();
	const emit = defineEmits<
		(e: "update:visible", visible: boolean) => void
	>();

	const universeState = useUniverseState();
	const driverOptions = useTypeSpecState("dmx_drivers_optional");

	function cancelAddingUniverse() {
		driver.value = null;
		name.value = "";
		emit("update:visible", false);
	}

	const driver = ref<string | null>(null);
	const name = ref<string>("");

	const addUniverseForm = ref<[FormDescriptor, any] | null>(null);

	watch(() => driver.value, (queryDriver) => {
		if (queryDriver) {
			output_dmx.get_link_universe_form(queryDriver, null)
				.then((formResult) => {
					if (driver.value === queryDriver) {
						let formDescriptor = unwrap(formResult);
						let formData = getDefaultFormData(formDescriptor);
						addUniverseForm.value = [formDescriptor, formData];
					}
				});
		} else {
			addUniverseForm.value = [[], {}];
		}
	}, { immediate: true });

	const creationError = ref<{ header: string, body: string } | null>(null);

	/** Adds the universe  */
	async function addUniverse() {
		if (name.value && addUniverseForm.value) {
			let universe_id = await output_dmx.create_universe(name.value);
			if (driver.value) {
				let response = await output_dmx.link_universe(
					universe_id,
					driver.value,
					addUniverseForm.value[1],
				);
				exhaustiveMatch(response, {
					"Ok": () => {
						creationError.value = {
							header: "Success!",
							body: "The universe was successfully updated.",
						};
						emit("update:visible", false);
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
				creationError.value = {
					header: "Success!",
					body: "The universe was successfully updated.",
				};
				emit("update:visible", false);
			}
		} else {
			alert("Invalid form details");
		}
	}
</script>

<template>
	<Dialog :visible="props.visible" :show-close="false">
		<template #header>
			Add Universe
		</template>

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
		
		<template #footer>
			<Button @click="cancelAddingUniverse()" subtle class="spaced">
				Cancel
			</Button>
			<div class="spacer"/>
			<Button @click="addUniverse()" class="spaced">
				Ok
			</Button>
		</template>
	</Dialog>
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
