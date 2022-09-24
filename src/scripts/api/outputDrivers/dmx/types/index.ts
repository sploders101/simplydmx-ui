import { Uuid } from "../../../patcher/types/fixtureTypes";
import { E131Universe } from "./drivers/e131";

export interface DMXFixtureData {
	personalities: Record<string, DMXPersonalityData>,
}

export interface DMXPersonalityData {
	dmx_channel_order: string[],
}

export interface DMXFixtureInstance {
	universe?: Uuid | null,
	offset?: number | null,
}

/** Mapping of DMX driver ID -> universe data */
export interface DMXDriverData {
	e131: E131Universe,
	[key: string]: any,
}
