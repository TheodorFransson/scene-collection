import EventEmitter from "../Utils/EventEmitter"

export default class State extends EventEmitter {
    constructor(_name) {
        super()

        this.name = _name
    }

    triggerOff() {
        this.trigger('off')
    }

    triggerOn() {
        this.trigger('on')
    }
}