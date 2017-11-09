class Interface {
    constructor() {
        this.app = $('.app')

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
}

export default new Interface()