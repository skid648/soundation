import Soundation from './library/Soundation'

const s = new Soundation()
s.load()
  .then(() => {
    s.pause()
    // setInterval(() => { s.next('track') }, 5000)
    // setInterval(() => { s.next('key') }, 5000)
    // setInterval(() => { s.next('bpm') }, 5000)
    // setTimeout(() => { s.pause() }, 10000)
  })
