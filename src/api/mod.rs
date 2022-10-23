mod connector;

mod inner {
	pub async fn say_hello(mystr: String) {
		return super::connector::say_hello(mystr).await;
	}
}

pub use inner::say_hello;
