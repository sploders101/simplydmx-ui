# Events

This is a catalogue of the events that SimplyDMX emits. The infrastructure is in place for a more comprehensive, self-documenting catalogue,
but I'd like to get something working before I invest more time into that, so this is here in the meantime.

* `mixer.layer_bin_output`: `FullMixerOutput`
	* Emitted when a layer bin has been updated in the mixer
* `mixer.final_output`: `FullMixerOutput`
	* Emitted when the mixer's final output has been updated
* `dmx.output`: `Vec<u8>`
	* The output of the DMX plugin, for display by the UI. This should not be used by DMX drivers.
* `dmx.universe_removed`: `()`
	* Emitted when a universe is removed from the DMX plugin
* `patcher.patch_updated`: `()`
	* Event emitted by the patcher when a fixture is updated, intended for use by the mixer to trigger a re-blend of the entire show.
* `patcher.new_fixture`: `()`
	* Event emitted when a new fixture type has been successfully imported into SimplyDMX
* `saver.load_status`: `()`
	* Emitted whenever initialization has finished and indicates if SimplyDMX's state is safe or not.
