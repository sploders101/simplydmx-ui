import {
	FormItem,
	FormDescriptor,
	InteractiveDescription,
	NumberValidation,
	exhaustiveMatch,
} from "@/scripts/api/ipc";


export function getDefaultFormData(descriptor: FormDescriptor) {
	let data: any = {};

	function fillData(item: FormItem) {
		exhaustiveMatch(item, {
			"Dynamic": (item) => item[1].forEach(fillData),
			"Textbox": (item) => data[item.id] = "",
			"Number": (item) => data[item.id] = 0,
			"Dropdown": (item) => data[item.id] = null,
			"Section": (item) => fillData(item.form_item),
			"HorizontalStack": (item) => item.forEach(fillData),
			"VerticalStack": (item) => item.forEach(fillData),
		});
	}
	descriptor.forEach(fillData);

	return data;
}

export function checkDynamic(formData: any, conditions: InteractiveDescription): boolean {
	return exhaustiveMatch(conditions, {
		"And": (item) => !item.some((item) => !checkDynamic(formData, item)),
		"Or": (item) => item.some((item) => checkDynamic(formData, item)),
		"Not": (item) => !checkDynamic(formData, item),
		"Equal": (item) => formData[item.field_name] === item.value,
	});
}

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
