<script setup lang="ts">
	import FixturesTab from "./FixturesTab.vue";
</script>

<template>
	<Tabs class="patcher-view" :tabs="[ { label:'Fixtures', id:'fixtures' }, { label:'Universes', id:'universes' } ]">
		<Tabitem tab="fixtures" class="patcher-add-tab-container">
			<FixturesTab/>
		</Tabitem>
		<Tabitem tab="universes">
		</Tabitem>
	</Tabs>
</template>

<style lang="scss">
	.patcher-view {
		height: 100%;
		width: 100%;
		
		.patcher-add-tab-container {
			width: 100%;
			height: 100%;
		}
	}
</style>
