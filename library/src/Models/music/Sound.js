import Tone from 'tone'
import Player from './Player'
import Chords from '../data/ChordsAndNotesGenerator'

class Sound {
  constructor() {
    this.harp = new Player('harp')
    this.muted = false
    this.startNote = 48
    this.noteGap = 4
    this.chords = Chords.getChords()
    this.scaleIndexToNote = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  }

  strum(chordName, key) {
    const chord = this.chords[chordName][key]
    const now = Tone.context.currentTime + Tone.prototype.blockTime
    const wait = 0.05
    for (let i = 0; i < 4; i++) {
      this.play(chord[i], now + (wait * i), 0.5)
    }
  }

  play(midi, time, duration) {
    if (!this.muted) {
      const note = this._midiToNote(midi)
      this.harp.play(note, duration, time)
    }
  }

  load() {
    return this.harp.load()
  }

  _midiToNote(midiNumber) {
    const octave = Math.floor(midiNumber / 12) - 1
    const note = midiNumber % 12
    return this.scaleIndexToNote[note] + octave
  }

  dispose() {
    this.harp.dispose()
  }
}

export default Sound
