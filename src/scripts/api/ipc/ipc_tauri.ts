import { invoke } from "@tauri-apps/api";
import { listen as tauriListen } from "@tauri-apps/api/event";
import {
	SDMXCommand,
	SDMXResponse,
} from "./types";


export function sendRPC(message: SDMXCommand) {
	return invoke("sdmx", { message: JSON.stringify(message) });
}

export async function connect(listener: (event: SDMXResponse) => void): Promise<void> {
	await tauriListen<SDMXResponse>("sdmx", (event) => listener(event.payload));
}

export function loadFile(file?: number[]) {
	return invoke("load_file", {
		file,
	});
}
