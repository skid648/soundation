import Fileplayer from './Fileplayer'

/**
 * Instruments class loads a given instrument
 * That can play a given note
 * TODO: Instruments should be able to handle more than one instrument
 */
class Instruments {
  constructor(urlToFetchInstrument) {
    this.urlToFetchInstrument = urlToFetchInstrument.endsWith('/')
      ? urlToFetchInstrument
      : `${urlToFetchInstrument}/`
    this.loaded = false
    this.instrument = new Fileplayer(`${this.urlToFetchInstrument}`)
  }

  /**
   * Load the instrument. This is
   * required for the instrument to
   * load the samples.
   * @returns {*}
   */
  load() {
    return this.instrument.load()
  }

  /**
   * Checks if instrument is ready
   * and triggers the given note
   * @param note Name of the note
   * @param duration How long the note should last
   * @param time The exact playback time
   */
  play(note, duration, time) {
    if (this.instrument.loaded) {
      this.instrument.triggerAttackRelease(note, duration, time)
    }
  }

  /**
   * Checks if instrument has load
   * @returns {boolean|Boolean}
   */
  isLoaded() {
    return this.instrument.loaded
  }

  /**
   * Calls instrument dispose
   * to clean up memory
   */
  dispose() {
    this.instrument.dispose()
  }
}

export default Instruments
