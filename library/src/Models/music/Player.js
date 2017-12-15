import Fileplayer from './Fileplayer'

class Player {
  constructor(instrument) {
    this.loaded = false
    this.instrument = instrument
    this.player = new Fileplayer(`${window.location.href}assets/${this.instrument}`, 'C3', 'Gb6', 3)
  }

  load() {
    return this.player.load()
  }

  play(note, duration, time) {
    if (this.player.loaded) {
      this.player.triggerAttackRelease(note, duration, time)
    }
  }

  isLoaded() {
    return this.player.loaded
  }

  dispose() {
    this.player.dispose()
  }
}

export default Player
