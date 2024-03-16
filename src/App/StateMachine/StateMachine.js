import EventEmitter from "../Utils/EventEmitter"
import States from "./States.js"
import State from "./State.js"

export default class StateMachine extends EventEmitter {
    constructor() {
        super()

        this.states = {
            load: new State(States.load),
            ready: new State(States.ready),
            view: new State(States.view)
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