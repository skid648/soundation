import Tone from 'tone'
import Promise from 'bluebird'
import Log from '../../../library/Helpers/Logging'
import Interface from '../../../library/interface'

class Fileplayer {
  /**
     *
     * @param folder
     * @param lowestNote
     * @param highestNote
     * @param steps
     */
  constructor(folder, lowestNote, highestNote, steps) {
    /**
     * The multibuffer player
     * @type {Tone.MultiPlayer}
     * @private
     */
    this._multiPlayer = new Tone.Players().toMaster()

    /**
     * the instrument folder
     * @type {String}
     * @private
     */
    this._instrumentFolder = folder

    /**
     * The lowest note playable
     * @type {String}
     * @private
     */
    this._lowestNote = lowestNote

    /**
     * The highest note playable
     * @type {String}
     * @private
     */
    this._highestNote = highestNote

    /**
     * The number of chromaitc steps (up and down) which the sample
     * will be repitched
     * @type {Number}
     * @private
     */
    this._stepSize = steps || 4

    /**
     * The number of buffers currently
     * loading.
     * @type {Number}
     * @private
     */
    this._loadCount = 0

    /**
     * The sample lookup. Each note mapes to a buffer and a playbackRate
     * @type {Object}
     * @private
     */
    this._notes = {}

    /**
     * All the buffers
     * @type {Object}
     * @private
     */
    this._buffers = {}

    /**
     * The time it takes for the note to release
     * @type {Number}
     * @private
     */
    this._releaseTime = 0.5

    /**
     * Generate Note numbers based on chromatic scale
     * @type {Array}
     * @private
     */
    this._allNotes = this._getNotes(this._lowestNote, this._highestNote)

    console.log('Creating fileplayer')
    this.transformations = []

    this._end = Math.max((this._stepSize * 2) + 1, this._allNotes.length)

    /**
     * if all the samples are loaded
     * @type {Boolean}
     */
    this.loaded = false
  }

  /** PUBLIC METHODS */

  /**
   * After initializing the player load() should be called
   * All buffers are loaded and a player is generated for every
   * re-pitched note
   * returns Promise([thenable])
   */
  load() {
    const promiseArray = []
    let bufferPitch = {}

    let trans = {}

    const forStep = (this._stepSize * 2) + 1

    for (let noteIndex = 0; noteIndex < this._allNotes.length; noteIndex += forStep) {
      bufferPitch = this._allNotes[noteIndex + this._stepSize]
      const end = Math.max(forStep, this._allNotes.length)

      trans = { bufferPitch, noteIndex: noteIndex + this._stepSize, end }

      this.transformations.push(trans)

      if (!_.isNil(bufferPitch)) {
        promiseArray.push(this._createBufferPromise(bufferPitch, noteIndex, end, this._allNotes))
      }
    }

    return Promise.all(promiseArray)
      .then((res) => {
        this.loaded = true
        return res
      })
  }

  triggerAttackRelease(note, duration, startTime) {
    const description = this._notes[note]
    // console.log(`note:        ${note}`)
    // console.log(`duration:    ${duration}`)
    // console.log(`startTime:   ${startTime}`)
    // console.log(`description: ${JSON.stringify(description)}`)
    // console.log(`to ITFR:     ${description.interval} =>
    // ${JSON.stringify(this._intervalToFrequencyRatio(description.interval))}`)
    // Interface.logSpacerColored()

    /**
     * Grab the player based on the note given
     */
    const player = this._multiPlayer.get(description.buffer)
    /**
     * For the player to sound correctly we need to convert
     * buffers interval to Frequency ratio and alter the player
     * before triggering the sound.
     */
    player._playbackRate = this._intervalToFrequencyRatio(description.interval)

    /**
     * Finally we start the player
     *
     *    startTime: current
     *    offset: 0
     *    duration: depends on the bpm
     *
     */
    return player.start(startTime, 0, duration)
  }

  triggerRelease(note, time) {
    const description = this._notes[note]
    console.log(`Stop note | given: ${note} calculated: ${description}`)
    this._multiPlayer.stop(description.buffer, time)
  }

  /**
     * Stop all the players with
     */
  releaseAll() {
    this._multiPlayer.stopAll()
  }

  // DESTRUCT

  dispose() {
    this.releaseAll()
    for (const buff in this._buffers) {
      this._buffers[buff].dispose()
    }
    this._buffers = null
    this._notes = null
  }

  /** PRIVATE METHODS */

  // CALCULATE NOTES

  /**
     * Generates an array of notes from start
     * to end based on chromatic scale
     * @param start
     * @param end
     * @returns {Array}
     * @private
     */
  _getNotes(start, end) {
    /**
         * Chromatic scale is notes that are seperated via semitones
         * @type { Array }
         */
    const chromatic = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']

    /**
         * This regex splits the given notes symbol to note
         * and octave
         * E.g. given C3 after the split ['C', '3']
         * @type {RegExp}
         */
    const splitRegexp = /(-?\d+)/
    const startOctave = parseInt(start.split(splitRegexp)[1], 10)
    let startNote = start.split(splitRegexp)[0]

    /**
         * Calculating start note based on chromatic scale
         * Where e.g. C = 0
         * @type {number} 0 - 11
         */
    startNote = chromatic.indexOf(startNote)

    const endOctave = parseInt(end.split(splitRegexp)[1], 10)
    let endNote = end.split(splitRegexp)[0]

    endNote = chromatic.indexOf(endNote)

    /**
         * currentNote gets set to the start note
         * In the comments example is 0
         */
    let currentNote = startNote
    /**
         * currentOctave gets set to the start Octave
         * In the comments example is 3
         * @type {Number}
         */
    let currentOctave = startOctave

    const retNotes = []

    /**
         * Example for the while loop is
         *  currentNote: 0
         *  endNote: 6
         *  currentOctave: 3
         *  endOctave: 6
         */
    while (!(currentNote === endNote && currentOctave === endOctave)) {
      retNotes.push(chromatic[currentNote] + currentOctave)

      currentNote++

      if (currentNote >= chromatic.length) {
        currentNote = 0
        currentOctave++
      }
    }
    Log.SpaceTitleAndLog(`Given start: ${start}, end: ${end}, returns:`, retNotes)
    return retNotes
  }

  _getNotesRespalling(note) {
    const respelling = { Db: 'C#', Eb: 'D#', Gb: 'F#', Ab: 'G#', Bb: 'A#' }

    const splitRegexp = /(-?\d+)/
    const pitch = note.split(splitRegexp)[0]
    const octave = parseInt(note.split(splitRegexp)[1], 10)
    if (Object.prototype.hasOwnProperty.call(respelling, pitch)) {
      return respelling[pitch] + octave.toString()
    }
    return null
  }

  // BUFFERS

  _createBufferPromise(bufferPitch, noteIndex, end, allNotes) {
    return new Promise((resolve, reject) => new Tone.Buffer(`${this._instrumentFolder}/${bufferPitch}.mp3`, buffer => resolve(buffer)))
      .then((res) => {
        this._loadCount -= 1
        if (this._loadCount === 0) this.loaded = true

        this._multiPlayer.add(bufferPitch, res)
        this._buffers[bufferPitch] = res

        for (let j = noteIndex; j < end; j++) {
          const note = allNotes[j]

          this._notes[note] = {
            interval: (j - noteIndex - this._stepSize),
            buffer: bufferPitch,
          }

          // and the respelling if it exists
          const respelling = this._getNotesRespalling(note)

          if (respelling) {
            this._notes[respelling] = this._notes[note];
          }
        }
        return res
      })
      .catch((e) => {
        console.err(`Buffer failed: ${JSON.stringify(e)}...`)
        return Promise.reject(new Error())
      })
  }

  // MISC

  _intervalToFrequencyRatio(interval) {
    return Math.pow(2, (interval / 12))
  }
}

export default Fileplayer
