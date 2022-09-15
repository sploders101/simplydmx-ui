import { invoke } from "@tauri-apps/api";
import { listen } from "@tauri-apps/api/event";
import {
	Event,
	IPCError,
	ListenersWithCriteria,
	SDMXCommand,
	SDMXResponse,
} from "./types";


const ipcEvents = new Map<string, ListenersWithCriteria>();

const activeMessages = new Map<number, any>();
const maxMessageId = 4294967295; // u32::MAX
function getMessageId() {
	while(true) {
		let msgId = Math.floor(Math.random() * maxMessageId);
		if (activeMessages.has(msgId)) continue;
		return msgId;
	}
}

export function sendRPC<T extends SDMXCommand>(message: T) {
	let request: Promise<unknown>;
	switch(message.type) {
		case "CallService":
		case "GetServices":
			return new Promise((res, rej) => {
				message.message_id = getMessageId();
				activeMessages.set(message.message_id!, [res, rej]);
				invoke("sdmx", { message })
					.catch((reason) => {
						activeMessages.delete(message.message_id!);
						rej(reason);
					});
			});
		case "SendEvent":
		case "Subscribe":
		case "Unsubscribe":
			request = invoke("sdmx", { message });
			return request;
	}
}

listen<SDMXResponse>("sdmx", (event) => {
	let res, rej;
	switch(event.payload.type) {
		case "CallServiceResponse":
			[res, rej] = activeMessages.get(event.payload.message_id);
			try {
				res(handleResult(event.payload.result));
			} catch(err) {
				rej(err);
			}
			break;
		case "CallServiceError":
			activeMessages.get(event.payload.message_id)[1](new IPCError(event.payload.error));
			break;
		case "ServiceList":
			activeMessages.get(event.payload.message_id)[0](event.payload.list);
			break;
		case "Event":
			console.log(event.payload);
			let listeners = ipcEvents.get(event.payload.name);
			if (listeners) {
				listeners.none.forEach((listener) => listener(event.payload as Event));
				if (event.payload.criteria.type === "String") {
					listeners.string.get(event.payload.name)?.forEach((listener) => listener(event.payload as Event));
				} else if (event.payload.criteria.type === "Uuid") {
					listeners.uuid.get(event.payload.name)?.forEach((listener) => listener(event.payload as Event));
				}
			}
			break;
	}
});

export function loadFile(file?: number[]) {
	return invoke("load_file", {
		file,
	});
}

// sendRPC({
// 	type: "Subscribe",
// 	criteria: null,
// 	name: "patcher.patch_updated",
// });
// sendRPC({
// 	type: "Subscribe",
// 	criteria: null,
// 	name: "mixer.final_output",
// });

export async function callService<A extends any[] = any[], R = any>(pluginId: string, serviceId: string, ...args: A): Promise<R> {
	const response = await sendRPC({
		type: "CallService",
		plugin_id: pluginId,
		service_id: serviceId,
		args,
	});

	return handleResult(response);
}

function handleResult(response: any) {
	if (typeof response === "object" && response !== null) {
		let keys = Object.keys(response);
		if (keys.length === 1) {
			if (keys[0] === "Ok") {
				return response.Ok;
			} else if (keys[0] === "Err") {
				throw new IPCError(response.Err);
			}
		}
	}
	return response;
}
