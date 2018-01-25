import Tone from 'tone'
import Promise from 'bluebird'
import Log from '../..//Helpers/Logging'

class Fileplayer {
  /* ***************************** *

            INITIALIZATION

   * ***************************** */

  /**
   * The class loads samples of an instrument
   * and abstracts playing the notes individually.
   * Initiating the class and then calling load() is required.
   * To add an instrument, you need 8 accurate samples of
   * the following notes:
   *
   * [ Bb3, C3, C5, D6, Eb3, F4, G5, Gb6 ] in mp3 format
   *
   * @param {String} folder The folder to fetch the samples from
   */
  constructor(folder) {
    /**
     * The multibuffer player
     * @type {Tone.MultiPlayer}
     * @private
     */
    this._multiPlayer = new Tone.Players().toMaster()

    /**
     * The instrument folder
     * @type {String}
     * @private
     */
    this._instrumentFolder = folder

    /**
     * The lowest note playable
     * @type {String}
     * @private
     */
    this._lowestNote = 'C3'

    /**
     * The highest note playable
     * @type {String}
     * @private
     */
    this._highestNote = 'Gb6'

    /**
     * The number of chromatic steps (up and down) which the sample
     * will be re-pitched
     * @type {Number}
     * @private
     */
    this._stepSize = 3

    /**
     * The number of buffers currently
     * loading.
     * @type {Number}
     * @private
     */
    this._loadCount = 0

    /**
     * The sample lookup. Each note maps to a buffer and a playbackRate
     * @type {Object}
     * @private
     */
    this._notes = {}

    /**
     * Holds all the buffers
     * @type {Object}
     * @private
     */
    this._buffers = {}

    /**
     * Holds the note numbers based on a chromatic scale
     * @type {Array}
     * @private
     */
    this._allNotes = this._getNotes(this._lowestNote, this._highestNote)

    /**
     * if all the samples are loaded
     * @type {Boolean}
     */
    this.loaded = false
  }

  /**
   * After initializing the player load() should be called
   * All buffers are loaded and a player is generated for every
   * re-pitched note
   * @returns {Promise.<object, Error>}
   */
  load() {
    const promiseArray = []
    const forStep = (this._stepSize * 2) + 1

    for (let noteIndex = 0; noteIndex < this._allNotes.length; noteIndex += forStep) {
      const bufferPitch = this._allNotes[noteIndex + this._stepSize]
      const end = Math.max(forStep, this._allNotes.length)

      if (!_.isNil(bufferPitch)) {
        promiseArray.push(this._createBufferPromise(bufferPitch, noteIndex, end, this._allNotes))
      }
    }

    return Promise.all(promiseArray)
      .then((res) => {
        this.loaded = true
        return res
      })
      .catch((err) => {
        console.error('Instrument files did not load successfully, plase make sure there ' +
          'are files with the names Bb3.mp3, C3.mp3, C5.mp3, D6.mp3, Eb3.mp3, F4.mp3, G5.mp3, ' +
          'Gb6.mp3 inside the folder')
        return Promise.reject(new Error('Did not load instrument completely'))
      })
  }

  /* ***************************** *

              PLAYBACK

   * ***************************** */

  /**
   * Fires a note from the current instrument
   * @param note Note number
   * @param duration Duration of note playing in sec
   * @param startTime The exact start time
   * @returns {object}
   */
  triggerAttackRelease(note, duration, startTime) {
    const description = this._notes[note]

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

  /**
   * Method to stop a note playing from a player
   * @param note
   * @param time
   */
  triggerRelease(note, time) {
    const description = this._notes[note]
    this._multiPlayer.stop(description.buffer, time)
  }

  /**
   * Stop all the players
   */
  releaseAll() {
    this._multiPlayer.stopAll()
  }

  /* ***************************** *

              DESTRUCT

   * ***************************** */

  /**
   * Destroy everything
   */
  dispose() {
    this.releaseAll()
    for (const buff in this._buffers) {
      this._buffers[buff].dispose()
    }
    this._buffers = null
    this._notes = null
  }

  /* ***************************** *

            CALCULATE NOTES

   * ***************************** */

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
     * Chromatic scale is notes that are separated via semitones
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
    return retNotes
  }

  /**
   * Check if note needs respelling.
   * @param note
   * @returns {(String|Null)} New name, or null
   * @private
   */
  _getNotesRespelling(note) {
    const respelling = {
      Db: 'C#', Eb: 'D#', Gb: 'F#', Ab: 'G#', Bb: 'A#',
    }
    const splitRegexp = /(-?\d+)/
    const pitch = note.split(splitRegexp)[0]
    const octave = parseInt(note.split(splitRegexp)[1], 10)
    if (Object.prototype.hasOwnProperty.call(respelling, pitch)) {
      return respelling[pitch] + octave.toString()
    }
    return null
  }

  /* ***************************** *

                BUFFERS

   * ***************************** */

  /**
   * Grab buffer from url and append to the fileplayer class
   * to be ready for use.
   * @param bufferPitch Name of the buffer
   * @param noteIndex
   * @param end
   * @param allNotes
   * @returns {*|Promise.<T>}
   * @private
   */
  _createBufferPromise(bufferPitch, noteIndex, end, allNotes) {
    return new Promise((resolve, reject) => new Tone.Buffer(`${this._instrumentFolder}/${bufferPitch}.mp3`, buffer => resolve(buffer)))
      .then((res) => {
        this._loadCount -= 1
        if (this._loadCount === 0) this.loaded = true

        this._multiPlayer.add(bufferPitch, res)
        this._buffers[bufferPitch] = res

        for (let j = noteIndex; j < end; j++) {
          // insert note from buffer
          const note = allNotes[j]
          this._notes[note] = {
            interval: (j - noteIndex - this._stepSize),
            buffer: bufferPitch,
          }

          // and the respelling if it exists
          const respelling = this._getNotesRespelling(note)
          if (respelling) this._notes[respelling] = this._notes[note]
        }
        return res
      })
      .catch((e) => {
        console.err(`Buffer failed: ${JSON.stringify(e)}...`)
        return Promise.reject(new Error())
      })
  }

  /* ***************************** *

                  MISC

   * ***************************** */

  /**
   * Converts buffers interval to Frequency ratio
   * @param interval
   * @returns {number}
   * @private
   */
  _intervalToFrequencyRatio(interval) {
    return Math.pow(2, (interval / 12))
  }
}

export default Fileplayer
