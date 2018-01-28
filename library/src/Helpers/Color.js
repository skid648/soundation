class Color {
  /**
   * Returns a color from the current mouse event on an image.
   * 1. Extracts coordinates from the element [browser specific]
   * 2. Gets color from image canvas object [image specific]
   *
   * @param event
   * @param imageSelector
   * @param imageData
   * @returns {*}
   */
  static get(event, imageSelector, imageData) {
    const image = $(imageSelector)[0]
    const yOffset = image.naturalHeight - image.height
    const xOffset = image.naturalWidth - image.width
    // console.log(`Height offset: ${yOffset}, Width offset: ${xOffset}`)
    if ($(imageSelector)[0] != null) {
      const coords = this.getMouseCoordsFromElement(event, $(imageSelector)[0])

      // new coords based on scaling
      const x = parseInt((coords.posX * image.naturalWidth) / image.width, 10)
      const y = parseInt((coords.posY * image.naturalHeight) / image.height, 10)

      // console.log(`========== [${coords.posX}, ${coords.posY}] ===========`)
      // console.log(imageData)
      //
      // console.log(`Translated x   : (${coords.posX} * ${image.naturalWidth}) / ${image.width} = ${x}`)
      // console.log(`Translated y   : (${coords.posY} * ${image.naturalHeight}) / ${image.height} = ${y}`)
      //
      // console.log(`Full size image: ${[image.naturalWidth, image.naturalHeight]}`)
      // console.log(`Resized image  : ${[image.width, image.height]}`)

      // console.log(`[${coords.posX}, ${coords.posY}] for
      // [${image.width},${image.height}] to [${x}, ${y}] for:
      // [${image.naturalWidth},${image.naturalHeight}] Diff: [${xOffset}, ${yOffset}]`)

      return this.getPixelColor(x, y, imageData)
    }
    console.warn(`No element found with the given selector: ${imageSelector}`)
    return null
  }

  static getMouseCoordsFromElement(event, element) {
    const posX = event.offsetX ? (event.offsetX) : event.pageX - element.offsetLeft;
    const posY = event.offsetY ? (event.offsetY) : event.pageY - element.offsetTop;
    return { posX, posY }
  }

  /**
   * Return pixel color hex value for
   * the given coordinates
   * @param x
   * @param y
   * @param image
   * @returns {*}
   */
  static getPixelColor(x, y, image) {
    /**
     * This is the transformation from the flatten array
     * to actual pixel position.
     *
     * image.data:
     * [ r00, g00, b00, a00, r01, g01, b01, a01, r02, g02, b02, a02, ... ]
     *
     *  rXY = red value [0, 255] for X, Y pixel
     *  gXY = green value [0, 255] for X, Y pixel
     *  bXY = red value [0, 255] for X, Y pixel
     *  aXY = alpha value [0, 255] for X, Y pixel
     *
     *  E.g. If image is 10px wide and you want the index for 0, 2
     *
     *  ( y * 10 ) to find row
     *  + x to add the column
     *  * 4 to skip rgba values
     *
     *  ( ( 2 * 10 ) + 0 ) * 4 = 80
     *
     *  The rgba sequence starts at image.data[80] and
     *
     *  red is image.data[80]
     *  green is image.data[81]
     *  blue is image.data[82]
     *  alpha is image.data[83]
     *
     * @type {number}
     */
    const pos = ((y * image.width) + x) * 4
    // console.log(`((y[${y}] * ${image.width}) + x[${x}]) * 4 =
    // ${[image.data[pos], image.data[pos + 1], image.data[pos + 2], image.data[pos + 3]]}`)
    /**
     * Shift
     * @type {number}
     */
    const color = (image.data[pos] << 24)
    | (image.data[pos + 1] << 16)
    | (image.data[pos + 2] << 8)
    | (image.data[pos + 3])
    const r = (color >> 24) & 0xFF
    const g = (color >> 16) & 0xFF
    const b = (color >> 8) & 0xFF
    const a = (color >> 0) & 0xFF
    return this.rgbToHex(r, g, b)
  }

  static rgbToHex(r, g, b) {
    const hexstring = ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
    return `#${hexstring}`
  }
}

export default Color
