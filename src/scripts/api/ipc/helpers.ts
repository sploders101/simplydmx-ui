import { IPCError } from "./types";

export function handleResult(response: any) {
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
