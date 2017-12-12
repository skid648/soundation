import _ from 'lodash'

import Tone from 'tone'
import Part from './models/music/Part'
import CoreParts from './models/data/CoreParts'

class Soundation {
  /**
   * Constructs and returns the object
   * @param bpm Overval bpm of soundation
   * @param partName Choose the part to be played initially
   * @param autostart Set false to disable the the player from starting after loading
   * @returns {*}
   */
  constructor(bpm = 100, partName = '1 note', autostart = true) {
    this._setBpm(bpm)
    this.partName = partName
    this.autostart = autostart
  }

  /* ***************************** *

            PUBLIC METHODS

   * ***************************** */

  /**
   * load initializes ths soundation object.
   * This involves grabing all the instrument
   * sounds, initializing the chord that the part
   * will play and finally starts the transport
   * if autoplay is set to true. (Transport is tone's
   * master time keeper and needs to be started for
   * the events to be played)
   */
  load() {
    return this._initializeConfiguration()
      .then(() => {
        this._partPlaying.setChord('major', 'D#')
        if (this.autostart) Tone.Transport.start()
      })
  }

  /**
   * Soundation can transform it's sound real time
   * either directly thought the public api or can
   * Automatically advance the variables and loop them
   *
   * This method takes care of the automatic transition
   * Auto advance to the next sound transformation
   * @param method can be one of ['key', 'bpm', 'track']
   */
  next(method) {
    console.debug(`Advancing to next ${method}`)
    switch (method) {
      case 'key':
        this._nextKey()
        break
      case 'bpm':
        this._transitionBpm()
        break
      case 'track':
        this._nextTrack()
        break
      default:
        // default case is key
        this._nextKey()
        break
    }
  }

  /* ***************************** *

             API METHODS

   * ***************************** */

  /**
   *
   * @param key
   * @param color
   */
  setKey({ key, color }) {

  }

  /**
   *
   * @param trackname
   */
  setTrack({ trackname }) {

  }

  /**
   *
   * @param bpm
   * @param transition currenlty not supported
   */
  setBpm({ bpm, transition }) {

  }

  /* ***************************** *

      USEFUL GENERIC-USE METHODS

   * ***************************** */

  /**
   * Pause stops soundation object from playing
   * without disposing anything. Used together with
   * resume()
   */
  pause() {
    Tone.Transport.stop()
  }

  /**
   * resume resumes soundation object from the start
   * Used together with pause()
   */
  resume() {
    Tone.Transport.start()
  }

  /**
   * Strum plays a bulk of notes from a chord
   * one close to the other. Can be called
   * multiple times
   * @param letter Letter of key E.g. minor
   * @param chord Name of the chord E.g. C#
   */
  strum(letter, chord) {
    this._partPlaying.strum(letter, chord)
  }

  /**
   * Destructor of the class.
   * Cleans eventing up.
   */
  destroy() {
    this._partPlaying.dispose()
  }

  /* ***************************** *

           PRIVATE METHODS

   * ***************************** */

  /**
   * Used to initialize configuration of
   * soundation the first time.
   *  - Sets looping
   *  - Retrieves the part to be played
   *  - Initiliazes the part and starts it
   * @returns {promise[thenable]}
   * @private
   */
  _initializeConfiguration() {
    // if true soundation keeps looping the track set
    this._loopTransportEnable(true)
    const part = CoreParts.get(this.partName)
    this._partPlaying = new Part(part, this.partName)
    return this._partPlaying.start()
  }

  /**
   * Enables sample looping
   * @param switchOn
   * @private
   */
  _loopTransportEnable(switchOn) {
    Tone.Transport.loop = _.isNil(switchOn) ? true : switchOn
    Tone.Transport.loopStart = '0m'
    Tone.Transport.loopEnd = '1m'
  }

  /**
   * Changes and stores bpm
   * @param bpm
   * @private
   */
  _setBpm(bpm) {
    if (!_.isNil(bpm) && bpm > 0) {
      Tone.Transport.bpm.value = bpm
      this.bpm = bpm
    } else {
      console.warn('You cannot set BPM to a null, negative, or zero value')
    }
  }

  /**
   * Get the next key from the chroma array
   * @private
   */
  _nextKey() {
    this._partPlaying.nextChord()
  }

  /**
   * Circles and transition bpm from
   *  - 0 -> 100
   *  - 100 ->200
   *  - 200 -> 300
   *  - anything to 10
   * @private
   */
  _transitionBpm() {
    let goal = 0
    const delay = 100
    const step = 5
    const i = 0
    console.debug(`Bpm starts from ${this.bpm}`)
    if (this.bpm > 0 && this.bpm <= 100) {
      console.log('Bpm state 1')
      goal = 101
      const animation = setInterval(() => {
        if (this.bpm <= goal) {
          this._setBpm(this.bpm + step)
        } else {
          console.log('transition ended')
          clearInterval(animation)
        }
      }, delay)
    } else if (this.bpm > 100 && this.bpm <= 200) {
      console.log('Bpm state 2')
      goal = 201
      const animation = setInterval(() => {
        if (this.bpm <= goal) {
          this._setBpm(this.bpm + step)
        } else {
          console.log('transition ended')
          clearInterval(animation)
        }
      }, delay)
    } else if (this.bpm > 200 && this.bpm <= 300) {
      console.log('Bpm state 3')
      goal = 301
      const animation = setInterval(() => {
        if (this.bpm <= goal) {
          this._setBpm(this.bpm + step)
        } else {
          console.log('transition ended')
          clearInterval(animation)
        }
      }, delay)
    } else {
      goal = 70
      const animation = setInterval(() => {
        if (this.bpm >= goal) {
          this._setBpm(this.bpm - step)
        } else {
          console.log('transition ended')
          clearInterval(animation)
        }
      }, delay)
    }
  }

  /**
   * Returns the next track data.
   * If no track is next it starts
   * looping again the tracks
   * @private
   */
  _nextTrack() {
    const nextTrack = CoreParts.next()
    const partReplacment = new Part(nextTrack.partData, nextTrack.partName)
    return partReplacment.start()
      .then(() => {
        this._partPlaying.dispose()
        this._partPlaying = partReplacment
      })
  }
}

export default Soundation
