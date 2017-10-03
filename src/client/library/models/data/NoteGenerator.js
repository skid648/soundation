import Teoria from 'Teoria'
import Positions from '../'

class NoteGenerator {
    constructor () {
        this.Notes = { major : {}, minor : {} }
        this.majorOrder = ["C", "G", "D", "A", "E", "B", "F#", "C#", "G#", "D#", "A#", "F"];
        this.minorOrder = ["A", "E", "B", "F#", "C#", "G#", "D#", "A#", "F", "C", "G", "D"];
        this._calculateNotes()
        console.log(`Calculated Notes: ${JSON.stringify(this.notes)}`)
    }
    
    getNotes () {
       return this.Notes
    }
    
    _calculateNotes () {
        _.forEach(this.majorOrder, key => {

            let major = Teoria.note(key + "3").chord("major")
            let minor = Teoria.note(key + "3").chord("minor")

            Notes.major[key] = []
            Notes.minor[key] = []

            let octaves = 3

            for (var o = 0; o < octaves; o++) {

                var majorNotes = major.notes()
                var minorNotes = minor.notes()

                _.forEach(majorNotes, j => {

                    Notes.major[key].push(majorNotes[j].midi())
                    Notes.minor[key].push(minorNotes[j].midi())

                })

                major.transpose(Teoria.interval("P8"))
                minor.transpose(Teoria.interval("P8"))
            }
        })
    }
}

export default new NoteGenerator()