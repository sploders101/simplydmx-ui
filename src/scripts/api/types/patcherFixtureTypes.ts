import { BlendingScheme, SnapData } from "./mixer";
import { DMXFixtureData } from "./outputDriver/dmx";

export type Uuid = string;

export type FixtureBundle =
	| GenericFixtureBundle<"DMX", DMXFixtureData>
;

export interface GenericFixtureBundle<C extends string, T> {
	fixture_info: FixtureInfo<C>,
	output_info: T;
}

export interface FixtureInfo<C extends string = string> {
	id: Uuid,
	name: string,
	short_name?: string | null,
	manufacturer?: string | null,
	family?: string | null,
	metadata: FixtureMeta,
	channels: Record<string, Channel>,
	personalities: Record<string, Personality>,
	output_driver: C,
}

export interface FixtureMeta {
	manufacturer?: string | null,
	manual_link?: string | null,
}

export interface Channel {
	size: ChannelSize,
	default?: number | null,
	ch_type: ChannelType,
}

export type ChannelSize = "U8" | "U16";

export type ChannelType = SegmentedChannel | LinearChannel;

export interface SegmentedChannel {
	type: "Segmented",
	segments: Segment[],
	priority: BlendingScheme,
	snapping?: SnapData | null,
}

export interface LinearChannel {
	type: "Linear",
	priority: BlendingScheme,
}

export interface Segment {
	start: number,
	end: number,
	name: string,
	id: string,
}

export interface Personality {
	available_channels: string[];
}
