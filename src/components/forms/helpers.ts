import {
	FormItem,
	FormDescriptor,
	exhaustiveMatch,
} from "@/scripts/api/ipc";


export function getDefaultFormData(descriptor: FormDescriptor) {
	let data: any = {};

	function fillData(item: FormItem) {
		exhaustiveMatch(item, {
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
