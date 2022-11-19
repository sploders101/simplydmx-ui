<script setup lang="ts">
	import {  } from "vue";

	const props = defineProps<{
		visible: boolean,
		showClose?: boolean,
	}>();

	const emit = defineEmits<{
		(e: "modal-clicked"): void,
		(e: "close-clicked"): void,
	}>();
</script>

<template>
	<Teleport to="body">
		<Transition name="sdmx-dialog-fade">
			<div v-if="props.visible" class="sdmx-dialog__modal" @click.stop="emit('modal-clicked')">
				<div class="sdmx-dialog" @click.stop>
					<div class="sdmx-dialog__header" v-if="$slots.header || props.showClose">
						<slot name=header />
						<div class="spacer"/>
						<Button subtle icon class="close-btn" @click="emit('close-clicked')" v-if="props.showClose">
							<Icon i="close" class="close-btn" />
						</Button>
					</div>
					<div class="sdmx-dialog__content" v-if="$slots.default">
						<slot />
					</div>
					<div class="sdmx-dialog__footer" v-if="$slots.footer">
						<slot name="footer" />
					</div>
				</div>
			</div>
		</Transition>
	</Teleport>
</template>

<style lang="scss">
	.sdmx-dialog__modal {
		position: fixed;
		top: 0;
		left: 0;
		height: 100vh;
		width: 100vw;

		display: flex;
		flex-flow: column nowrap;
		justify-content: center;
		align-items: center;

		background: var(--dialog-modal-background);
		backdrop-filter: var(--dialog-modal-filter);
		-webkit-backdrop-filter: var(--dialog-modal-filter);
	}

	.sdmx-dialog-fade-enter-from, .sdmx-dialog-fade-leave-to {
		opacity: 0;
	}
	.sdmx-dialog-fade-enter-active, .sdmx-dialog-fade-leave-active {
		transition: opacity 200ms;
	}

	.sdmx-dialog {
		background: var(--dialog-background);
		border: 1px solid var(--dialog-border-color);
		box-shadow: var(--dialog-box-shadow);
		border-radius: 1rem;

		& > .sdmx-dialog__header {
			padding: 1.25rem;
			padding-bottom: 1rem;
			font-size: 1.5rem;
			font-weight: 500;
			border-bottom: 1px solid var(--dialog-border-color);

			user-select: none;
			-webkit-user-select: none;

			display: flex;
			flex-flow: row nowrap;
			align-items: center;

			& > .close-btn {
				height: 30px;
				width: 30px;
				margin: 0;
				margin-left: 1rem;

				& > svg {
					height: 30px;
					width: 30px;
				}
			}
		}
		& > .sdmx-dialog__content {
			padding: 1rem;
			display: flex;
			flex-flow: column nowrap;
		}
		& > .sdmx-dialog__footer {
			display: flex;
			flex-flow: row nowrap;
			align-items: center;

			user-select: none;
			-webkit-user-select: none;
		}
	}
</style>
