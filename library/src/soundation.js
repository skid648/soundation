import _ from 'lodash'

import Tone from 'tone'
import Part from './Models/music/Part'
import CoreParts from './Models/data/CoreParts'
import Classifier from './Models/color/Classifier'
import Chords from './Models/data/ChordsAndNotesGenerator'
import Colors from './Helpers/Color'


class Soundation {
  /**
   * Constructs and returns the Soundation object
   * @param {String} instrumentUrl The instrument's url
   * @param {Number} bpm Overall bpm of soundation
   * @param {String} partName Choose the part to be played initially
   * @param {Boolean} autostart Set false to disable the the player from starting after loading
   * @returns {*}
   */
  constructor(instrumentUrl, bpm = 60, partName = '1 note', autostart = false) {
    this.instrumentUrl = instrumentUrl
    this.currentBpm = 0
    this._setBpm(bpm)
    this.initialBpm = bpm
    this.partName = partName
    this.autostart = autostart
    this.colorClassifier = new Classifier({ imageArray: {}, segments: 10 })
    this.transitioningBpm = false
    this.colors = Colors
    this.displayElementBpm = ''
    this.displayElementKey = ''
    this.displayElementTrack = ''
    this.bpms = {
      '#000000': 50,
      '#808080': 60,
      '#0000ff': 70,
      '#800080': 80,
      '#ff0000': 90,
      '#008000': 100,
      '#ffa500': 110,
      '#ffff00': 120,
      '#00ffff': 130,
      '#ffffff': 140,
    }
    this.tracks = {
      '#000000': '1 note',
      '#808080': '2 notes',
      '#0000ff': '3 notes',
      '#800080': '4 notes',
      '#ff0000': '4 notes',
      '#008000': '4 notes',
      '#ffa500': '4 notes',
      '#ffff00': '5 notes',
      '#00ffff': '6 notes',
      '#ffffff': '7 notes',
    }
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
        this._circleBpm()
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

            SETTER METHODS

   * ***************************** */

  setBpmMapping(mapping) {
    this.bpms = mapping
  }

  setTrackMapping(mapping) {
    this.tracks = mapping
  }

  setKeyMapping(mapping) {
    this._partPlaying.setChordsColorMapping(mapping)
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
  key({ key, color, displayElement }) {
    /**
     * Change in which element it
     * should display the current value
     */
    this.displayElementKey = displayElement
    /**
     * Either key is set directly or we
     * translate a color to it
     */
    if (!_.isNil(key) && !_.isNil(key.order) && !_.isNil(key.chord)) {
      /**
       * Manualy setting the key
       */
      this._partPlaying.setChord(key.order, key.chord)
    } else if (!_.isNil(color)) {
      /**
       * Passing a color argument and let
       * the color classifier decide the key
       */
      const chord = this._partPlaying.setChordFromColor(this.colorClassifier.color(color, true))
      $(this.displayElementKey).html(chord)
    }
  }

  /**
   * Alter the part that is playing
   * to another predefined track
   * // TODO: document track names
   * @param trackname
   */
  track({ trackname, color, displayElement }) {
    /**
     * Change in which element it
     * should display the current value
     */
    this.displayElementTrack = displayElement
    /**
     * Either track name is set directly or we
     * translate a color to it
     */
    if (!_.isNil(trackname)) {
      /**
       * Manualy setting the track
       * from the name given
       */
      this._setTrack(trackname)
    } else if (!_.isNil(color)) {
      /**
       * Passing a color argument and let
       * the color classifier decide the track
       */
      this._setTrack(this._colorToTrack(this.colorClassifier.color(color, true)))
    }
  }

  /**
   * Alter how fast or slow the track is
   * playing. Bpm gradually transition from
   * the current value to the new one
   * @param bpm
   * @param transition currently not supported
   */
  bpm({ bpm, color, displayElement }) {
    /**
     * Change in which element it
     * should display the current value
     */
    this.displayElementBpm = displayElement
    /**
     * Either bpm is set directly or we
     * translate a color to it
     */
    if (!_.isNil(bpm)) {
      /**
       * Manualy setting the bpm
       */
      this._transitionBpm(bpm)
    } else if (!_.isNil(color)) {
      /**
       * passing a color argument and let
       * the color classifier decide the bpm
       */
      this._transitionBpm(this._colorToBpm(this.colorClassifier.color(color, true)))
    }
  }

  /**
   * Speaks out loud the color name.
   * @param color object 'r,g,b'
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
    this._partPlaying.disable()
    this._setBpm(this.initialBpm)
    Tone.Transport.stop()
  }

  /**
   * Resumes soundation object from the start
   * Used together with pause()
   */
  resume() {
    this._partPlaying.enable()
    Tone.Transport.start()
  }

  /**
   * Plays a bulk of notes from a chord
   * one close to the other. Can be called
   * multiple times. Takes either a key or
   * a color
   * @param key object "letter: 'minor', chord: 'C#'"
   * @param color object " r: 10, g: 130, b: 255 "
   */
  strum({ key, color, delay }) {
    if (!_.isNil(key) && !_.isNil(key.chord) && !_.isNil(key.letter)) {
      ({ letter, chord } = { letter: key.letter, chord: key.chord })
      this._partPlaying.strum(letter, chord)
    } else if (!_.isNil(color)) {
      key = Chords.colorToKey(this.colorClassifier.color(color, true))
      this._partPlaying.strum(key.order, key.chord, delay)
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
   * Sets looping,
   * Retrieves the part to be played,
   * Initiliazes the part and starts it
   * @returns {Promise.<null, Error>}
   * @private
   */
  _initializeConfiguration() {
    // if true soundation keeps looping the part
    this._loopTransportEnable(true)

    // load all the parts
    const partObjects = CoreParts.get('all')

    this.parts = []

    _.forEach(partObjects, (part) => {
      this.parts.push(new Part(this.instrumentUrl, part.partData, part.partName))
    })

    // initialize the parts
    return Promise.all(_.map(this.parts, part => part.start()))
      .then(() => {
        // Set default part
        this._partPlaying = _.find(this.parts, { name: this.partName })
      })
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
    $(this.displayElementBpm).html(bpm)
    console.debug(`│  Bpm => [${bpm}]`)
    if (!_.isNil(bpm) && bpm > 0) {
      Tone.Transport.bpm.value = bpm
      this.currentBpm = bpm
    } else {
      this.currentBpm = 1
      console.warn('You cannot set BPM to a null, negative, or zero value setting to 1')
    }
  }

  /**
   * Changes track based on name
   * @param trackname
   * @private
   */
  _setTrack(trackName) {
    const previousTrack = this._partPlaying
    $(this.displayElementTrack).html(trackName)
    this._partPlaying.disable()
    if (_.find(this.parts, { name: trackName }) != null) {
      this._partPlaying = _.find(this.parts, { name: trackName })
    } else {
      this._partPlaying = previousTrack
      console.warn(`Searching for track: ${trackName} => ${JSON.stringify(_.find(this.parts, { name: trackName }))}`)
    }
    this._partPlaying.setChord('major', 'D#')
    this._partPlaying.enable()
  }

  /**
   * Circles and transition bpm from
   *  0 -> 100, 100 ->200, 200 -> 300, anything to 10
   * @private
   */
  _circleBpm() {
    let goal = 0
    const delay = 100
    const step = 5
    const i = 0
    if (this.currentBpm > 0 && this.currentBpm <= 100) {
      goal = 101
      const animation = setInterval(() => {
        if (this.currentBpm <= goal) {
          this._setBpm(this.currentBpm + step)
        } else {
          clearInterval(animation)
        }
      }, delay)
    } else if (this.currentBpm > 100 && this.currentBpm <= 200) {
      goal = 201
      const animation = setInterval(() => {
        if (this.currentBpm <= goal) {
          this._setBpm(this.currentBpm + step)
        } else {
          clearInterval(animation)
        }
      }, delay)
    } else if (this.currentBpm > 200 && this.currentBpm <= 300) {
      goal = 301
      const animation = setInterval(() => {
        if (this.currentBpm <= goal) {
          this._setBpm(this.currentBpm + step)
        } else {
          clearInterval(animation)
        }
      }, delay)
    } else {
      goal = 70
      const animation = setInterval(() => {
        if (this.currentBpm >= goal) {
          this._setBpm(this.currentBpm - step)
        } else {
          clearInterval(animation)
        }
      }, delay)
    }
  }

  /**
   * Transitions bpm to another value
   * TODO: make transition smoother?
   * @param target
   * @private
   */
  _transitionBpm(target) {
    if (!this.transitioningBpm) {
      this.transitioningBpm = true
      // how fast the animation ticks
      const changeRate = 100

      // how much the animation proceeds
      const step = 5

      // if direction is positive then we have to reduce bpm
      const direction = this.currentBpm - target

      // Create an interval and destroy it when it's done
      if (direction > 0) {
        console.debug(`╭ Reducing bpm [${this.currentBpm}] => [${target}]`)
        const animation = setInterval(() => {
          if (this.currentBpm > target) {
            this._setBpm(this.currentBpm - step)
          } else {
            clearInterval(animation)
            console.debug('╰ Transition end')
            this.transitioningBpm = false
          }
        }, changeRate)
      } else if (direction < 0) {
        console.debug(`╭ Advancing bpm [${this.currentBpm}] => [${target}]`)
        const animation = setInterval(() => {
          if (this.currentBpm < target) {
            this._setBpm(this.currentBpm + step)
          } else {
            clearInterval(animation)
            console.debug('╰ Transition end')
            this.transitioningBpm = false
          }
        }, changeRate)
      } else {
        this.transitioningBpm = false
      }
    }
  }

  /**
   * Maps distinct color to bpm values
   * @param {String} Hex A hex value
   * @returns {*}
   * @private
   */
  _colorToBpm(hex) {
    return this.bpms[hex]
  }

  /**
   * Maps color to track names
   * @param {String} Hex A hex value
   * @returns {*}
   * @private
   */
  _colorToTrack(hex) {
    return this.tracks[hex]
  }

  /**
   * Returns the next track chartData.
   * If no track is next it starts
   * looping again the tracks
   * @private
   */
  _nextTrack() {
    const nextTrack = CoreParts.next()
    this._setTrack(nextTrack)
  }

  /**
   * Gets the next key from the chroma array
   * @private
   */
  _nextKey() {
    this._partPlaying.nextChord()
  }
}

export default Soundation
