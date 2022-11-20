import type { App } from "vue";
import Icon from "@/components/generic/icon.vue";
import Tooltip from "@/components/generic/tooltip.vue";
import Textbox from "@/components/generic/textbox.vue";
import Dropdown from "@/components/generic/dropdown.vue";
import Button from "@/components/generic/button.vue";
import Dialog from "@/components/generic/dialog.vue";
import Tabs from "@/components/generic/tabs.vue";
import Tabitem from "@/components/generic/tabitem.vue";

export interface CustomGlobalComponents {
	Icon: typeof Icon,
	Tooltip: typeof Tooltip,
	Textbox: typeof Textbox,
	Dropdown: typeof Dropdown,
	Button: typeof Button,
	Dialog: typeof Dialog,
	Tabs: typeof Tabs,
	Tabitem: typeof Tabitem,
}

const globalComponents: CustomGlobalComponents = {
	Icon,
	Tooltip,
	Textbox,
	Dropdown,
	Button,
	Dialog,
	Tabs,
	Tabitem,
};

export function registerGlobals(app: App<Element>) {
	Object.entries(globalComponents).forEach(([name, component]) => {
		app.component(name, component);
	});
}
