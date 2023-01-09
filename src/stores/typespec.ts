import { ref, onMounted, onUnmounted, Ref, ComputedRef, computed, reactive, watch } from "vue";
import * as ipc from "@/scripts/api/ipc";
import { getTypeSpecOptions } from "@/scripts/api/ipc";

let interval: number | null = null;
let activeTypeSpecs: Map<string, [number, Ref<ipc.DropdownOptionJSON[] | null>]> = reactive(new Map());

function fetchTypeSpecs() {
	activeTypeSpecs.forEach(([_, slot], typespecId) => {
		getTypeSpecOptions(typespecId)
			.then((options) => {
				slot.value = options;
				console.log(activeTypeSpecs);
			}, (err) => console.error("An error occurred while fetching TypeSpec options.", err));
	});
}

// This is stubbed out with a polling routine for the time being. I want to flesh this out
// with an integration into the event system, but I need to make some progress for "Motivation Bridge"
// (https://www.youtube.com/watch?v=w7eWb0nINPg)
// Tracking issue: https://github.com/sploders101/simplydmx-ui/issues/1
export function useTypeSpecState(providerId: string | null | Ref<string | null> | ComputedRef<string | null>) {
	function attach(updateInterval: boolean, providerId: string | null) {
		if (providerId !== null) {
			const storedSpec = activeTypeSpecs.get(providerId);
			if (!storedSpec) {
				activeTypeSpecs.set(providerId, [1, ref(null)]);
			} else {
				storedSpec[0] += 1;
			}
		}
		if (updateInterval && interval === null && activeTypeSpecs.size > 0) {
			interval = setInterval(fetchTypeSpecs, 2000);
		}
	}
	function detach(updateInterval: boolean, providerId: string | null) {
		if (providerId !== null) {
			// This will always exist since to unmount, we have to have mounted.
			const storedSpec = activeTypeSpecs.get(providerId)!;
			if (storedSpec[0] === 1) {
				activeTypeSpecs.delete(providerId);
			} else {
				storedSpec[0] -= 1;
			}
		}
		if (updateInterval && interval !== null && activeTypeSpecs.size === 0) {
			clearInterval(interval);
			interval = null;
		}
	}

	// Lifecycle hooks
	const firstProviderId = typeof providerId === "string" ? providerId : providerId === null ? null : providerId.value;
	onMounted(() => attach(true, firstProviderId));
	onUnmounted(() => detach(true, firstProviderId));
	if (typeof providerId === "object" && providerId !== null) {
		watch(providerId, (newId, oldId) => {
			if (oldId) detach(newId !== null, oldId);
			if (newId) attach(oldId !== null, newId);
		});
	}

	return computed(() => {
		const resolvedProviderId = typeof providerId === "string" ? providerId : providerId === null ? null : providerId.value;
		if (resolvedProviderId === null) return null;
		const typespec = activeTypeSpecs.get(resolvedProviderId);
		if (typespec) {
			return typespec[1].value;
		} else {
			return null;
		}
	});
}
