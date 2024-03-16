import EventEmitter from "../Utils/EventEmitter"

export default class State extends EventEmitter {
    name: string

    constructor(name: string) {
        super()
        this.name = name
    }

    triggerOff(): void {
        this.trigger('off')
    }

    triggerOn(): void {
        this.trigger('on')
    }
}
