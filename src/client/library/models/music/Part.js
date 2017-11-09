import Note from './Note'
import _ from 'lodash'
import Tone from 'tone'
import Sound from './Sound'
import Log from '../../Helpers/Logging'
import NoteGenerator from '../../models/data/NoteGenerator'
import Interface from '../../interface'

class Part {
    constructor (notes) {
        this.notes = []
        this.chord = {}
        this.sound = new Sound()
        this.enabled = true

        //make each of the notes in the part
        let note = []

        _.forEach(notes, obj => {
            note = [
                obj.time,
                new Note(obj.time, obj.degree, obj.duration)
            ]
            this.notes.push(note)
        })

        let generatedNotes = NoteGenerator.getNotes()
        this._setChord(generatedNotes.major.C)
        this._enable(true)
    }

    start () {
        return this.sound.load()
        .then(() => {
            // Log.SpaceTitleAndLog('Notes on Part object', this.notes)
            // Log.SpaceTitleAndLog('Chord on Part object', this.chord)
            this.part = new Tone.Part(this._onnote.bind(this), this.notes).start(0)
            return true
        })
    }

    _onnote (time, note) {
        console.log(`Firing onnote with time: ${time}, note: ${JSON.stringify(note.degree)}, noteFromChord: ${this.chord[note.degree]}, enabled: ${this.enabled}`)
        if (this.enabled){
            let duration = this.part.toSeconds(note.duration)
            console.log('Seconds:' + note.duration)
            this.sound.play(this.chord[note.degree], time, duration)
            Interface.addEvent(this.chord[note.degree], time.toFixed(3))
        }
    }

    _enable (enabled) {
        this.enabled = enabled

        if (enabled){
            this._setChord(this.chord)
        }

    }

    _initChord () {
        var notes = this.chord

        _.forEach(this.notes, note => {
            note[1].setChord(notes)
        })

    }

    _setChord (notes) {
        console.log(`Setting chords to ${JSON.stringify(notes)}`)
        if (this.enabled){
            _.forEach(this.notes, note => {
                note[1].setChord(notes)
            })
        }

        this.chord = notes
    }
}

export default Part