import Tone from 'tone'
import teoria from 'teoria'
import Chords from '../data/ChordsAndNotesGenerator'

class Note extends Tone {
  constructor(time, degree, duration) {
    super()
    this.IndexToNote = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
    this.highestNote = -Infinity
    this.lowestNote = Infinity
    this.time = time
    this.degree = degree
    this.duration = duration
    this.chords = Chords.getChords()

    // this.loopDuration = this.toSeconds(PartsData.loopDuration)
    // TODO: this seems useless but commenting it may break something

    this._computeHighestAndLowestNote()
  }

  _computeHighestAndLowestNote() {
    for (const chordName in this.chords.major) {
      const notesFromChord = this.chords.major[chordName]

      _.forEach(notesFromChord, (noteInMidi) => {
        if (noteInMidi > this.highestNote) this.highestNote = noteInMidi
        if (noteInMidi < this.lowestNote) this.lowestNote = noteInMidi
      })
    }
  }
}

export default Note
