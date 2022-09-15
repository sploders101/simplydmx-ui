export type Listener = (msg: Event) => void;
export interface ListenersWithCriteria {
	none: Set<Listener>,
	string: Map<string, Set<Listener>>,
	uuid: Map<string, Set<Listener>>,
}

export class IPCError extends Error {
	original_err: any;
	constructor(err_value: any) {
		super("An error occured: " + JSON.stringify(err_value));
		this.original_err = err_value;
	}
}

export type SDMXCommand =
	| CallService
	| GetServices
	| SendEvent
	| Subscribe
	| Unsubscribe
;

export interface CallService {
	type: "CallService";
	message_id?: number, // u32
	plugin_id: string,
	service_id: string,
	args: any, // Vec<serde_json::Value>,
}

export interface GetServices {
	type: "GetServices";
	message_id?: number, // u32,
}

export interface SendEvent {
	type: "SendEvent";
	name: string,
	criteria: FilterCriteria | null, // Option<FilterCriteria>,
	data: any, // serde_json::Value,
}

export interface Subscribe {
	type: "Subscribe";
	name: string,
	criteria: FilterCriteria | null, // Option<FilterCriteria>,
}

export interface Unsubscribe {
	type: "Unsubscribe";
	name: string,
	criteria: FilterCriteria | null, // Option<FilterCriteria>,
}

export type SDMXResponse =
	| CallServiceResponse
	| ServiceList
	| CallServiceError
	| Event
;

export interface CallServiceResponse {
	type: "CallServiceResponse",
	message_id: number, // u32,
	result: any, // serde_json::Value,
}

export interface ServiceList {
	type: "ServiceList",
	message_id: number, // u32,
	list: ServiceDescription[], // Vec<ServiceDescription>,
}

export interface CallServiceError {
	type: "CallServiceError",
	message_id: number, // u32,
	error: JSONCallServiceError,
}

export interface Event {
	type: "Event",
	name: string,
	criteria: FilterCriteria,
	data: any, // serde_json::Value,
}

export interface ServiceDescription {
	plugin_id: string,
	id: string,
	name: string,
	description: string,
}

export type JSONCallServiceError =
	| { type: "ServiceNotFound" }
	| { type: "ArgDeserializationFailed" }
	| { type: "ResponseSerializationFailed" }
;

export type FilterCriteria = FilterCriteriaNone | FilterCriteriaString | FilterCriteriaUuid;

export interface FilterCriteriaNone {
	type: "None",
}

export interface FilterCriteriaString {
	type: "String",
	data: string,
}

export interface FilterCriteriaUuid {
	type: "Uuid",
	data: string,
}
