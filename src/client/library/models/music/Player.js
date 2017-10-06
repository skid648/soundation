import Tone from 'tone'
import Fileplayer from '../Fileplayer'
// TODO: finish up fileplayer class

class Player {
    constructor (instrument) {
        this.loaded = false
        this.instrument = instrument
        // this.player = new Tone.MultiPlayer("https://gweb-musiclab-site.appspot.com/static/sound/" + instrument, "C3", "Gb6", 3)
        this.soundSamples = {
            Bb3: `../../../assets/${instrument}/Bb3.mp3`,
            C3: `../../../assets/${instrument}/C3.mp3`,
            C5: `../../../assets/${instrument}/C5.mp3`,
            D6: `../../../assets/${instrument}/D6.mp3`,
            Eb3: `../../../assets/${instrument}/Eb3.mp3`,
            F4: `../../../assets/${instrument}/F4.mp3`,
            G5: `../../../assets/${instrument}/G5.mp3`,
            Gb6: `../../../assets/${instrument}/Gb6.mp3`
        }
    }

    load () {
        // Promisify loading of samples
        return new Promise((resolve, reject) => {
            // TODO: Have to change this to new fileplayer which generates every note
            // this.player must be type fileplayer
            this.player = new Tone.Players(this.soundSamples, () => {
                this.loaded = true
                return resolve()
            }).toMaster()
        })
    }

    play (note, duration, time) {
        if(this.player.loaded){
            let sample = this.player.get(note)
            sample.start(time, null, duration)
        }
    }

    isLoaded () {
        return this.player.loaded
    }

}

export default Player