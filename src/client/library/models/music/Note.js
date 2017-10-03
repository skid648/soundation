import NoteGenerator from '../data/NoteGenerator'
import Tone from 'tone'

class Note extends Tone{
    constructor (time, degree, duration) {
        super()
        this.IndexToNote = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
        this.highestNote = -Infinity
        this.lowestNote = Infinity
        this.time = time
        this.degree = degree
        this.duration = duration

        // this.loopDuration = this.toSeconds(PartsData.loopDuration)
        // TODO: this seems useless but commenting it may break something

        this._computeHighestAndLowestNote()
    }

    _computeHighestAndLowestNote () {
        for (let chordName in Notes.major){
            let chord = NoteGenerator.getNotes().major[chordName];

            for (let i = 0; i < chord.length; i++){

                if (chord[i] > this.highestNote){
                    this.highestNote = chord[i];
                }

                if (chord[i] < this.lowestNote){
                    this.lowestNote = chord[i];
                }
            }

        }
        console.log(`Computed Higest note: ${this.highestNote} and lowest note: ${this.lowestNote}`)
    }

}

export default Note