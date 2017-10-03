import Note from './Note'
import _ from 'lodash'
import Tone from 'tone'
import Sound from './Sound'
// TODO: finish up Sound class

class Part {
    constructor (notes) {
        this.notes = []
        this.chord = {}
        //make each of the notes in the part
        let note = []

        _.forEach(notes, note => {
            note = [
                notes[i].time,
                new Note(notes[i].time, notes[i].degree, notes[i].duration)
            ]
            this.notes.push(note)
        })

        this.part = new Tone.Part(this._onnote, this.notes).start(0)

        this.enabled = true
    }

    _onnote (time, note) {
        if (this.enabled){
            let duration = this.part.toSeconds(note.duration)
            note.play(duration)
            Sound.play(this.chord[note.degree], time, duration)
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