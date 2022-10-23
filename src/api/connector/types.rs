use simplydmx_plugin_macros::portable;
use uuid::Uuid;

#[portable]
pub struct ServiceDescription {
	pub plugin_id: String,
	pub id: String,
	pub name: String,
	pub description: String,
}

#[portable]
#[derive(Hash, Eq, PartialEq)]
#[serde(tag = "type", content = "data")]
pub enum FilterCriteria {
	None,
	String(String),
	Uuid(Uuid),
}

#[portable]
#[serde(tag = "type")]
pub enum JSONCommand {

	// Services
	CallService {
		message_id: u32,
		plugin_id: String,
		service_id: String,
		args: Vec<serde_json::Value>,
	},
	GetServices {
		message_id: u32,
	},

	// Events
	SendEvent {
		name: String,
		criteria: Option<FilterCriteria>,
		data: serde_json::Value,
	},
	Subscribe {
		name: String,
		criteria: Option<FilterCriteria>,
	},
	Unsubscribe {
		name: String,
		criteria: Option<FilterCriteria>,
	},

}

#[portable]
#[serde(tag = "type")]
pub enum JSONResponse {

	CallServiceResponse {
		message_id: u32,
		result: serde_json::Value,
	},

	ServiceList {
		message_id: u32,
		list: Vec<ServiceDescription>,
	},

	CallServiceError {
		message_id: u32,
		error: JSONCallServiceError,
	},

	Event {
		name: String,
		criteria: FilterCriteria,
		data: serde_json::Value,
	},

}

#[portable]
#[serde(tag = "type")]
pub enum JSONCallServiceError {
	ServiceNotFound,
	ArgDeserializationFailed,
	ResponseSerializationFailed,
}
