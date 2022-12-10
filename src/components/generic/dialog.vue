<script lang="ts">
	import { reactive } from "vue";
	const modalStack = reactive<Symbol[]>([]);
</script>

<script setup lang="ts">
	import { onMounted, onBeforeUnmount, watch } from "vue";

	const props = defineProps({
		/// Whether or not the dialog is visible
		visible: { type: Boolean, required: true },

		/// Whether or not to show the close button on the top right of the dialog. Defaults to `true`
		showClose: { type: Boolean, default: true },

		/// Disables auto-closing the dialog for modal clicks and escape presses.
		/// This still allows closing via the close button. If this is not desired, use `:visible`
		/// instead of `v-model:visible` and bind to individual events.
		persistent: { type: Boolean, default: false },

		/// The class to be passed through to the dialog component
		dialogClass: { type: String, required: false },
	});

	const emit = defineEmits<{
		// Individual interactions can be listened to for fine-grained control
		(e: "modal-clicked"): void,
		(e: "close-clicked"): void,
		(e: "escape-pressed"): void,

		// If this behavior is not desired, use `:visible` instead of `v-model:visible` for a one-way binding.
		(e: "update:visible", value: false): void,
	}>();

	const thisinstance = Symbol("Dialog Instance Identifier");
	watch(() => props.visible, (value, oldValue) => {
		if (value && !oldValue) {
			modalStack.push(thisinstance);
		} else if (!value && oldValue) {
			modalStack.splice(modalStack.indexOf(thisinstance), 1);
		}
	});
	onMounted(() => {
		document.body.addEventListener("keypress", keyHandler);
	});
	onBeforeUnmount(() => {
		document.body.removeEventListener("keypress", keyHandler);
	});
	function keyHandler(event: KeyboardEvent) {
		if (modalStack[modalStack.length - 1] === thisinstance) {
			if (event.key === "Escape") {
				event.preventDefault();
				requestClose("escape");
			}
		}
	}

	function requestClose(kind: "modal" | "button" | "escape") {
		switch (kind) {
			case "modal":
				emit("modal-clicked");
				if (!props.persistent) emit("update:visible", false);
				break;
			case "button":
				emit("close-clicked");
				emit("update:visible", false);
				break;
			case "escape":
				emit("escape-pressed");
				if (!props.persistent) emit("update:visible", false);
				break;
		}
	}
</script>

<template>
	<Teleport to="body">
		<Transition name="sdmx-dialog-fade">
			<div v-if="props.visible" class="sdmx-dialog__modal" @click.stop="requestClose('modal')">
				<div :class="'sdmx-dialog' + (props.dialogClass ? ' ' + props.dialogClass : '')" @click.stop>
					<div class="sdmx-dialog__header" v-if="$slots.header || props.showClose !== false">
						<slot name=header />
						<div class="spacer"/>
						<Button subtle icon class="close-btn" @click="requestClose('button')" v-if="props.showClose !== false">
							<Icon i="close" />
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
		max-width: 50vw;
		min-width: 30rem;


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
