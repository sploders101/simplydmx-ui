import { Uuid } from "../patcher/types/fixtureTypes";

export type BlendingScheme = "HTP" | "LTP";

export type SnapData = NoSnap | SnapAt;

export interface NoSnap {
	type: "NoSnap",
}

export interface SnapAt {
	type: "SnapAt",
	data: number,
}

export type SubmasterDelta = Record<Uuid, Record<string, BlenderValue | null>>;

export interface BlenderValue {
	type: "Static" | "Offset",

	/** u16 for static, i32 for offset */
	value: number,
}

export interface Submaster {
	data: SubmasterData,
}

export type SubmasterData = Record<Uuid, AbstractLayerLight>;

export type AbstractLayerLight = Record<string, BlenderValue>;
