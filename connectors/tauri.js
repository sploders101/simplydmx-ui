export function handleResult(response) {
	if (typeof response === "object" && response !== null) {
		let keys = Object.keys(response);
		if (keys.length === 1) {
			if (keys[0] === "Ok") {
				return Promise.resolve(response.Ok);
			} else if (keys[0] === "Err") {
				throw Promise.reject(response.Err);
			}
		}
	}
	return response;
}

export function sendCommand(command) {
	return window.__TAURI__.invoke("sdmx", command).then(handleResult);
}

export function loadFile(file) {
	return window.__TAURI__.invoke("load_file", file).then(handleResult);
}

export function listen(callback) {
	return window.__TAURI__.event.listen("sdmx", callback).then(handleResult);
}

export function callbackTest(callback) {
	setTimeout(callback, 5000);
}

export function log() {
	console.log("Success!");
}
