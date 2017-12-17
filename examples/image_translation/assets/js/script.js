let width = 0
let height = 0
const data = {}
let image = {}
const harp = new Soundation(`http://${window.location.host}/assets/harp`)

function getPixelPositionRaw(x, y) {
  return (y * (image.width + x) * 4)
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
  console.log(`${[pos]}, ${[pos + 1]}, ${[pos + 2]}, ${[pos + 3]}`)
  console.log(`${r}, ${g}, ${b}, ${a}`)
  console.log(`======================`)
  return { r, g, b, a }
}

function pointIt(event) {
  // https://github.com/tsuyoshiwada/color-classifier
  // TODO: use this
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
    document.getElementById('coords').innerHTML = `${posX} : ${posY}`
    const color = getPixelColor(posX, posY)
    document.getElementById('color').innerHTML = `${color.r}, ${color.g}, ${color.b}`
    document.body.style.background = `rgba(${color.r},${color.g},${color.b},${color.a})`
  } else {
    harp.pause()
    document.getElementById('coords').innerHTML = '0 : 0'
  }
}

function clickIt() {
  console.log('Clicked')
  harp.strum('major', 'C#')
}

function hookImage() {
  imageExample1 = new MarvinImage()
  imageExample1.load('assets/img/darth-vader.jpg', () => {
    harp.load()
      .then(() => {
        width = imageExample1.width
        height = imageExample1.height
        console.log(imageExample1)
        image = imageExample1.imageData
        document.onmousemove = pointIt
        document.getElementById('image').onclick = clickIt
      })
  })
}

hookImage()
