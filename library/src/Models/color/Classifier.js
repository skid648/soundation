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
      { name: 'white', hex: '#faebd7' },
      { name: 'orange', hex: '#d2691e' },
      { name: 'dark red', hex: '#a52a2a' },
      { name: 'red', hex: '#dc143c' },
      { name: 'purple', hex: '#8a2be2' },
      { name: 'blue', hex: '#0000ff' },
      { name: 'light blue', hex: '#00ffff' },
      { name: 'light blue', hex: '#00ffff' },
      { name: 'blue', hex: '#5f9ea0' },
      { name: 'light blue', hex: '#7fffd4' },
      { name: 'lime', hex: '#7fff00' },
      { name: 'white', hex: '#f0ffff' },
      { name: 'beige', hex: '#f5f5dc' },
      { name: 'white', hex: '#f0f8ff' },
      { name: 'beige', hex: '#ffe4c4' },
      { name: 'beige', hex: '#ffebcd' },
      { name: 'beige', hex: '#deb887' },
      { name: 'oragne', hex: '#ff7f50' },
      { name: 'light blue', hex: '#6495ed' },
      { name: 'white', hex: '#fff8dc' },
      { name: 'dark blue', hex: '#00008b' },
      { name: 'blue', hex: '#008b8b' },
      { name: 'dark gold', hex: '#b8860b' },
      { name: 'gray', hex: '#a9a9a9' },
      { name: 'green', hex: '#006400' },
      { name: 'gray', hex: '#a9a9a9' },
      { name: 'light yellow', hex: '#bdb76b' },
      { name: 'magenta', hex: '#8b008b' },
      { name: 'dark green', hex: '#556b2f' },
      { name: 'orange', hex: '#ff8c00' },
      { name: 'purple', hex: '#9932cc' },
      { name: 'dark red', hex: '#8b0000' },
      { name: 'light orange', hex: '#e9967a' },
      { name: 'light green', hex: '#8fbc8f' },
      { name: 'purple', hex: '#483d8b' },
      { name: 'dark cyan', hex: '#2f4f4f' },
      { name: 'dark cyan', hex: '#2f4f4f' },
      { name: 'light blue', hex: '#00ced1' },
      { name: 'purple', hex: '#9400d3' },
      { name: 'pink', hex: '#ff1493' },
      { name: 'blue', hex: '#00bfff' },
      { name: 'dark gray', hex: '#696969' },
      { name: 'dark gray', hex: '#696969' },
      { name: 'blue', hex: '#1e90ff' },
      { name: 'dark red', hex: '#b22222' },
      { name: 'white', hex: '#fffaf0' },
      { name: 'green', hex: '#228b22' },
      { name: 'pink', hex: '#ff00ff' },
      { name: 'white', hex: '#dcdcdc' },
      { name: 'white', hex: '#f8f8ff' },
      { name: 'gold', hex: '#ffd700' },
      { name: 'gold', hex: '#daa520' },
      { name: 'gray', hex: '#808080' },
      { name: 'green', hex: '#008000' },
      { name: 'lime', hex: '#adff2f' },
      { name: 'grey', hex: '#808080' },
      { name: 'white', hex: '#f0fff0' },
      { name: 'pink', hex: '#ff69b4' },
      { name: 'red', hex: '#cd5c5c' },
      { name: 'dark purple', hex: '#4b0082' },
      { name: 'white', hex: '#fffff0' },
      { name: 'yellow', hex: '#f0e68c' },
      { name: 'white', hex: '#e6e6fa' },
      { name: 'white', hex: '#fff0f5' },
      { name: 'lime', hex: '#7cfc00' },
      { name: 'light yellow', hex: '#fffacd' },
      { name: 'light blue', hex: '#add8e6' },
      { name: 'coral', hex: '#f08080' },
      { name: 'white', hex: '#e0ffff' },
      { name: 'light yellow', hex: '#fafad2' },
      { name: 'light gray', hex: '#d3d3d3' },
      { name: 'light lime', hex: '#90ee90' },
      { name: 'light gray', hex: '#d3d3d3' },
      { name: 'light pink', hex: '#ffb6c1' },
      { name: 'orange', hex: '#ffa07a' },
      { name: 'teal', hex: '#20b2aa' },
      { name: 'light blue', hex: '#87cefa' },
      { name: 'gray', hex: '#778899' },
      { name: 'gray', hex: '#778899' },
      { name: 'light blue', hex: '#b0c4de' },
      { name: 'white', hex: '#ffffe0' },
      { name: 'lime', hex: '#00ff00' },
      { name: 'lime', hex: '#32cd32' },
      { name: 'white', hex: '#faf0e6' },
      { name: 'pink', hex: '#ff00ff' },
      { name: 'dark red', hex: '#800000' },
      { name: 'light blue', hex: '#66cdaa' },
      { name: 'blue', hex: '#0000cd' },
      { name: 'pink', hex: '#ba55d3' },
      { name: 'purple', hex: '#9370db' },
      { name: 'green', hex: '#3cb371' },
      { name: 'purple', hex: '#7b68ee' },
      { name: 'light green', hex: '#00fa9a' },
      { name: 'light blue', hex: '#48d1cc' },
      { name: 'pink', hex: '#c71585' },
      { name: 'dark blue', hex: '#191970' },
      { name: 'white', hex: '#f5fffa' },
      { name: 'light pink', hex: '#ffe4e1' },
      { name: 'light yellow', hex: '#ffe4b5' },
      { name: 'light yellow', hex: '#ffdead' },
      { name: 'dark blue', hex: '#000080' },
      { name: 'white', hex: '#fdf5e6' },
      { name: 'green', hex: '#808000' },
      { name: 'green', hex: '#6b8e23' },
      { name: 'orange', hex: '#ffa500' },
      { name: 'red', hex: '#ff4500' },
      { name: 'light purple', hex: '#da70d6' },
      { name: 'light yellow', hex: '#eee8aa' },
      { name: 'light green', hex: '#98fb98' },
      { name: 'light blue', hex: '#afeeee' },
      { name: 'light purple', hex: '#db7093' },
      { name: 'white', hex: '#ffefd5' },
      { name: 'light brown', hex: '#ffdab9' },
      { name: 'brown', hex: '#cd853f' },
      { name: 'pink', hex: '#ffc0cb' },
      { name: 'pink', hex: '#dda0dd' },
      { name: 'light blue', hex: '#b0e0e6' },
      { name: 'purple', hex: '#800080' },
      { name: 'purple', hex: '#663399' },
      { name: 'red', hex: '#ff0000' },
      { name: 'light brown', hex: '#bc8f8f' },
      { name: 'blue', hex: '#4169e1' },
      { name: 'brown', hex: '#8b4513' },
      { name: 'salmon', hex: '#fa8072' },
      { name: 'light brown', hex: '#f4a460' },
      { name: 'green', hex: '#2e8b57' },
      { name: 'white', hex: '#fff5ee' },
      { name: 'brown', hex: '#a0522d' },
      { name: 'silver', hex: '#c0c0c0' },
      { name: 'light blue', hex: '#87ceeb' },
      { name: 'purple', hex: '#6a5acd' },
      { name: 'gray', hex: '#708090' },
      { name: 'gray', hex: '#708090' },
      { name: 'white', hex: '#fffafa' },
      { name: 'green', hex: '#00ff7f' },
      { name: 'blue', hex: '#4682b4' },
      { name: 'dark yellow', hex: '#d2b48c' },
      { name: 'teal', hex: '#008080' },
      { name: 'purple', hex: '#d8bfd8' },
      { name: 'red', hex: '#ff6347' },
      { name: 'light blue', hex: '#40e0d0' },
      { name: 'pink', hex: '#ee82ee' },
      { name: 'light yellow', hex: '#f5deb3' },
      { name: 'white', hex: '#ffffff' },
      { name: 'white', hex: '#f5f5f5' },
      { name: 'yellow', hex: '#ffff00' },
      { name: 'green', hex: '#9acd32' },
    ]
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
    const sampleGiven = { r, g, b }
    let delta = 3 * 256 * 256
    let examinator = { r: 0, g: 0, b: 0 }
    let nameFound = 'black'

    for (let i = 0; i < this.colorTable.length; i++) {
      examinator = this._hex2rgb(this.colorTable[i].hex)
      const redOffset = Math.pow(examinator.r - sampleGiven.r, 2)
      const greenOffset = Math.pow(examinator.g - sampleGiven.g, 2)
      const blueOffset = Math.pow(examinator.b - sampleGiven.b, 2)
      const sampleDelta = redOffset + greenOffset + blueOffset

      if (sampleDelta < delta) {
        delta = sampleDelta
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
