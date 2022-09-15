import { callService } from "../ipc";
import { DMXDriverData } from "../types/outputDriver/dmx";
import { Uuid } from "../types/patcherFixtureTypes";

export function createUniverse() {
	return callService<[], Uuid>("output-dmx", "create_universe");
}

export function linkUniverse<D extends string = string>(universeId: Uuid, driver: D, formData: DMXDriverData[D]) {
	return callService<[Uuid, string, any], null>("output-dmx", "link_universe", universeId, driver, formData);
}
