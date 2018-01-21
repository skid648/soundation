// try {
//   const Greetings = new SpeechSynthesisUtterance('Welcome to soundation. A library to hear what you cannot see.')
//   window.speechSynthesis.speak(Greetings)
// } catch (e) {
//   console.warn(`Trying to synthesize speech: ${e}`)
// }
/**
 * Function helpers
 */

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
      // When mouse hover image
      $('#bpm img').mousemove((event) => {
        // get color value from image and coordinates
        const color = harp.colors.get(event, '#bpm img', bpmImage.imageData)
        // resume the harp
        harp.resume()
        // change the tempo based on the color
        harp.bpm({ color })
      })

      // When mouse leaves the image stop the sound
      $('#bpm img').mouseout(() => harp.pause())

      // clicking on image
      $('#bpm img').click((event) => {
        // grab color from pixel
        const color = harp.colors.get(event, '#bpm img', bpmImage.imageData)
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
      // When mouse hover image
      $('#tracks img').mousemove((event) => {
        const color = harp.colors.get(event, '#tracks img', trackImage.imageData)
        // resume the harp and change the track being played based on the color
        harp.resume()
        harp.track({ color })
      })

      // When mouse leaves the image stop the sound
      $('#tracks img').mouseout(() => {
        harp.pause()
      })

      // clicking on image
      $('#tracks img').click((event) => {
        const color = harp.colors.get(event, '#tracks img', trackImage.imageData)
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
      // When mouse hover image
      $('#key img').mousemove((event) => {
        const color = harp.colors.get(event, '#key img', keyImage.imageData)
        // resume the harp and change the key of the sound based on the color
        harp.resume()
        harp.key({ color })
        lastColor = color
      })

      // When mouse leaves the image stop the sound
      $('#key img').mouseout(() => {
        harp.pause()
        harp.strum({
          color: lastColor,
          delay: 200,
        })
      })

      // clicking on image
      $('#key img').click((event) => {
        // grab color from pixel
        const color = harp.colors.get(event, '#key img', keyImage.imageData)

        // Shout the color when the users clicks
        harp.shoutColor(color)
      })
    })
})

