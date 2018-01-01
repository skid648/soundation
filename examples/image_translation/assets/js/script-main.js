// try {
//   const Greetings = new SpeechSynthesisUtterance('Welcome to soundation. A library to hear what you cannot see.')
//   window.speechSynthesis.speak(Greetings)
// } catch (e) {
//   console.warn(`Trying to synthesize speech: ${e}`)
// }

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
      ({ width, height, image } = {
        width: bpmImage.width,
        height: bpmImage.height,
        image: bpmImage.imageData,
      })

      // hovering image
      $('#bpm img').mousemove((event) => {
        const coords = getMouseCoordsFromElement(event, $('#bpm img')[0])
        const color = getPixelColor(coords.posX, coords.posY)
        $('section#bpm').css('background', `rgba(${color.r},${color.g},${color.b},${color.a})`)
      })

      // clicking on image
      $('#bpm img').click((event) => {
        const coords = getMouseCoordsFromElement(event, $('#bpm img')[0])
        const color = getPixelColor(coords.posX, coords.posY)
        console.log(color)
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
      ({ width, height, image } = {
        width: bpmImage.width,
        height: bpmImage.height,
        image: bpmImage.imageData,
      })
      $('#tracks img').onmousemove = (e) => {

      }
      $('#tracks img').onclick = (e) => {

      }
    })
})

/**
 * KEY TEST
 */

const keyImageSrc = $('#key img').attr('src')
const keyImage = new MarvinImage()
keyImage.load(keyImageSrc, () => {
  const harp = new Soundation(`http://${window.location.host}/assets/harp`)
  harp.imageClassifier({}, 10)
  harp.load()
    .then(() => {
      ({ width, height, image } = {
        width: bpmImage.width,
        height: bpmImage.height,
        image: bpmImage.imageData,
      })
      $('#key img').onmousemove = (e) => {

      }
      $('#key img').onclick = (e) => {

      }
    })
})

/**
 * Function helpers
 */

function rgbToHex(r, g, b) {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
}

function getPixelPositionRaw(x, y) {
  return ((y * image.width) + x) * 4
}

function getPixelColor(x, y) {
  const pos = getPixelPositionRaw(x, y)
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

  return { posX, posY }
}

