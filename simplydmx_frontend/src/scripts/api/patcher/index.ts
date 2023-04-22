import {
	listen,
	patcher,
} from "../ipc";
import type {
	SharablePatcherState,
} from "../ipc";


export async function listenForUpdates(cb: (state: SharablePatcherState) => void): Promise<() => Promise<void>> {
	const patchUpdates = listen("patcher.patch_updated", { type: "None" }, () => patcher.get_patcher_state().then(cb));
	const libraryUpdates = listen("patcher.new_fixture", { type: "None" }, () => patcher.get_patcher_state().then(cb));

	const stopPatchUpdates = await patchUpdates;
	const stopLibraryUpdates = await libraryUpdates;

	return async () => {
		await stopPatchUpdates();
		await stopLibraryUpdates();
	};
}
