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

export function deepCompare(obj1: any, obj2: any): boolean {
	if (typeof obj1 !== typeof obj2) return false;
	// We've already compared the types of obj1 & obj2.
	// `typeof obj1` speaks for both of them.
	if (typeof obj1 === "object") {
		if (obj1 === null || obj2 === null) return obj1 === obj2;
		return !Object.entries(obj1).some(([propName, obj1Value]) => {
			return !deepCompare(obj1Value, obj2[propName]);
		});
	} else return obj1 === obj2;
}
