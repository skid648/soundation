import Soundation from './library/Soundation'

const s = new Soundation()
s.load()
  .then(() => {
    setTimeout(() => { s.next('track') }, 4600)
    setTimeout(() => { s.next('key') }, 10000)
    setTimeout(() => { s.next('bpm') }, 12000)
    setTimeout(() => { s.pause() }, 16000)
    setTimeout(() => { s.next('Key') }, 16500)
    setTimeout(() => { s.next('track') }, 16600)
    setTimeout(() => { s.resume() }, 17000)
    setTimeout(() => { s.pause() }, 25000)
  })
