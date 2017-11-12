class Interface {
    constructor() {
        this.app = $('.app')
        this.controls = $('#controls')
        window.addEventListener('drawNextChord',event => this._drawNextChord(event).bind(this))
        // append a spacer in the timeline
        Tone.Transport.scheduleRepeat(time => {
            this.addLoopEventSpacer()
        }, "1m")

    }

    addEvent (name, time) {
        let event = this._generateEventElement(name, time)
        this.app.find('#events').append(event)
    }

    _generateEventElement (name, time) {
        return $(`<div class="event">
                    <div class="title">${name}</div>
                    <div class="time">
                    <span class="icon">
                        <i class="fa fa-clock-o" aria-hidden="true"></i>
                    </span>
                    <span class="value">${time}</span>
                    </div>
                </div>
        `)
    }

    _drawNextChord (event) {

    }

    addLoopEventSpacer () {
        let spacer = $(`<div class="spacer"></div>`)
        this.app.find('#events').append(spacer)
    }

    clearEvents () {
        this.app.find('#events').html("")
    }

    setControls () {
        this.controls.find('.fa-play-circle-o').click((event) => {
            if (Tone.Transport.state === 'stopped') {
                Tone.Transport.start()

                $(event.currentTarget)
                .removeClass('fa-play-circle-o')
                .addClass('fa-pause-circle-o')
            } else {
                Tone.Transport.stop()

                $(event.currentTarget)
                .removeClass('fa-pause-circle-o')
                .addClass('fa-play-circle-o')
            }
        })

        this.controls.find('.previousTrack').click((event) => {
            let nextPart = new Part(partNotes[0])
            nextPart.start()
            .then(() => {
                partInstance._enable(false)
                partInstance = nextPart
                partInstance._enable(true)
                nextPart.start()
            })
        })

        this.controls.find('.nextTrack').click((event) => {
            let nextPart = new Part(partNotes[1])
            nextPart.start()
            .then(() => {
                partInstance._enable(false)
                partInstance = nextPart
                partInstance._enable(true)
                partInstance.start()
            })
        })

        this.controls.find('.nextChord').click((event) => {
            partInstance._setChord(generatedNotes.major['D#'])
        })

        this.controls.find('.prevChord').click((event) => {
            partInstance._setChord(generatedNotes.minor['F#'])
        })
    }
}

export default new Interface()