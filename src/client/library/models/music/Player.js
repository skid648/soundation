import Tone from 'tone'
import Fileplayer from './Fileplayer'

class Player {
    constructor (instrument) {
        this.loaded = false
        this.instrument = instrument
        this.player = new Fileplayer("https://gweb-musiclab-site.appspot.com/static/sound/" + this.instrument, "C3", "Gb6", 3)
    }

    load () {
        return this.player.load()
    }

    play (note, duration, time) {
        if(this.player.loaded){
            console.log(`${note} ${duration} ${time}`)
            this.player.triggerAttackRelease(note, duration, time)
        }
    }

    isLoaded () {
        return this.player.loaded
    }

}

export default Player