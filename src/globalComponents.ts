import type { App } from "vue";
import Icon from "@/components/generic/icon.vue";
import Tooltip from "@/components/generic/tooltip.vue";
import Textbox from "@/components/generic/textbox.vue";
import Dropdown from "@/components/generic/dropdown.vue";
import Button from "@/components/generic/button.vue";
import Dialog from "@/components/generic/dialog.vue";
import Tabs from "@/components/generic/tabs.vue";
import Tabitem from "@/components/generic/tabitem.vue";
import LargeSelect from "@/components/generic/largeselect.vue";

const globalComponents = {
	Icon,
	Tooltip,
	Textbox,
	Dropdown,
	Button,
	Dialog,
	Tabs,
	Tabitem,
	LargeSelect,
};
export type CustomGlobalComponents = typeof globalComponents;

export function registerGlobals(app: App<Element>) {
	Object.entries(globalComponents).forEach(([name, component]) => {
		app.component(name, component);
	});
}
