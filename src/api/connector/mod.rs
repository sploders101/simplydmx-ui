pub mod types;

use wasm_bindgen::prelude::*;

#[cfg(not(feature = "connector"))]
compile_error!("Please select a connector for the UI to use when connecting to SimplyDMX");
#[cfg_attr(feature = "tauri-connector", wasm_bindgen(module = "/connectors/tauri.js"))]
extern {
    #[wasm_bindgen(js_name = sendCommand, catch)]
	async fn sdmx(message: String) -> Result<JsValue, JsValue>;
	// async fn sdmx(message: JSONCommand) -> Result<(), String>;

    #[wasm_bindgen(js_name = loadFile, catch)]
	async fn load_file(file: Option<Vec<u8>>) -> Result<JsValue, JsValue>;
	// async fn load_file(file: Option<Vec<u8>>) -> Result<(), String>;

	#[wasm_bindgen(js_name = listen, catch)]
	async fn listen() -> Result<JsValue, JsValue>;

	#[wasm_bindgen(js_name = callbackTest)]
	fn callback_test(callback: JsValue) -> JsValue;

	#[wasm_bindgen(js_name = log)]
	fn log() -> JsValue;
}

pub async fn say_hello(mystr: String) -> () {
	let test = Closure::<dyn Fn() -> ()>::wrap(Box::new(move || {
		log();
	}));

	callback_test(test.into_js_value());
}
