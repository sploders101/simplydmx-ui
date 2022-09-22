import type { App } from "vue";
import Icon from "@/components/generic/icon.vue";
import Tooltip from "@/components/generic/tooltip.vue";
import Textbox from "@/components/generic/textbox.vue";
import Dropdown from "@/components/generic/dropdown.vue";

export interface CustomGlobalComponents {
	Icon: typeof Icon,
	Tooltip: typeof Tooltip,
	Textbox: typeof Textbox,
	Dropdown: typeof Dropdown,
}

const globalComponents: CustomGlobalComponents = {
	Icon,
	Tooltip,
	Textbox,
	Dropdown,
};

export function registerGlobals(app: App<Element>) {
	Object.entries(globalComponents).forEach(([name, component]) => {
		app.component(name, component);
	});
}
