import { IPCError } from "./api/ipc/types";

type Result<T> = { Ok: T } | { Err: any };

export function unwrap<T>(response: Result<T>): T {
	if ("Ok" in response) {
		return response.Ok;
	} else if ("Err" in response) {
		throw new IPCError(response.Err);
	} else {
		throw new Error("Cannot unwrap an object that is not Result<T>")
	}
}
