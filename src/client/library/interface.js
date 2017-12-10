import Tone from 'tone'
import Part from './models/music/Part'
import CoreParts from './models/data/CoreParts'

class Interface {
  constructor() {
    this.app = $('.app')
    this.controls = $('#controls')
    this.noOfSpacers = 0

    window.addEventListener('drawNextChord', event => this._drawNextChord(event).bind(this))

    // Adds seperator everytime Tone.Transport loops
    Tone.Transport.scheduleRepeat((time) => {
      this.addLoopEventSpacer()
    }, '1m')
  }

  addEvent(name, time) {
    const event = this._generateEventElement(name, time)
    this.app.find('#events').append(event)
  }

  _generateEventElement(name, time) {
    return $(`<div class="event" data-time="${parseFloat(time).toFixed(3)}">
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

  _drawNextChord(event) {

  }

  /**
     * Adds a seperator to Events container
     * Skips the first itteration and appends the
     * separator before the last event shown
     */
  addLoopEventSpacer() {
    if (this.noOfSpacers === 0) {
      this.noOfSpacers++
    } else {
      const spacer = $('<div class="spacer"></div>')
      const events = this.app.find('#events .event')

      const currentEvent = events[events.length - 1]
      spacer.insertBefore(currentEvent)
    }
  }

  /**
     * Clears all event from Events container
     */
  clearEvents() {
    this.noOfSpacers = 0
    this.app.find('#events').html('')
  }

  setControls(partInstance) {
    // Toggle play pause
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

    // Go to previous track
    this.controls.find('.previousTrack').click((event) => {
      const previousPart = new Part(CoreParts[0].partData, CoreParts[0].partName)
      previousPart.start()
        .then(() => {
          partInstance.enable(false)
          partInstance.dispose()
          partInstance = previousPart
        })
    })

    // Go to next track
    this.controls.find('.nextTrack').click((event) => {
      const nextPart = new Part(CoreParts[1].partData, CoreParts[1].partName)
      nextPart.start()
        .then(() => {
          partInstance.enable(false)
          partInstance = nextPart
        })
    })

    // Set part to next chord
    this.controls.find('.nextChord').click((event) => {
      partInstance.setChord('major', 'D#')
    })

    // Set part to previous chord
    this.controls.find('.prevChord').click((event) => {
      partInstance.setChord('minor', 'F#')
    })
  }

  printArrayHeader() {
    console.log('-----------------------------------------------------------------------')
    console.log('   Note   |   Duration   |          Time          |       interval     ')
    console.log('-----------------------------------------------------------------------')
  }

  logSpacerColored() {
    console.log('%c==========%c---------%c==============', 'color: #FC3A51', 'color: #F5B349', 'color: #FC3A51')
  }
}

export default new Interface()
