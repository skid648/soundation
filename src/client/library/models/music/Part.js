import Note from './Note'
import _ from 'lodash'
import Tone from 'tone'
import Sound from './Sound'

class Part {
    constructor (notes) {
        this.notes = []
        this.chord = {}
        this.sound = new Sound()
        this.enabled = true

        //make each of the notes in the part
        let note = []

        _.forEach(notes, note => {
            note = [
                note.time,
                new Note(note.time, note.degree, note.duration)
            ]
            this.notes.push(note)
        })
    }

    start () {
        return Promise.resolve()
        .then(() => this.sound.load())
        .then(() => {
            this.part = new Tone.Part(this._onnote, this.notes).start(0)
            return true
        })
    }

    _onnote (time, note) {
        if (this.enabled){
            let duration = this.part.toSeconds(note.duration)
            note.play(duration)
            this.sound.play(this.chord[note.degree], time, duration)
        }
    }

    _enable (enabled) {
        this.enabled = enabled

        if (enabled){
            this.setChord(this.chord)
        }

    }

    _initChord () {
        var notes = this.chord

        _.forEach(this.notes, note => {
            note[1].setChord(notes)
        })

    }

    _setChord (notes) {
        if (this.enabled){
            _.forEach(this.notes, note => {
                note[1].setChord(notes)
            })
        }

        this.chord = notes
    }
}

export default Part