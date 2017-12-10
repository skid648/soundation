import _ from 'lodash'

import Tone from 'tone'
import Part from './models/music/Part'
import Interface from './interface'
import CoreParts from './models/data/CoreParts'

class Soundation {
  /**
   *
   * @param bpm Overval bpm of soundation
   * @param partName Choose the part to be played initially
   * @param key Set the key that soundation starts with
   * @param autostart Set false to disable the the player from starting after loading
   * @returns {*}
   */
  constructor(bpm = 50, partName = '1 note', autostart = true) {
    console.debug(`New Soundation Object bpm: ${bpm}, part name: ${partName}`)
    // Set bpm or default 100
    this._setBpm(bpm)
    // Set part name or default part is '1 note'
    this.partName = partName
    this.autostart = autostart
  }

  /**
   * @public
   */

  load() {
    // Load the resources, set the initial key, and start the tone transport
    return this._initializeConfiguration()
      .then(() => {
        this._partPlaying.setChord('major', 'D#')
        if (this.autostart) Tone.Transport.start()
      })
  }

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

  pause() {
    Tone.Transport.stop()
  }

  resume() {
    Tone.Transport.start()
  }

  strum(letter, chord) {
    this._partPlaying.strum(letter, chord)
  }

  destroy() {
    this._partPlaying.dispose()
  }

  /**
   * @private
   */

  _initializeConfiguration() {
    // if true soundation keeps looping the track set
    this._loopTransportEnable(true)

    // Gets and sets the default track
    const part = CoreParts.get(this.partName)
    console.log(part)
    this._partPlaying = new Part(part, this.partName)
    // here part loads sound from urls and returns a promise
    return this._partPlaying.start()
  }

  _loopTransportEnable(switchOn) {
    Tone.Transport.loop = _.isNil(switchOn) ? true : switchOn
    Tone.Transport.loopStart = '0m'
    Tone.Transport.loopEnd = '1m'
  }

  _setBpm(bpm) {
    console.debug(`Setting bpm to ${bpm}`)
    if (!_.isNil(bpm) && bpm > 0) {
      Tone.Transport.bpm.value = bpm
      this.bpm = bpm
    } else {
      console.warn('You cannot set BPM to a null, negative, or zero value')
    }
  }

  /**
   * Get the next key from the chroma association
   * @private
   */
  _nextKey() {
    this._partPlaying.setChord('minor', 'C#')
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
        if (this.bpm <= goal) {
          this._setBpm(this.bpm - step)
        } else {
          console.log('transition ended')
          clearInterval(animation)
        }
      }, delay)
    }
  }

  /**
   * Loops tracks
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
