import Tone from 'tone'

class Player {
    constructor (instrument) {
        this.loaded = false
        this.instrument = instrument
        // this.player = new Tone.MultiPlayer("https://gweb-musiclab-site.appspot.com/static/sound/" + instrument, "C3", "Gb6", 3)
        this.player = new Tone.Players("https://gweb-musiclab-site.appspot.com/static/sound/" + instrument, "C3", "Gb6", 3)
    }

    load (calllback) {
        this.player.load()
        this.player.onload = function(){
            if (callback){
                callback()
            }
        }
    }

    play (note, duration, time) {
        if(this.player.loaded){
            this.player.triggerAttackRelease(note, duration, time)
        }
    }

    isLoaded () {
        return this.player.loaded
    }

}

export default Player