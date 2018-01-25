class Color {
  static get(event, imageSelector, imageData) {
    const image = $(imageSelector)[0]

    // console.log(`Image height: ${image.height}, image width: ${image.width}`)
    // console.log(`Image natural height: ${image.naturalHeight},
    // image natural width: ${image.naturalWidth}`)
    // const yOffset = image.naturalHeight - image.height
    // const xOffset = image.naturalWidth - image.width
    // console.log(`Height offset: ${yOffset}, Width offset: ${xOffset}`)
    // TODO: fixing mapping image if resized

    let color = {}
    if ($(imageSelector)[0] != null) {
      const coords = this.getMouseCoordsFromElement(event, $(imageSelector))
      color = this.getPixelColor(coords.posX, coords.posY, imageData)
    } else {
      color = null
      console.warn(`No element found with the given selector: ${imageSelector}`)
    }
    return this.rgbToHex(color.r, color.g, color.b)
  }

  static getMouseCoordsFromElement(event, element, yOffset = 0, xOffset = 0) {
    const posX =
      event.offsetX
        ? (event.offsetX)
        : event.pageX - element.offsetLeft;

    const posY =
      event.offsetY
        ? (event.offsetY)
        : event.pageY - element.offsetTop;
    return { posX: posX - xOffset, posY: posY - yOffset }
  }

  static getPixelPositionRaw(x, y, image) {
    return ((y * image.width) + x) * 4
  }

  static getPixelColor(x, y, image) {
    const pos = this.getPixelPositionRaw(x, y, image)
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
    return {
      r, g, b, a,
    }
  }

  static rgbToHex(r, g, b) {
    const hexstring = ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
    return `#${hexstring}`
  }
}

export default Color
