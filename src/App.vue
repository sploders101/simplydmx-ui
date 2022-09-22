<script setup lang="ts">
	import { useRoute, useRouter } from "vue-router";
	import { computed } from "vue";

	const router = useRouter();
	const route = useRoute();

	const validRoutes = computed(() => {
		const routes = router.getRoutes();
		return routes.filter((route) => typeof route.name === "string" && route.meta?.icon);
	});
</script>

<template>
	<div class="app">
		<div class="app-sidebar">
			<Tooltip
				v-for="route in validRoutes"
				:text="(route.name as string)"
				placement="right"
				>
				<router-link :to="{ path: route.path }" :class="{ active: router.currentRoute.value.matched.includes(route) }"><Icon :i="route.meta!.icon!"/></router-link>
			</Tooltip>
		</div>
		<div class="content">
			<router-view/>
		</div>
	</div>
</template>

<style lang="scss">
	.app {
		display: flex;
		flex-flow: row nowrap;
		height: 100vh;
		width: 100vw;

		& > .app-sidebar {
			background-color: var(--sidebar-color);
			border-right: var(--layout-border);

			display: flex;
			flex-flow: column nowrap;
			align-items: center;
			padding: 0.5rem;
			gap: 0.5rem;
			width: 4rem;

			& a {
				display: flex;
				flex-flow: column nowrap;
				justify-content: center;
				align-items: center;
				width: 3rem;
				height: 3rem;
				background-color: var(--sidebar-link-background);
				border-radius: 0.5rem;

				transition: box-shadow 200ms;

				box-shadow: var(--unfocused-shadow);
				border: 1px solid var(--unfocused-border-color);
				&.active {
					box-shadow: var(--focused-shadow);
					border: 1px solid var(--focused-border-color);
				}

				& .sdmx-icon {
					width: 2rem;
					height: 2rem;
					path {
						fill: var(--sidebar-icon-color);
					}
				}
			}
		}
	}
</style>
