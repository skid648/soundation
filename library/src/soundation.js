import _ from 'lodash'

import Tone from 'tone'
import Part from './Models/music/Part'
import CoreParts from './Models/data/CoreParts'
import Classifier from './Models/color/Classifier'
import Chords from './Models/data/ChordsAndNotesGenerator'


class Soundation {
  /**
   * Constructs and returns the Soundation object
   * @param bpm Overall bpm of soundation
   * @param partName Choose the part to be played initially
   * @param autostart Set false to disable the the player from starting after loading
   * @returns {*}
   */
  constructor(instrumentUrl, bpm = 60, partName = '1 note', autostart = false) {
    this.instrumentUrl = instrumentUrl
    this._setBpm(bpm)
    this.partName = partName
    this.autostart = autostart
    this.colorClassifier = new Classifier({ imageArray: {}, segments: 10 })
  }

  /* ***************************** *

            PUBLIC METHODS

   * ***************************** */

  /**
   * Initializes ths soundation object.
   * This involves grabbing all the instrument
   * sounds, initializing the chord that the part
   * will play and finally starts the transport
   * if autoplay is set to true. (Transport is tone's
   * master time keeper and needs to be started for
   * the events to be played)
   */
  load() {
    return this._initializeConfiguration()
      .then((res) => {
        this._partPlaying.setChord('major', 'D#')
        if (this.autostart) Tone.Transport.start()
        return res
      })
  }

  /**
   * Sets and loads a color classifier
   * based on an image given. If no
   * image given it generates a generic
   * classifier to a rainbow palette.
   * @param image An image object
   * @param segments number of segments to extract palette
   */
  imageClassifier(image, segments) {
    this.colorClassifier = new Classifier({
      imageArray: image,
      segments,
    })
  }

  /**
   * Soundation can transform it's sound real time
   * either directly thought the public api or can
   * automatically advance the variables and loop them
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
   * Manually alter the key that the sound
   * will play in. You can set the key directly
   * or you can let the library decide the key
   * based on a color.
   * @param key
   * @param color
   */
  key({ key, color }) {
    if (!_.isNil(key.order) && !_.isNil(key.chord)) {
      // manually setting the key
      this._partPlaying.setChord(key.order, key.chord)
    } else if (!_.isNil(color)) {
      // passing a color argument and let the color classifier decide the key
      const c = this.colorClassifier.color(color, true)
      this._partPlaying.setChordFromColor(c)
    }
  }

  /**
   * Alter the part that is playing
   * to another predefined track
   * // TODO: document track names
   * @param trackname
   */
  track({ trackname }) {
    // TODO: implement track change
  }

  /**
   * Alter how fast or slow the track is
   * playing. Bpm gradually transition from
   * the current value to the new one
   * @param bpm
   * @param transition currently not supported
   */
  bpm({ bpm, transition }) {
    // TODO: implement bpm change
  }

  /**
   * Speaks out loud the color name.
   * @param color {r, g, b} object
   */
  shoutColor(color) {
    this.colorClassifier.shoutColor(color)
  }

  /* ***************************** *

      USEFUL GENERIC-USE METHODS

   * ***************************** */

  /**
   * Stops soundation object from playing
   * without disposing anything. Used together with
   * resume()
   */
  pause() {
    Tone.Transport.stop()
  }

  /**
   * Resumes soundation object from the start
   * Used together with pause()
   */
  resume() {
    Tone.Transport.start()
  }

  /**
   * Plays a bulk of notes from a chord
   * one close to the other. Can be called
   * multiple times. Takes either a key or
   * a color
   * @param key: { letter: 'minor', chord: 'C#'}
   * @param color: { r: 10, g: 130, b: 255 }
   */
  strum({ key, color }) {
    if (!_.isNil(key) && !_.isNil(key.chord) && !_.isNil(key.letter)) {
      ({ letter, chord } = { letter: key.letter, chord: key.chord })
      this._partPlaying.strum(letter, chord)
    } else if (!_.isNil(color)) {
      key = Chords.colorToKey(color);
      ({ letter, chord } = { letter: key.letter, chord: key.chord })
      this._partPlaying.strum(letter, chord)
    }
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
    // if true soundation keeps looping the part
    this._loopTransportEnable(true)
    // grab the part from CoreParts
    const part = CoreParts.get(this.partName)
    // initiate the part
    this._partPlaying = new Part(this.instrumentUrl, part, this.partName)
    // start the part
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
   * Gets the next key from the chroma array
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
   * Returns the next track chartData.
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
