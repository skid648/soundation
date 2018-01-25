import _ from 'lodash'
import Tone from 'tone'
import Note from './Note'
import Sound from './Sound'
import Chords from '../data/ChordsAndNotesGenerator'

/**
 * Part is a sequence of sounds that play respectively
 */
class Part {
  /**
   * To create a part you need to provide an array of
   * degrees to play the corresponding note in the chord
   * that has been set.
   * E.g 0.1
   *  [
   *     { time: '4n * 0', degree: 0, duration: '4n' },
   *     { time: '4n * 1', degree: 1, duration: '4n' },
   *     { time: '4n * 2', degree: 2, duration: '4n' },
   *     { time: '4n * 3', degree: 3, duration: '4n' },
   *  ]
   * @param partData An array like the example 0.1
   * @param partName The name of the part
   */
  constructor(instrumentUrl, partData, partName) {
    this.instrumentUrl = instrumentUrl
    this.notes = []
    this.chord = {}
    this.name = partName
    this.sound = new Sound(this.instrumentUrl)
    this.enabled = false
    this.chords = Chords.getChords()
    this.currentVariation = { chordName: 'major', key: 'C' }

    let note = []

    /**
     * Transform partData to Notes object
     * and fill this.notes
     */
    _.forEach(partData, (partNote) => {
      note = [partNote.time, new Note(partNote.time, partNote.degree, partNote.duration)]
      this.notes.push(note)
    })
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
      .catch((err) => {
        console.error(`Sound did not load correctly: ${err}`)
      })
  }

  /**
   * Strums the current sound
   * @param letter
   * @param key
   */
  strum(letter, key, delay = 0) {
    setTimeout(() => this.sound.strum(letter, key), delay)
  }

  /**
   * Change part's chord
   * @param chordName
   * @param chordKey
   */
  setChord(chordName, chordKey) {
    // console.debug(`Setting Part [${this.name}] to ${chordName}:${chordKey}`)
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

  /**
   * Destroy everything and clean up
   */
  dispose() {
    this.part.dispose()
    this.part.removeAll()
    this.sound.dispose()
  }

  /**
   * Get the next chord automatically
   */
  nextChord() {
    const c = Chords.nextChord()
    this.setChord(c.order, c.chord)
  }

  setChordFromColor(colorCode) {
    const key = Chords.colorToKey(colorCode)
    // console.log(`Setting part from color: ${colorCode} to key: ${JSON.stringify(key)}`)
    this.setChord(key.order, key.chord)
    return key.chord
  }

  /**
   * Unmutes the part
   */
  enable() {
    this.enabled = true
  }

  /**
   * Mutes the part
   */
  disable() {
    this.enabled = false
  }

  /**
   * Callback that fires when the sound
   * should play a note
   * @param time
   * @param note
   * @private
   */
  _onNextNote(time, note) {
    if (this.enabled) {
      const duration = this.part.toSeconds(note.duration)
      this.sound.play(this.chord[note.degree], time, duration)
    }
  }
}

export default Part
