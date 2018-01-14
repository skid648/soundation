// try {
//   const Greetings = new SpeechSynthesisUtterance('Welcome to soundation. A library to hear what you cannot see.')
//   window.speechSynthesis.speak(Greetings)
// } catch (e) {
//   console.warn(`Trying to synthesize speech: ${e}`)
// }
/**
 * Function helpers
 */

function rgbToHex(r, g, b) {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
}

function getPixelPositionRaw(x, y, image) {
  return ((y * image.width) + x) * 4
}

function getPixelColor(x, y, image) {
  const pos = getPixelPositionRaw(x, y, image)
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

function getMouseCoordsFromElement(event, element) {
  const posX =
    event.offsetX
      ? (event.offsetX)
      : event.pageX - element.offsetLeft;

  const posY =
    event.offsetY
      ? (event.offsetY)
      : event.pageY - element.offsetTop;

  $('.coords').html(`<div>x: ${posX} y: ${posY}</div>`)
  return { posX, posY }
}


/**
 * BPM TEST
 */

const bpmImageSrc = $('#bpm img').attr('src')
const bpmImage = new MarvinImage()

bpmImage.load(bpmImageSrc, () => {
  const harp = new Soundation(`http://${window.location.host}/assets/harp`)
  harp.imageClassifier({}, 10)
  harp.load()
    .then(() => {
      const image = bpmImage.imageData

      // When mouse hover image
      $('#bpm img').mousemove((event) => {
        // get color from pixel
        const coords = getMouseCoordsFromElement(event, $('#bpm img')[0])
        const color = getPixelColor(coords.posX, coords.posY, image)

        // resume the harp and change the tempo based on the color
        harp.resume()
        harp.bpm({ color: rgbToHex(color.r, color.g, color.b) })
      })

      // When mouse leaves the image stop the sound
      $('#bpm img').mouseout(() => {
        harp.pause()
      })

      // clicking on image
      $('#bpm img').click((event) => {
        // grab color from pixel
        const coords = getMouseCoordsFromElement(event, $('#bpm img')[0])
        const color = getPixelColor(coords.posX, coords.posY, image)

        // Shout the color when the users clicks
        harp.shoutColor(color)
      })
    })
})

/**
 * TRACK TEST
 */

const trackImageSrc = $('#tracks img').attr('src')
const trackImage = new MarvinImage()

trackImage.load(trackImageSrc, () => {
  const harp = new Soundation(`http://${window.location.host}/assets/harp`)
  harp.imageClassifier({}, 10)
  harp.load()
    .then(() => {
      const image = trackImage.imageData

      // When mouse hover image
      $('#tracks img').mousemove((event) => {
        // get color from pixel
        const coords = getMouseCoordsFromElement(event, $('#tracks img')[0])
        const color = getPixelColor(coords.posX, coords.posY, image)

        // resume the harp and change the track being played based on the color
        harp.resume()
        harp.track({ color: rgbToHex(color.r, color.g, color.b) })
      })

      // When mouse leaves the image stop the sound
      $('#tracks img').mouseout(() => {
        harp.pause()
      })

      // clicking on image
      $('#tracks img').click((event) => {
        // grab color from pixel
        const coords = getMouseCoordsFromElement(event, $('#tracks img')[0])
        const color = getPixelColor(coords.posX, coords.posY, image)

        // Shout the color when the users clicks
        harp.shoutColor(color)
      })
    })
})

/**
 * KEY TEST
 */

const keyImageSrc = $('#key img').attr('src')
const keyImage = new MarvinImage()
keyImage.load(keyImageSrc, () => {
  let lastColor = {}
  const harp = new Soundation(`http://${window.location.host}/assets/harp`)
  harp.imageClassifier({}, 10)
  harp.load()
    .then(() => {
      const image = keyImage.imageData

      // When mouse hover image
      $('#key img').mousemove((event) => {
        // get color from pixel
        const coords = getMouseCoordsFromElement(event, $('#key img')[0])
        const color = getPixelColor(coords.posX, coords.posY, image)

        // resume the harp and change the key of the sound based on the color
        harp.resume()
        harp.key({ color: rgbToHex(color.r, color.g, color.b) })
        lastColor = color
      })

      // When mouse leaves the image stop the sound
      $('#key img').mouseout(() => {
        harp.pause()
        harp.strum({
          color: rgbToHex(lastColor.r, lastColor.g, lastColor.b),
          delay: 200,
        })
      })

      // clicking on image
      $('#key img').click((event) => {
        // grab color from pixel
        const coords = getMouseCoordsFromElement(event, $('#key img')[0])
        const color = getPixelColor(coords.posX, coords.posY, image)

        // Shout the color when the users clicks
        harp.shoutColor(color)
      })
    })
})

