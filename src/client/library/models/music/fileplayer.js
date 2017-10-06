class Fileplayer {
    constructor (folder, lowestNote, highestNote, steps) {
        /**
         * The multibuffer player
         * @type {Tone.MultiPlayer}
         * @private
         */
        this._multiPlayer = new MultiPlayer().toMaster();

        /**
         * the instrument folder
         * @type {String}
         * @private
         */
        this._instrumentFolder = folder;

        /**
         * The lowest note playable
         * @type {String}
         * @private
         */
        this._lowestNote = lowestNote;

        /**
         * The highest note playable
         * @type {String}
         * @private
         */
        this._highestNote = highestNote;

        /**
         * The number of chromaitc steps (up and down) which the sample
         * will be repitched
         * @type {Number}
         * @private
         */
        this._stepSize = steps || 4;

        /**
         * The number of buffers currently
         * loading.
         * @type {Number}
         * @private
         */
        this._loadCount = 0;

        /**
         * The sample lookup. Each note mapes to a buffer and a playbackRate
         * @type {Object}
         * @private
         */
        this._notes = {};

        /**
         * All the buffers
         * @type {Object}
         * @private
         */
        this._buffers = {};

        /**
         * The time it takes for the note to release
         * @type {Number}
         * @private
         */
        this._releaseTime = 0.5;

        /**
         * if all the samples are loaded
         * @type {Boolean}
         */
        this.loaded = false;

        //callback when loaded
        this.onload = function(){};
    }
}

export default Fileplayer