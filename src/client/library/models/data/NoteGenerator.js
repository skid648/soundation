import Teoria from 'teoria'

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

            this.Notes.major[key] = []
            this.Notes.minor[key] = []

            let octaves = 3

            for (let o = 0; o < octaves; o++) {

                let majorNotes = major.notes()
                let minorNotes = minor.notes()

                _.forEach(majorNotes, (object, i) => {
                    this.Notes.major[key].push(majorNotes[i].midi())
                    this.Notes.minor[key].push(minorNotes[i].midi())

                })

                major.transpose(Teoria.interval("P8"))
                minor.transpose(Teoria.interval("P8"))
            }
        })
    }
}

export default new NoteGenerator()