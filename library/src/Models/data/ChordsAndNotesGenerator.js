import Teoria from 'teoria'

class Chords {
  constructor() {
    this.Notes = { major: {}, minor: {} }
    this.majorOrder = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'F'];
    this.minorOrder = ['A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'F', 'C', 'G', 'D'];
    this.colors = {
      '#000000': { order: 'major', chord: 'C' },
      '#808080': { order: 'major', chord: 'G' },
      '#0000ff': { order: 'major', chord: 'G#' },
      '#800080': { order: 'major', chord: 'D#' },
      '#ff0000': { order: 'major', chord: 'A' },
      '#008000': { order: 'major', chord: 'F#' },
      '#ffa500': { order: 'major', chord: 'E' },
      '#ffff00': { order: 'major', chord: 'B' },
      '#00ffff': { order: 'major', chord: 'C#' },
      '#ffffff': { order: 'major', chord: 'D' },
    }
    this._calculateNotes()

    /**
     * These are used to loop all keys sequentially
     */
    this.flattenedChords = this._getFlattenedChords()
    this.chordIndex = 0
  }

  /**
   * Return Object
   * {
   *    major: {
   *       A:  [57, 61, 64, 69, 73, 76, 81, 85, 88]
   *       A#: [58, 62, 65, 70, 74, 77, 82, 86, 89]
   *       B:  [59, 63, 66, 71, 75, 78, 83, 87, 90]
   *       C:  [48, 52, 55, 60, 64, 67, 72, 76, 79]
   *       C#: [49, 53, 56, 61, 65, 68, 73, 77, 80]
   *       D:  [50, 54, 57, 62, 66, 69, 74, 78, 81]
   *       D#: [51, 55, 58, 63, 67, 70, 75, 79, 82]
   *       E:  [52, 56, 59, 64, 68, 71, 76, 80, 83]
   *       F:  [53, 57, 60, 65, 69, 72, 77, 81, 84]
   *       F#: [54, 58, 61, 66, 70, 73, 78, 82, 85]
   *       G:  [55, 59, 62, 67, 71, 74, 79, 83, 86]
   *       G#: [56, 60, 63, 68, 72, 75, 80, 84, 87]
   *    },
   *    minor: {
   *       A:  [57, 60, 64, 69, 72, 76, 81, 84, 88]
   *       A#: [58, 61, 65, 70, 73, 77, 82, 85, 89]
   *       B:  [59, 62, 66, 71, 74, 78, 83, 86, 90]
   *       C:  [48, 51, 55, 60, 63, 67, 72, 75, 79]
   *       C#: [49, 52, 56, 61, 64, 68, 73, 76, 80]
   *       D:  [50, 53, 57, 62, 65, 69, 74, 77, 81]
   *       D#: [51, 54, 58, 63, 66, 70, 75, 78, 82]
   *       E:  [52, 55, 59, 64, 67, 71, 76, 79, 83]
   *       F:  [53, 56, 60, 65, 68, 72, 77, 80, 84]
   *       F#: [54, 57, 61, 66, 69, 73, 78, 81, 85]
   *       G:  [55, 58, 62, 67, 70, 74, 79, 82, 86]
   *       G#: [56, 59, 63, 68, 71, 75, 80, 83, 87]
   *    }
   * }
   * @returns {{major: {}, minor: {}}|*}
   */
  getChords() {
    return this.Notes
  }

  nextChord() {
    if (this.chordIndex >= this.flattenedChords.length - 1) {
      this.chordIndex = 0
    } else {
      this.chordIndex = this.chordIndex + 1
    }
    return this.flattenedChords[this.chordIndex]
  }
  
  colorToKey(color) {
    return this.colors[color]
  }

  setColorMappings(mapping) {
    this.colors = mapping
  }

  // Private functions

  _calculateNotes() {
    _.forEach(this.majorOrder, (key) => {
      const major = Teoria.note(`${key}3`).chord('major')
      const minor = Teoria.note(`${key}3`).chord('minor')

      this.Notes.major[key] = []
      this.Notes.minor[key] = []

      const octaves = 3

      for (let o = 0; o < octaves; o++) {
        const majorNotes = major.notes()
        const minorNotes = minor.notes()

        _.forEach(majorNotes, (object, i) => {
          this.Notes.major[key].push(majorNotes[i].midi())
          this.Notes.minor[key].push(minorNotes[i].midi())
        })

        major.transpose(Teoria.interval('P8'))
        minor.transpose(Teoria.interval('P8'))
      }
    })
  }

  _getFlattenedChords() {
    const majorChords = _.map(this.majorOrder, chord => ({ order: 'major', chord }))
    const minorChords = _.map(this.minorOrder, chord => ({ order: 'minor', chord }))
    return _.flatten(_.union(majorChords, minorChords))
  }
}

export default new Chords()
