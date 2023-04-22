import { FilterCriteria } from "./rpc";

export type Listener<T = unknown> = (msg: Event<T>) => void;
export interface ListenersWithCriteria {
	none: Set<Listener<any>>,
	string: Map<string, Set<Listener<any>>>,
	uuid: Map<string, Set<Listener<any>>>,
}

export class IPCError extends Error {
	original_err: any;
	constructor(err_value: any) {
		super("An error occured: " + JSON.stringify(err_value));
		this.original_err = err_value;
	}
}

/**
 * Typescript form of the `Event` variant of `JSONResponse`.
 *
 * This version is not exported from SimplyDMX and thus allows specifying the
 * expected type. This will eventually be automatically populated with all forms
 * and event types in rpc.ts, but events should primarily be hidden behind stores,
 * so it should be relatively easy to keep track of in the meantime.
 */
export interface Event<T = unknown> {
	type: "Event",
	name: string,
	criteria: FilterCriteria,
	data: T, // serde_json::Value,
}
