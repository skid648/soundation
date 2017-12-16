import Tone from 'tone'
import Instruments from './Instruments'
import Chords from '../data/ChordsAndNotesGenerator'

class Sound {
  constructor(instrumentUrl) {
    this.instrument = new Instruments(instrumentUrl)
    this.muted = false
    this.startNote = 48
    this.noteGap = 4
    this.chords = Chords.getChords()
    this.scaleIndexToNote = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  }

  /**
   * Strums the instrument
   * play a chord sequentially
   * with a small time delay
   * @param chordName
   * @param key
   */
  strum(chordName, key) {
    const chord = this.chords[chordName][key]
    const now = Tone.context.currentTime + Tone.prototype.blockTime
    const wait = 0.05
    for (let i = 0; i < 4; i++) {
      this.play(chord[i], now + (wait * i), 0.5)
    }
  }

  /**
   * User the selected instrument
   * to play a note at a given time
   * @param midi
   * @param time
   * @param duration
   */
  play(midi, time, duration) {
    if (!this.muted) {
      const note = this._midiToNote(midi)
      this.instrument.play(note, duration, time)
    }
  }

  /**
   * Load the selected instrument
   * @returns {*}
   */
  load() {
    return this.instrument.load()
  }

  /**
   * Used to clean up the instruments
   */
  dispose() {
    this.instrument.dispose()
  }

  /**
   * Translates midi to note name
   * @param midiNumber
   * @returns {*}
   * @private
   */
  _midiToNote(midiNumber) {
    const octave = Math.floor(midiNumber / 12) - 1
    const note = midiNumber % 12
    return this.scaleIndexToNote[note] + octave
  }
}

export default Sound
