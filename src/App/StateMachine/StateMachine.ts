import EventEmitter from "../Utils/EventEmitter"
import State from "./State"

interface States {
    [key: string]: State
}

export default class StateMachine extends EventEmitter {
    private states: States = {}
    private initialState: State | null = null
    private currentState: State | null = null

    addState(name: string): void {
        const newState = new State(name)
        this.states[name] = newState

        if (!this.initialState) {
            this.initialState = newState
            this.currentState = newState
        }
    }

    switchState(newStateName: string): void {
        const newState = this.states[newStateName]
        if (!newState || newState === this.currentState) return

        this.currentState?.triggerOff()
        this.trigger('transition', [this.currentState?.name, newStateName])
        this.currentState = newState
        this.currentState.triggerOn()
    }

    initialize(states: string[]): void {
        states.forEach(stateName => this.addState(stateName))
        
        if (this.initialState) {
            this.currentState = this.initialState
            this.currentState.triggerOn()
        }
    }
}
