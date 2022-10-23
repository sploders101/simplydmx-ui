pub mod api;

use yew::prelude::*;
use wasm_bindgen_futures::spawn_local;

use api::say_hello;

#[function_component(App)]
fn app() -> Html {
    return html! {
        <>
            <h1>{ "Hello World!" }</h1>
            <button onclick={call_hello}>{"Click me!"}</button>
        </>
    };
}

fn call_hello(_: MouseEvent) {
    spawn_local(async {
        say_hello("Hello world!".into()).await;
    });
}

fn main() {
    yew::start_app::<App>();
}
