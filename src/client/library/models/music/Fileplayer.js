import Tone from 'tone'
import Promise from 'bluebird'
import Log from "../../../library/Helpers/Logging"

class Fileplayer {
    /** Constructor */

    constructor (folder, lowestNote, highestNote, steps) {
        /**
         * The multibuffer player
         * @type {Tone.MultiPlayer}
         * @private
         */
        this._multiPlayer = new Tone.Players().toMaster()

        /**
         * the instrument folder
         * @type {String}
         * @private
         */
        this._instrumentFolder = folder

        /**
         * The lowest note playable
         * @type {String}
         * @private
         */
        this._lowestNote = lowestNote

        /**
         * The highest note playable
         * @type {String}
         * @private
         */
        this._highestNote = highestNote

        /**
         * The number of chromaitc steps (up and down) which the sample
         * will be repitched
         * @type {Number}
         * @private
         */
        this._stepSize = steps || 4

        /**
         * The number of buffers currently
         * loading.
         * @type {Number}
         * @private
         */
        this._loadCount = 0

        /**
         * The sample lookup. Each note mapes to a buffer and a playbackRate
         * @type {Object}
         * @private
         */
        this._notes = {}

        /**
         * All the buffers
         * @type {Object}
         * @private
         */
        this._buffers = {}

        /**
         * The time it takes for the note to release
         * @type {Number}
         * @private
         */
        this._releaseTime = 0.5

        this._allNotes = this._getNotes(this._lowestNote, this._highestNote)

        this._end = Math.max(this._stepSize * 2 + 1, this._allNotes.length)

        /**
         * if all the samples are loaded
         * @type {Boolean}
         */
        this.loaded = false
    }

    /** PUBLIC METHODS */

    /**
     * After initializing the player load() should be called
     * All buffers are loaded and a player is generated for every
     * re-pitched note
     * returns Promise([thenable])
     */
    load () {
        let promiseArray = []
        let bufferPitch = {}

        for(let i = 0; i < this._allNotes.length; i+=this._stepSize * 2 + 1) {

            bufferPitch = this._allNotes[i + this._stepSize]
            let end = Math.max(this._stepSize * 2 + 1, this._allNotes.length)

            if (!_.isNil(bufferPitch)) {
                promiseArray.push(this._createBufferPromise(bufferPitch, i, end, this._allNotes))
            }
        }

        return Promise.all(promiseArray)
        .then(res => {
            this.loaded = true
            // Log.SpaceTitleAndLog('All buffers loaded', this._buffers)
            // Log.SpaceTitleAndLog('Players', this._multiPlayer)
        })
    }

    triggerAttackRelease (note, duration, startTime) {
        let description = this._notes[note]

        // Log.SpaceTitleAndLog(`Trying to get player from note ${note}`, {})

        let player = this._multiPlayer.get(description.buffer)

        Log.SpaceTitleAndLog(`Got player from note ${note}`, player)

        return player.start(startTime, 0, duration)
        // TODO: check if we should remove duration
        // TODO: note should should the same as arpegios
        // TODO: it appears that the note plays for a shorter time
    }

    triggerRelease (note, time) {
        let description = this._notes[note]
        console.log(`Stop note | given: ${note} calculated: ${description}`)
        this._multiPlayer.stop(description.buffer, time)
    }

    /**
     * Stop all the players with
     */
    releaseAll () {
        this._multiPlayer.stopAll()
    }

    // DESTRUCT

    dispose () {
        this.releaseAll()
        for (var buff in this._buffers){
            this._buffers[buff].dispose()
        }
        this._buffers = null
        this._notes = null
    }

    /** PRIVATE METHODS */

    // CALCULATE NOTES

    /**
     * Generates an array of notes from start
     * to end based on chromatic scale
     * @param start
     * @param end
     * @returns {Array}
     * @private
     */
    _getNotes (start, end) {
        let chromatic = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"]

        let splitRegexp = /(-?\d+)/

        let startOctave = parseInt(start.split(splitRegexp)[1])
        let startNote = start.split(splitRegexp)[0]
        startNote = chromatic.indexOf(startNote)

        let endOctave = parseInt(end.split(splitRegexp)[1])
        let endNote = end.split(splitRegexp)[0]
        endNote = chromatic.indexOf(endNote)

        let currentNote = startNote
        let currentOctave = startOctave

        let retNotes = []

        while(!(currentNote === endNote && currentOctave === endOctave)){
            retNotes.push(chromatic[currentNote] + currentOctave)

            currentNote++

            if (currentNote >= chromatic.length){
                currentNote = 0
                currentOctave++
            }
        }
        // Log.SpaceTitleAndLog(`Given start: ${start}, end: ${end}, returns:`, retNotes)
        return retNotes
    }

    _getNotesRespalling (note) {
        let respelling = {"Db" : "C#", "Eb" : "D#", "Gb" : "F#", "Ab" : "G#", "Bb" : "A#"}

        let splitRegexp = /(-?\d+)/
        let pitch = note.split(splitRegexp)[0]
        let octave = parseInt(note.split(splitRegexp)[1])
        if (respelling.hasOwnProperty(pitch)){
            return respelling[pitch] + octave.toString()
        } else {
            return null
        }
    }

    // BUFFERS

    _createBufferPromise (bufferPitch, i, end, allNotes) {
        return new Promise((resolve, reject) => {
            return new Tone.Buffer(this._instrumentFolder + "/" + bufferPitch + ".mp3", buffer => {
                return resolve(buffer)
            })
        })
        .then(res => {
            this._loadCount-=1
            if (this._loadCount === 0) this.loaded = true

            this._multiPlayer.add(bufferPitch, res)
            this._buffers[bufferPitch] = res

            for (var j = i; j < end; j++){
                var note = allNotes[j]

                this._notes[note] = {
                    "interval" : (j - i - this._stepSize),
                    "buffer" : bufferPitch,
                }

                //and the respelling if it exists
                var respelling = this._getNotesRespalling(note)

                if (respelling){
                    this._notes[respelling] = this._notes[note];
                }
            }

            // Log.SpaceTitleAndLog(`CreatePromiseBuffer(${bufferPitch}, ${i}, ${end}, allNotes)`, res)
            return res
        })
    }

    //

    _intervalToFrequencyRatio (interval) {
        return Math.pow(2,(interval/12))
    }
}

export default Fileplayer