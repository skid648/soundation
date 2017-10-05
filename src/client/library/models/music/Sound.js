import Player from './Player'
import NoteGenerator from '../data/NoteGenerator'
import Tone from 'tone'

class Sound {
    constructor () {
        this.harp = new Player("harp")
        this.muted = false
        this.startNote = 48
        this.noteGap = 4
        this.notes = NoteGenerator.getNotes()
    }

    strum (key, mode) {
        let chord = this.notes[mode][key]
        let now = Tone.context.currentTime + Tone.prototype.blockTime
        let wait = 0.05
        for (var i = 0; i < 4; i++){
            this.play(chord[i], now + wait * i, 0.5)
        }
    }

    play (midi, time, duration) {
        console.log(`midi given: ${midi}, converted to: ${Tone.Frequency(midi).toNote()}`)
        if (!this.muted){
            let note = Tone.Frequency(midi).toNote()
            this.harp.play(note, duration, time)
        }
    }

    load () {
        return this.harp.load()
    }

}

export default Sound