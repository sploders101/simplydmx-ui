import { callService } from "./agnostic_abstractions";


// AbstractLayerLight
export type AbstractLayerLight = Record<string, BlenderValue>;

// BlenderValue
export type BlenderValue = { type: "None" } | { type: "Static"; value: number } | { type: "Offset"; value: number };

// BlendingData
export interface BlendingData {
    scheme: BlendingScheme;
    snap: SnapData;
    allow_wrap: boolean;
    max_value: number;
    min_value: number;
}

// BlendingScheme
export type BlendingScheme = "HTP" | "LTP";

// Channel
export interface Channel {
    size: ChannelSize;
    default?: number;
    ch_type: ChannelType;
}

// ChannelSize
export type ChannelSize = "U8" | "U16";

// ChannelType
export type ChannelType = { type: "Segmented"; segments: Segment[]; priority: BlendingScheme; snapping: SnapData | null } | { type: "Linear"; priority: BlendingScheme };

// CreateFixtureError
export type CreateFixtureError = "FixtureTypeMissing" | "ControllerMissing" | { ErrorFromController: CreateInstanceError };

// CreateInstanceError
export type CreateInstanceError = { type: "InvalidData" } | ({ type: "Other" } & string) | { type: "Unknown" };

// DMXFixtureData
export interface DMXFixtureData {
    personalities: Record<string, DMXPersonalityData>;
}

// DMXFixtureInstance
export interface DMXFixtureInstance {
    universe: Uuid | null;
    offset: number | null;
}

// DMXInitializationError
export type DMXInitializationError = "UnrecognizedData";

// DMXPersonalityData
export interface DMXPersonalityData {
    dmx_channel_order: string[];
}

// DMXShowSave
export interface DMXShowSave {
    library: Record<Uuid, DMXFixtureData>;
    fixtures: Record<Uuid, DMXFixtureInstance>;
    universes: Record<Uuid, UniverseInstance>;
}

// DisplayableDMXDriver
export interface DisplayableDMXDriver {
    id: string;
    name: string;
    description: string;
}

// E131DMXShowSave
export interface E131DMXShowSave {
    universes: Record<Uuid, E131Universe>;
}

// E131InitializationError
export type E131InitializationError = "UnrecognizedData";

// E131Universe
export interface E131Universe {
    external_universe: number;
}

// EditError
export type EditError = { type: "InvalidData" } | ({ type: "Other" } & string) | { type: "Unknown" };

// FilterCriteria
export type FilterCriteria = { type: "None" } | { type: "String"; data: string } | { type: "Uuid"; data: Uuid };

// FixtureBundle
export interface FixtureBundle {
    fixture_info: FixtureInfo;
    output_info: SerializedData;
}

// FixtureInfo
export interface FixtureInfo {
    id: Uuid;
    name: string;
    short_name: string | null;
    manufacturer: string | null;
    family: string | null;
    metadata: FixtureMeta;
    channels: Record<string, Channel>;
    personalities: Record<string, Personality>;
    output_driver: string;
}

// FixtureInstance
export interface FixtureInstance {
    id: Uuid;
    fixture_id: Uuid;
    personality: string;
    name: string | null;
    comments: string | null;
}

// FixtureMeta
export interface FixtureMeta {
    manufacturer: string | null;
    manual_link: string | null;
}

// FormDescriptor
export type FormDescriptor = FormItem[];

// FormDropdown
export interface FormDropdown {
    label: string;
    id: string;
    item_source: FormItemOptionSource;
}

// FormItem
export type FormItem = { Textbox: FormTextbox } | { Number: FormNumber } | { Dropdown: FormDropdown } | { Section: FormSection } | { VerticalStack: FormItem[] } | { HorizontalStack: FormItem[] };

// FormItemOptionSource
export type FormItemOptionSource = { Static: { values: DropdownOptionJSON[] } } | { TypeSpec: { typespec_id: string } };

// FormNumber
export interface FormNumber {
    label: string;
    id: string;
}

// FormSection
export interface FormSection {
    label: string;
    form_items: FormItem[];
}

// FormTextbox
export interface FormTextbox {
    label: string;
    id: string;
}

// ImportError
export type ImportError = { type: "InvalidData" } | ({ type: "Other" } & string) | { type: "Unknown" };

// ImportFixtureError
export type ImportFixtureError = "UnknownController" | { ErrorFromController: ImportError };

// JSONCallServiceError
export type JSONCallServiceError = { type: "ServiceNotFound" } | { type: "ArgDeserializationFailed" } | { type: "ResponseSerializationFailed" };

// JSONCommand
export type JSONCommand = { type: "CallService"; message_id: number; plugin_id: string; service_id: string; args: Value[] } | { type: "GetServices"; message_id: number } | { type: "GetOptions"; message_id: number; provider_id: string } | { type: "SendEvent"; name: string; criteria: FilterCriteria | null; data: Value } | { type: "Subscribe"; name: string; criteria: FilterCriteria | null } | { type: "Unsubscribe"; name: string; criteria: FilterCriteria | null };

// JSONResponse
export type JSONResponse = { type: "CallServiceResponse"; message_id: number; result: Value } | { type: "ServiceList"; message_id: number; list: ServiceDescription[] } | { type: "OptionsList"; message_id: number; list: { Ok: DropdownOptionJSON[] } | { Err: TypeSpecifierRetrievalError } } | { type: "CallServiceError"; message_id: number; error: JSONCallServiceError } | { type: "Event"; name: string; criteria: FilterCriteria; data: Value };

// LinkUniverseError
export type LinkUniverseError = { type: "ErrorFromController"; data: RegisterUniverseError } | { type: "UniverseNotFound" } | { type: "ControllerNotFound" };

// MixerContext
export interface MixerContext {
    default_context: MixingContext;
    frozen_context: MixingContext | null;
    blind_opacity: number;
}

// MixerInitializationError
export type MixerInitializationError = "UnrecognizedData";

// MixingContext
export interface MixingContext {
    layer_order: Uuid[];
    layer_opacities: Record<Uuid, number>;
    user_submasters: Record<Uuid, StaticLayer>;
}

// PatcherInitializationError
export type PatcherInitializationError = "UnrecognizedData";

// Personality
export interface Personality {
    available_channels: string[];
}

// RegisterSavableError
export type RegisterSavableError = { type: "SaverAlreadyExists" };

// RegisterUniverseError
export type RegisterUniverseError = "InvalidData" | { Other: string } | "Unknown";

// SaveError
export type SaveError = { type: "SaverReturnedErr"; data: { error: string } } | { type: "ErrorSerializing"; data: { error: string } } | { type: "Unsafe" };

// SaverInitializationStatus
export type SaverInitializationStatus = { type: "FinishedSafe" } | { type: "FinishedUnsafe" } | { type: "Initializing" };

// Segment
export interface Segment {
    start: number;
    end: number;
    name: string;
    id: string;
}

// SerializedData
export type SerializedData = number[] | Value;

// ServiceArgumentOwned
export interface ServiceArgumentOwned {
    id: string;
    name: string;
    description: string;
    val_type: string;
    val_type_hint: string | null;
}

// ServiceDescription
export interface ServiceDescription {
    plugin_id: string;
    id: string;
    name: string;
    description: string;
    arguments: ServiceArgumentOwned[];
    returns: ServiceArgumentOwned | null;
}

// SharablePatcherState
export interface SharablePatcherState {
    library: Record<Uuid, FixtureInfo>;
    fixture_order: Uuid[];
    fixtures: Record<Uuid, FixtureInstance>;
}

// ShowFile
export interface ShowFile {
    plugin_data: Record<string, number[]>;
}

// SnapData
export type SnapData = { type: "NoSnap" } | { type: "SnapAt"; data: number };

// StaticLayer
export interface StaticLayer {
    values: SubmasterData;
}

// SubmasterData
export type SubmasterData = Record<Uuid, AbstractLayerLight>;

// UniverseInstance
export interface UniverseInstance {
    id: Uuid;
    name: string;
    controller: string | null;
}

// Uuid
export type Uuid = string;

// Value
export type Value = any;


export const core = {
	log(msg: string): Promise<void> { return callService("core", "log", [msg]) },
	log_error(msg: string): Promise<void> { return callService("core", "log_error", [msg]) },
};

export const mixer = {
	commit_blind(): Promise<void> { return callService("mixer", "commit_blind", []) },
	create_layer(): Promise<Uuid> { return callService("mixer", "create_layer", []) },
	delete_layer(submaster_id: Uuid): Promise<boolean> { return callService("mixer", "delete_layer", [submaster_id]) },
	enter_blind_mode(): Promise<void> { return callService("mixer", "enter_blind_mode", []) },
	get_blind_opacity(): Promise<number | null> { return callService("mixer", "get_blind_opacity", []) },
	get_layer_contents(submaster_id: Uuid): Promise<StaticLayer | null> { return callService("mixer", "get_layer_contents", [submaster_id]) },
	get_layer_opacity(submaster_id: Uuid): Promise<number | null> { return callService("mixer", "get_layer_opacity", [submaster_id]) },
	revert_blind(): Promise<void> { return callService("mixer", "revert_blind", []) },
	set_blind_opacity(opacity: number): Promise<void> { return callService("mixer", "set_blind_opacity", [opacity]) },
	set_layer_contents(submaster_id: Uuid, submaster_delta: SubmasterData): Promise<boolean> { return callService("mixer", "set_layer_contents", [submaster_id, submaster_delta]) },
	set_layer_opacity(submaster_id: Uuid, opacity: number, auto_insert: boolean): Promise<boolean> { return callService("mixer", "set_layer_opacity", [submaster_id, opacity, auto_insert]) },
};

export const output_dmx = {
	create_universe(name: string): Promise<Uuid> { return callService("output_dmx", "create_universe", [name]) },
	delete_universe(universe_id: Uuid): Promise<void> { return callService("output_dmx", "delete_universe", [universe_id]) },
	link_universe(universe_id: Uuid, driver: string, form_data: SerializedData): Promise<{ Ok: null } | { Err: LinkUniverseError }> { return callService("output_dmx", "link_universe", [universe_id, driver, form_data]) },
	unlink_universe(universe_id: Uuid): Promise<void> { return callService("output_dmx", "unlink_universe", [universe_id]) },
};

export const patcher = {
	create_fixture(fixture_type: Uuid, personality: string, name: string | null, comments: string | null, form_data: SerializedData): Promise<{ Ok: Uuid } | { Err: CreateFixtureError }> { return callService("patcher", "create_fixture", [fixture_type, personality, name, comments, form_data]) },
	get_patcher_state(): Promise<SharablePatcherState> { return callService("patcher", "get_patcher_state", []) },
	import_fixture(fixture_bundle: FixtureBundle): Promise<{ Ok: null } | { Err: ImportFixtureError }> { return callService("patcher", "import_fixture", [fixture_bundle]) },
};

export const saver = {
	save(): Promise<{ Ok: number[] } | { Err: SaveError }> { return callService("saver", "save", []) },
};

