import EventEmitter from "../Utils/EventEmitter"
import States from "./States.js"
import State from "./State.js"

export default class StateMachine extends EventEmitter {
    constructor() {
        super()

        this.states = {
            load: new State(States.load),
            ready: new State(States.ready),
            city: new State(States.city),
            studio: new State(States.studio),
            weights: new State(States.weights)
        }

        this.initialState = this.states.load
        this.currentState = this.initialState
    }

    switchState(newState) {
        if (this.states[newState] === this.currentState) return

        this.currentState.triggerOff()
        this.trigger('transition', [this.currentState.name, newState])
        this.currentState = this.states[newState]
        this.currentState.triggerOn()
    }
}