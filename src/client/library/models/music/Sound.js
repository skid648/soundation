import Player from './Player'
import Chords from '../data/ChordsAndNotesGenerator'
import Tone from 'tone'

class Sound {
    constructor () {
        this.harp = new Player("harp")
        this.muted = false
        this.startNote = 48
        this.noteGap = 4
        this.chords = Chords.getChords()
        this.scaleIndexToNote = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    }

    strum (key, chordName) {
        let chord = this.chords[chordName][key]
        let now = Tone.context.currentTime + Tone.prototype.blockTime
        let wait = 0.05
        for (var i = 0; i < 4; i++){
            this.play(chord[i], now + wait * i, 0.5)
        }
    }

    play (midi, time, duration) {
        if (!this.muted){
            let note = this._midiToNote(midi)
            this.harp.play(note, duration, time)
        }
    }

    load () {
        return this.harp.load()
    }

    _midiToNote (midiNumber) {
        let octave = Math.floor(midiNumber / 12) - 1
        let note = midiNumber % 12
        return this.scaleIndexToNote[note] + octave
    }

    dispose () {
        this.harp.dispose()
    }

}

export default Sound