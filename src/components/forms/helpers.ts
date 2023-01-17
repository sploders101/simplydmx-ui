import {
	FormItem,
	FormDescriptor,
	InteractiveDescription,
	NumberValidation,
	exhaustiveMatch,
} from "@/scripts/api/ipc";


/** Gets the default form data for a newly-created form, using backend-provided values whenever specified */
export function getDefaultFormData(descriptor: FormDescriptor) {
	let data: any = {};

	function fillData(item: FormItem) {
		exhaustiveMatch(item, {
			"Dynamic": (item) => item[1].forEach(fillData),
			"Textbox": (item) =>
				typeof item.value === "string"
					? data[item.id] = item.value
					: data[item.id] = "",
			"Number": (item) =>
				typeof item.value === "number"
					? data[item.id] = item.value
					: data[item.id] = 0,
			"Dropdown": (item) =>
				typeof item.value !== "undefined"
					? data[item.id] = item.value
					: data[item.id] = null,
			"Section": (item) => fillData(item.form_item),
			"HorizontalStack": (item) => item.forEach(fillData),
			"VerticalStack": (item) => item.forEach(fillData),
		});
	}
	descriptor.forEach(fillData);

	return data;
}

/** Checks whether or not a dynamic field should be visible */
export function checkDynamic(formData: any, conditions: InteractiveDescription): boolean {
	return exhaustiveMatch(conditions, {
		"And": (item) => !item.some((item) => !checkDynamic(formData, item)),
		"Or": (item) => item.some((item) => checkDynamic(formData, item)),
		"Not": (item) => !checkDynamic(formData, item),
		"Equal": (item) => formData[item.field_name] === item.value,
	});
}

/** Validates a number field, returning true if the entry is valid, and false otherwise */
export function checkNumberValidation(value: number, validation: NumberValidation): boolean {
	return exhaustiveMatch(validation, {
		"None": () => true,
		"And": (items) => !items.some((item) => !checkNumberValidation(value, item)),
		"Or": (items) => items.some((item) => checkNumberValidation(value, item)),
		"Not": (item) => !checkNumberValidation(value, item),
		"Between": ([start, end]) => value >= start && value <= end,
		"DivisibleBy": (item) => value % item === 0,
	});
}

export function validateForm(form: Readonly<FormItem>, formData: Record<string, any>): boolean {
	// This function returns a promise for future compatability once dropdown validation is added.
	return exhaustiveMatch(form, {
		"Dynamic": (item) => {
			// Only validate if the item is visible
			if (checkDynamic(formData, item[0])) {
				return validateForm(form, item[1]);
			} else return true;
		},
		"Textbox": () => true,
		"Number": (item) => checkNumberValidation(formData[item.id], item.validation),
		"Dropdown": () => true,
		"Section": (item) => validateForm(item.form_item, formData),
		"HorizontalStack": (item) => !item.some((item) => !validateForm(item, formData)),
		"VerticalStack": (item) => !item.some((item) => !validateForm(item, formData)),
	});
}
