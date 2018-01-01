let width = {}
let height = {}
const data = {}
let image = {}

const harp = new Soundation(`http://${window.location.host}/assets/harp`)

function rgbToHex(r, g, b) {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
}

function getPixelPositionRaw(x, y) {
  return ((y * image.width) + x) * 4
}

function getPixelColor(x, y, image) {
  const pos = getPixelPositionRaw(x, y, image.width)
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

function mouseover(event) {
  let color = {}
  const posX =
    event.offsetX
      ? (event.offsetX)
      : event.pageX - document.getElementById('image').offsetLeft;

  const posY =
    event.offsetY
      ? (event.offsetY)
      : event.pageY - document.getElementById('image').offsetTop;

  if ((posX > 0 && posX <= width) && (posY > 0 && posY <= height)) {
    harp.resume()
    color = getPixelColor(posX, posY)
    document.getElementById('coords').innerHTML = `${posX} : ${posY}`
    document.getElementById('color').innerHTML = `${color.r}, ${color.g}, ${color.b}`
    document.body.style.background = `rgba(${color.r},${color.g},${color.b},${color.a})`
    harp.key({
      key: 'd',
      color: rgbToHex(color.r, color.g, color.b),
    })
  } else {
    harp.pause()
    document.getElementById('coords').innerHTML = '0 : 0'
  }
}

function clickIt(event) {
  let color = {}
  const posX =
    event.offsetX
      ? (event.offsetX)
      : event.pageX - document.getElementById('image').offsetLeft;

  const posY =
    event.offsetY
      ? (event.offsetY)
      : event.pageY - document.getElementById('image').offsetTop;

  if ((posX > 0 && posX <= width) && (posY > 0 && posY <= height)) {
    color = getPixelColor(posX, posY)
    console.log(color)
    harp.shoutColor(color)
  }
}

function hookImage() {
  imageExample1 = new MarvinImage()
  imageExample1.load('assets/img/darth-vader.jpg', () => {
    harp.imageClassifier({}, 10)
    harp.load()
      .then(() => {
        ({ width, height } = { width: imageExample1.width, height: imageExample1.height })
        image = imageExample1.imageData
        document.onmousemove = mouseover
        document.getElementById('image').onclick = clickIt
        // console.log(image.data[1491044])
        console.log(image.data.length > 1491044)
      })
  })
}

hookImage()
