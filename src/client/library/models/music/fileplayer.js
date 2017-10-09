class Fileplayer {
    constructor (folder, lowestNote, highestNote, steps) {
        /**
         * The multibuffer player
         * @type {Tone.MultiPlayer}
         * @private
         */
        this._multiPlayer = new MultiPlayer().toMaster()

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

        /**
         * if all the samples are loaded
         * @type {Boolean}
         */
        this.loaded = false

        //callback when loaded
        this.onload = function(){}
    }

    _getNotes (start, end) {
        // get notes function
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

        return retNotes
    }

    _getNotesRespalling (note) {
        let respelling = {"Db" : "C#", "Eb" : "D#", "Gb" : "F#", "Ab" : "G#", "Bb" : "A#"}

        let pitch = note.split(splitRegexp)[0]
        let octave = parseInt(note.split(splitRegexp)[1])
        if (respelling.hasOwnProperty(pitch)){
            return respelling[pitch] + octave.toString()
        } else {
            return null
        }
    }

    load () {
        //get all the samples between lowest and highest notes
        let allNotes = this._getNotes(this._lowestNote, this._highestNote)
        _.forEach(allNotes, (note, i) => {
            let end = Math.max(this._stepSize * 2 * 1, allNotes.length)
            let bufferPitch = allNotes[i + this._stepSize]

            if (!_.isNil(bufferPitch)) {
                this._loadCount += 1
                let buff = new Buffer(this._instrumentFolder + "/" + bufferPitch + ".mp3",)
            }
        })

        //get the samples to load
        for (var i = 0; i < allNotes.length; i+=this._stepSize * 2 + 1){
            var end = Math.max(this._stepSize * 2 + 1, allNotes.length);
            var bufferPitch = allNotes[i + this._stepSize];
            if (typeof bufferPitch !== "undefined"){
                //create the buffer
                this._loadCount+=1;
                var buff = new Buffer(this._instrumentFolder + "/" + bufferPitch + ".mp3", this._loadedBuffer.bind(this));
                // this._buffers[bufferPitch] = buff;
                this._multiPlayer.addBuffer(bufferPitch, buff);
                for (var j = i; j < end; j++){
                    var note = allNotes[j];
                    this._notes[note] = {
                        "interval" : (j - i - this._stepSize),
                        "buffer" : bufferPitch,
                    };
                    //and the respelling if it exists
                    var respelling = Notes.getRespelling(note);
                    if (respelling){
                        this._notes[respelling] = this._notes[note];
                    }
                }
            }
        }
    }
}

export default Fileplayer