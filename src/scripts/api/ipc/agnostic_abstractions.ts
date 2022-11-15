import * as rpc from "rpc__internal";
import {
	Event,
	FilterCriteria,
	IPCError,
	Listener,
	ListenersWithCriteria,
	SDMXCommand,
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

function sendRPC<T extends SDMXCommand>(message: T) {
	let request: Promise<unknown>;
	switch(message.type) {
		case "CallService":
		case "GetServices":
			return new Promise((res, rej) => {
				message.message_id = getMessageId();
				activeMessages.set(message.message_id!, [res, rej]);
				rpc.sendRPC(message)
					.catch((reason) => {
						activeMessages.delete(message.message_id!);
						rej(reason);
					});
			});
		case "SendEvent":
		case "Subscribe":
		case "Unsubscribe":
			request = rpc.sendRPC(message);
			return request;
	}
}

rpc.connect((event) => {
	let res;
	switch(event.type) {
		case "CallServiceResponse":
			[res] = activeMessages.get(event.message_id);
			res(event.result);
			break;
		case "CallServiceError":
			activeMessages.get(event.message_id)[1](new IPCError(event.error));
			break;
		case "ServiceList":
			activeMessages.get(event.message_id)[0](event.list);
			break;
		case "Event":
			let listeners = ipcEvents.get(event.name);
			let calledListeners = new Set();
			if (listeners) {
				listeners.none.forEach((listener) => {
					if (calledListeners.has(listener)) return;
					calledListeners.add(listener);
					listener(event as Event);
				});
				if (event.criteria.type === "String") {
					listeners.string.get(event.name)?.forEach((listener) => {
						if (calledListeners.has(listener)) return;
						calledListeners.add(listener);
						listener(event as Event);
					});
				} else if (event.criteria.type === "Uuid") {
					listeners.uuid.get(event.name)?.forEach((listener) => {
						if (calledListeners.has(listener)) return;
						calledListeners.add(listener);
						listener(event as Event);
					});
				}
			}
			break;
	}
});

export function loadFile(file?: number[]) {
	rpc.loadFile(file);
}

export async function listen<T = unknown>(eventName: string, criteria: FilterCriteria, listener: Listener<T>): Promise<() => Promise<void>> {
	if (!ipcEvents.has(eventName)) {
		ipcEvents.set(eventName, {
			none: new Set(),
			uuid: new Map(),
			string: new Map(),
		});
	}

	async function subscribe() {
		try {
			await sendRPC({
				type: "Subscribe",
				criteria,
				name: eventName,
			});
		} catch(err) {
			if (listeners.none.size === 0 && listeners.uuid.size === 0 && listeners.string.size === 0) {
				ipcEvents.delete(eventName);
			}
			throw err;
		}
	}

	async function unsubscribe() {
		await sendRPC({
			type: "Unsubscribe",
			criteria,
			name: eventName,
		});
	}

	const listeners = ipcEvents.get(eventName)!;
	let unlisten: () => Promise<void>;
	switch (criteria.type) {
		case "None":
			// Subscription
			if (listeners.none.size === 0) await subscribe();
			listeners.none.add(listener);

			// Unsubscription
			unlisten = async () => {
				const didDelete = listeners.none.delete(listener);
				if (didDelete && listeners.none.size === 0) {
					await unsubscribe();

					if (listeners.uuid.size === 0 && listeners.string.size === 0) {
						ipcEvents.delete(eventName);
					}
				}
			};
			break;
		case "Uuid":
			// Subscription
			if (!listeners.uuid.has(criteria.data)) listeners.uuid.set(criteria.data, new Set());
			let uuidListeners = listeners.uuid.get(criteria.data)!;
			if (uuidListeners.size === 0) await subscribe();
			uuidListeners.add(listener);

			// Unsubscription
			unlisten = async () => {
				const didDelete = uuidListeners.delete(listener);
				if (didDelete) {
					if (uuidListeners.size === 0) {
						listeners.uuid.delete(criteria.data);
						await unsubscribe();
					}
					if (listeners.none.size === 0 && listeners.uuid.size === 0 && listeners.string.size === 0) {
						ipcEvents.delete(eventName);
					}
				}
			}
			break;
		case "String":
			// Subscription
			if (!listeners.string.has(criteria.data)) listeners.string.set(criteria.data, new Set());
			let stringListeners = listeners.string.get(criteria.data)!;
			if (stringListeners.size === 0) await subscribe();
			stringListeners.add(listener);

			// Unsubscription
			unlisten = async () => {
				const didDelete = stringListeners.delete(listener);
				if (didDelete) {
					if (stringListeners.size === 0) {
						listeners.string.delete(criteria.data);
						await unsubscribe();
					}
					if (listeners.none.size === 0 && listeners.uuid.size === 0 && listeners.string.size === 0) {
						ipcEvents.delete(eventName);
					}
				}
			};
			break;
	}

	return unlisten;
}

export async function callService(pluginId: string, serviceId: string, args: any[]): Promise<any> {
	const response = await sendRPC({
		type: "CallService",
		plugin_id: pluginId,
		service_id: serviceId,
		args,
	});

	return response;
}
