import ColorClassifier, { Palette } from 'color-classifier'
import _ from 'lodash'

class Classifier {
  constructor({ imageArray, segments }) {
    /**
     * Check for color palette segmentation
     * if not is set we pick the 10 most frequent colors
     * @type {number}
     */
    this.segments = _.isNil(segments) ? 10 : segments

    /**
     * Declaring some predefined palettes from
     * color-classifier library
     */
    this.w3c = Palette.W3C
    this.rainbow = Palette.RAINBOW

    /**
     * Extract the palette if imageArray is given
     * If not we pick the rainbow palette
     */
    this.palette = _.isEmpty(imageArray) ? this.rainbow : this._extractColorPalette(imageArray)

    /**
     * Debug
     */
    this._printPalette()

    /**
     * Construct the classifier
     */
    this.colorClassifier = new ColorClassifier(this.palette)

    /**
     * A table with color names
     * @type {[*]}
     */
    this.colorTable = [
      { name: 'black', hex: '#000000' },
      { name: 'silver', hex: '#C0C0C0' },
      { name: 'gray', hex: '#808080' },
      { name: 'white', hex: '#FFFFFF' },
      { name: 'maroon', hex: '#800000' },
      { name: 'red', hex: '#FF0000' },
      { name: 'purple', hex: '#800080' },
      { name: 'fuchsia', hex: '#FF00FF' },
      { name: 'green', hex: '#008000' },
      { name: 'lime', hex: '#00FF00' },
      { name: 'olive', hex: '#808000' },
      { name: 'yellow', hex: '#FFFF00' },
      { name: 'navy', hex: '#000080' },
      { name: 'blue', hex: '#0000FF' },
      { name: 'teal', hex: '#008080' },
      { name: 'aqua', hex: '#00FFFF' },
    ];
  }

  // PUBLIC METHODS

  /**
   * Returns the rbg value of the classification
   * @param sample A hex color value
   * @returns {*}
   */
  color(sample, toHex = false) {
    if (_.isNil(sample)) {
      console.warn('No color given to classify')
      return null
    }
    return toHex
      ? this._rgb2hex(this.colorClassifier.classify(sample))
      : this.colorClassifier.classify(sample)
  }

  /**
   * Takes an {r, g, b} object and shouts it's closest color name
   * @param color
   */
  shoutColor(color) {
    try {
      const colorName = new SpeechSynthesisUtterance(this._findClosestColorRGB(color))
      window.speechSynthesis.speak(colorName)
    } catch (e) {
      console.warn(`Trying to synthesize speech: ${e}`)
    }
  }

  /**
   * Returns the generated / extracted palette
   * @returns {*}
   */
  getPalette() {
    return this.palette
  }

  // INTERNAL CALCULATIONS

  /**
   * TODO: this needs further implementation an optimization
   * TODO: it currently returns colors that are close to each other
   * Extracts color palette from an imageArray
   * @param imageArray
   * @private
   */
  _extractColorPalette(imageArray) {
    /**
     * Check if image array is indeed an image
     */
    if (_.isNil(imageArray) || _.isNil(imageArray.data) || _.isNil(imageArray.data.length)) {
      console.warn('Malformed image array. Should have prop `chartData` and should be an array')
      return null
    }

    /**
     * Keeps track of unique colors
     * @type {Array}
     */
    const colorList = []

    /**
     * Quickly iterate over all pixels
     * extract hex and push it to color array
     */
    for (let i = 0, n = imageArray.data.length; i < n; i += 4) {
      const r = imageArray.data[i];
      const g = imageArray.data[i + 1];
      const b = imageArray.data[i + 2];

      const hex = this._rgb2hex({ r, g, b });

      colorList.push(hex)
    }

    /**
     * Slice array to given segments based on
     * value frequency. This will return an
     * array with the N most used colors
     */
    return this._sortByFrequency(colorList).slice(0, this.segments)
  }

  /**
   * Sorts an array by item frequency
   * @param array
   * @returns {*|Array.<T>|void}
   * @private
   */
  _sortByFrequency(array) {
    const frequency = {}

    array.forEach((value) => {
      frequency[value] = 0
    })

    const uniques = array.filter(value => ++frequency[value] === 1)

    return uniques.sort((a, b) => frequency[b] - frequency[a])
  }

  // TODO: delete this as it's only for debugging
  _printPalette() {
    _.forEach(this.palette, (color) => {
      const e = $(`<div id="${color.replace('#', '')}" class="pcolor"></div>`)

      e.css('width', '200px')
      e.css('height', '200px')
      e.css('display', 'flex')
      e.css('background-color', `${color}`)
      e.css('background-color', `${color}`)

      $('#palette').append(e)
    })
  }

  /**
   * Takes a hex and return its english name
   * @param hex
   * @param table
   * @returns {string}
   * @private
   */
  _findClosestColorRGB({ r, g, b }) {
    const rgb = { r, g, b }
    let delta = 3 * 256 * 256
    let c = { r: 0, g: 0, b: 0 }
    let nameFound = 'black'

    for (let i = 0; i < this.colorTable.length; i++) {
      c = this._hex2rgb(this.colorTable[i].hex)
      if (Math.pow(c.r - rgb.r, 2) + Math.pow(c.g - rgb.g, 2) + Math.pow(c.b - rgb.b, 2) < delta) {
        delta = Math.pow(c.r - rgb.r, 2) + Math.pow(c.g - rgb.g, 2) + Math.pow(c.b - rgb.b, 2)
        nameFound = this.colorTable[i].name
      }
    }
    return nameFound
  }

  /**
   * Transform hex color value to rgb
   * @param hex
   * @returns {{r: *, g: number, b: number}}
   * @private
   */
  _hex2rgb(hex) {
    if (hex.lastIndexOf('#') > -1) {
      hex = hex.replace(/#/, '0x')
    } else {
      hex = `0x${hex}`
    }
    const r = hex >> 16
    const g = (hex & 0x00FF00) >> 8
    const b = hex & 0x0000FF
    return { r, g, b }
  }

  /**
   * Transform an rgb color object to hex value
   * @param r
   * @param g
   * @param b
   * @returns {string}
   * @private
   */
  _rgb2hex({ r, g, b }) {
    let rgb = `rgb(${r},${g},${b})`
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/)

    rgb = _.map(rgb, x => (`0${parseInt(x, 10).toString(16)}`).slice(-2))

    return `#${rgb[1] + rgb[2] + rgb[3]}`
  }
}

export default Classifier
