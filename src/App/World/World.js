import App from '../App.js'

export default class World {
    constructor() {
        this.app = new App()
        this.resources = this.app.resources
        this.stateMachine = this.app.stateMachine
    }

    update() {
    }

    resize() {
    }
}