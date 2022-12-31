import { UnionToIntersection } from "@vue/shared";
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

export type RustEnum = Record<string, any>;
export type MatchArms<Enum, ReturnType> = { [K in keyof UnionToIntersection<Enum>]: (arg: UnionToIntersection<Enum>[K]) => ReturnType };
export type MatchReturn<Enum, Cases extends MatchArms<Enum, any>> = Cases extends MatchArms<Enum, infer ReturnType> ? ReturnType : never;

/**
 * This type allows throwing an arbitrary compile-time error if an enum changes when using `exhaustiveMatch` isn't possible.
 *
 * This can be used as a reminder that a particular piece of code needs to handle all instances of an enum in something like
 * a template.
 */
export type ExhaustiveFlag<_Enum extends RustEnum, _HandledCases extends { [K in keyof UnionToIntersection<_Enum>]: any }> = never;

/**
 * Dumbed-down version of Rust's match statement for use in TypeScript. This is intended to take an exported Rust enum type
 * and create an exhaustive list of cases for each enum variant.
 */
export function exhaustiveMatch<Enum extends RustEnum, Cases extends MatchArms<Enum, any>>(rustEnum: Enum, arms: Cases): MatchReturn<Enum, Cases> {
	const entries = Object.entries(rustEnum);
	if (entries.length !== 1) throw new Error("Invalid Rust enum. This should have been checked at compile time.");

	return arms[entries[0][0] as keyof Enum](entries[0][1]);
}
