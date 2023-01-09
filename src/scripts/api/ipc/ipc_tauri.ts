import { invoke } from "@tauri-apps/api";
import { listen as tauriListen } from "@tauri-apps/api/event";
import {
	JSONCommand,
	JSONResponse,
} from "./rpc";


export function sendRPC(message: JSONCommand) {
	return invoke("sdmx", { message: JSON.stringify(message) });
}

export async function connect(listener: (event: JSONResponse) => void): Promise<void> {
	await tauriListen<JSONResponse>("sdmx", (event) => listener(event.payload));
}

export function loadFile(file?: number[]) {
	return invoke("load_file", {
		file,
	});
}
