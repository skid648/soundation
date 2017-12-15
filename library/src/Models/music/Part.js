import _ from 'lodash'
import Tone from 'tone'
import Note from './Note'
import Sound from './Sound'
import Chords from '../data/ChordsAndNotesGenerator'

class Part {
  constructor(partData, partName) {
    this.notes = []
    this.chord = {}
    this.name = partName
    this.sound = new Sound()
    this.enabled = true
    this.chords = Chords.getChords()
    this.currentVariation = { chordName: 'major', key: 'C' }

    // make each of the notes in the part
    let note = []

    // Transform partData to Notes object
    // and fill this.notes
    _.forEach(partData, (partNote) => {
      note = [
        partNote.time,
        new Note(
          partNote.time,
          partNote.degree,
          partNote.duration,
        ),
      ]
      this.notes.push(note)
    })

    // enable part
    this.enable(true)
  }

  /**
   * Loads the sounds, binds what
   * happens after each note and
   * starts the part
   */
  start() {
    return this.sound.load()
      .then((res) => {
        this.part = new Tone.Part(this._onNextNote.bind(this), this.notes).start(0)
        return res
      })
  }

  strum(letter, key) {
    this.sound.strum(letter, key)
  }


  _onNextNote(time, note) {
    if (this.enabled) {
      const duration = this.part.toSeconds(note.duration)
      this.sound.play(this.chord[note.degree], time, duration)
    }
  }

  enable(enabled) {
    this.enabled = enabled
    if (enabled) {
      this.setChord(this.currentVariation.chordName, this.currentVariation.key)
    }
  }

  setChord(chordName, chordKey) {
    console.log(`Setting Part [${this.name}] to ${chordName}:${chordKey}`)
    // check if chord exists
    const notesFromChord = _.get(this.chords, `${chordName}.${chordKey}`)
    if (notesFromChord != null) {
      // alter the note mapping to the new chord
      this.chord = notesFromChord
      // store the select chord
      this.currentVariation.chordName = chordName
      this.currentVariation.key = chordKey
    } else {
      console.warn(`Chould not set part to ${chordName}:${chordKey}, it appears that one or either of them are not defined`)
    }
  }

  dispose() {
    this.part.dispose()
    this.part.removeAll()
    this.sound.dispose()
  }

  nextChord() {
    const c = Chords.nextChord()
    this.setChord(c.order, c.chord)
  }
}

export default Part
