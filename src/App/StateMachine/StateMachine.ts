import EventEmitter from "../Utils/EventEmitter"
import State from "./State"

interface States {
    [key: string]: State
}

export default class StateMachine extends EventEmitter {
    private states: States = {}
    private currentState: State | null = null

    addState(name: string): State {
        const newState = new State(name)
        this.states[name] = newState

        return newState
    }

    switchState(newStateName: string): void {
        const newState = this.states[newStateName]
        if (!newState || newState === this.currentState) return

        this.currentState?.triggerOff()
        const oldState = this.currentState
        this.currentState = newState
        this.trigger('transition', [oldState?.name, newStateName])
        this.currentState.triggerOn()
    }

    initialize(states: string[]): void {
        states.forEach(stateName => this.addState(stateName))
    }

    setInitialState(state: string): void {
        this.currentState = this.states[state]
        this.currentState.triggerOn()
    }
}
