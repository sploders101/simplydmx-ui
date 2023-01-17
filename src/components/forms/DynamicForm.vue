<script lang="ts" setup>
	import { computed, PropType } from "vue";
	import {
		FormItem,
		ExhaustiveFlag,
		exhaustiveMatch,
	} from "@/scripts/api/ipc";
	import { useTypeSpecState } from "@/stores/typespec";
	import DynamicForm from "./DynamicForm.vue";
	import {
		checkDynamic,
		checkNumberValidation,
	} from "./helpers";


	const props = defineProps({
		form: { type: Object as PropType<Readonly<FormItem>>, required: true },
		formData: { type: Object as PropType<Record<string, any>>, required: true },
	});

	// This enum should reflect the form objects that have been implemented.
	// If a new branch is added to or removed from `FormItem`, this will throw
	// an error to indicate the code is incomplete.
	type _ExhaustiveFormCheck = ExhaustiveFlag<FormItem, {
		"Dynamic": any,
		"Textbox": any,
		"Number": any,
		"Dropdown": any,
		"Section": any,
		"VerticalStack": any,
		"HorizontalStack": any,
	}>;

	type SpecificItem<TypeKey extends string, T = Readonly<FormItem>> =
		T extends { [K in TypeKey]: any } ? T : never;

	const typeSpecOptions = useTypeSpecState((): string | null => {
		if ("Dropdown" in props.form) {
			if ("TypeSpec" in props.form.Dropdown.item_source) {
				return props.form.Dropdown.item_source.TypeSpec.typespec_id;
			}
		}
		return null;
	});

	const dropdownOptions = computed(() => {
		if (!('Dropdown' in props.form)) return [];
		return exhaustiveMatch(props.form.Dropdown.item_source, {
			"Static": (staticOptions) => staticOptions.values,
			"TypeSpec": () => typeSpecOptions.value || [],
		});
	});
</script>

<template>

	<template v-if="'Dynamic' in props.form && checkDynamic(props.formData, props.form.Dynamic[0])">
		<DynamicForm v-for="formItem in props.form.Dynamic[1]" :form="formItem" :formData="props.formData" />
	</template>

	<Textbox
		v-else-if="'Textbox' in props.form"
		:label="props.form.Textbox.label"
		v-model="props.formData[props.form.Textbox.id]"
		/>

	<NumberInput
		v-else-if="'Number' in props.form"
		:label="props.form.Number.label"
		v-model="props.formData[props.form.Number.id]"
		:error="!checkNumberValidation(props.formData[props.form.Number.id], props.form.Number.validation)"
		/>

	<Dropdown
		v-else-if="'Dropdown' in props.form"
		:label="props.form.Dropdown.label"
		v-model="props.formData[props.form.Dropdown.id]"
		:options="dropdownOptions"
		:error="
			dropdownOptions.some((item) =>
				item.value === props.formData[(props.form as SpecificItem<'Dropdown'>).Dropdown.id])
					? null
					: 'Required'
		"
		/>

	<div class="dynamic-form__section" v-else-if="'Section' in props.form">
		<div class="dynamic-form__section-header">
			{{ props.form.Section.label }}
		</div>
		<div class="dynamic-form__section-content">
			<DynamicForm
				:form="props.form.Section.form_item"
				:formData="props.formData"
				/>
		</div>
	</div>

	<div class="dynamic-form__stack vertical" v-else-if="'VerticalStack' in props.form">
		<DynamicForm
			v-for="formItem in props.form.VerticalStack"
			:form="formItem"
			:formData="props.formData"
			/>
	</div>

	<div class="dynamic-form__stack horizontal" v-else-if="'HorizontalStack' in props.form">
		<DynamicForm
			v-for="formItem in props.form.HorizontalStack"
			:form="formItem"
			:formData="props.formData"
			/>
	</div>

</template>

<style lang="scss">
	.dynamic-form__section {

		background-color: var(--additive-surface-shading);
		border: 1px solid var(--unfocused-border-color);
		border-radius: var(--border-radius);
		padding: 0.75rem;

		& > .dynamic-form__section-header {
			display: inline-block;
			border-right: 1px solid var(--unfocused-border-color);
			border-bottom: 1px solid var(--unfocused-border-color);
			margin-top: -0.75rem;
			margin-left: -0.75rem;
			border-bottom-right-radius: var(--border-radius);
			padding: 0.75rem;
			color: var(--header-color);
			margin-bottom: 0.75rem;
		}
		& > .dynamic-form__section-content {
		}
	}

	.dynamic-form__stack, .dynamic-form__stack {
		display: flex;
		gap: 0.75rem;

		&.vertical {
			flex-flow: column nowrap;
		}

		&.horizontal {
			flex-flow: row nowrap;

			& > * {
				flex: 1 1 0;
			}
		}
	}
</style>
