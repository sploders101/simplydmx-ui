<script lang="ts" setup>
	import { ref } from "vue";
	import CreateUniverseDialog from "./CreateUniverseDialog.vue";
	import UniverseEditor from "./UniverseEditor.vue";
	import { useTypeSpecState } from "@/stores/typespec";

	const universeOptions = useTypeSpecState("universes");

	const selectedUniverse = ref(null);
	const addUniverseDialog = ref(false);
</script>

<template>
	<div class="patcher-add">
		<LargeSelect
			class="patcher-left-sidebar"
			v-model="selectedUniverse"
			:options="universeOptions || []"
			enable-search
			>
			<template #header-right>
				<Tooltip text="Add Universe">
					<Button @click="addUniverseDialog = true" icon subtle><Icon i="plus"/></Button>
				</Tooltip>
			</template>
		</LargeSelect>
		<div class="patcher-universe-prefs">
			<UniverseEditor v-if="selectedUniverse" :selectedUniverse="selectedUniverse" />
		</div>
		<CreateUniverseDialog v-model:visible="addUniverseDialog" />
	</div>
</template>

<style lang="scss">
	.patcher-add {
		width: 100%;
		height: 100%;
		
		display: flex;
		flex-flow: row nowrap;

		.patcher-left-sidebar {
		    height: 100%;
		    max-width: 20rem;
		    min-width: 15rem;
		    width: 25%;
		}

		.patcher-universe-prefs {
			flex-grow: 1;

			display: flex;
			flex-flow: column nowrap;
		}
	}
</style>
