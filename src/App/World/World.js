import App from '../App.js'
import Environment from './Environment.js'
import LoadingEnvironment from './LoadingEnvironment.js'

export default class World {
    constructor() {
        this.app = new App()
        this.scene = this.app.scene
        this.resources = this.app.resources
        this.stateMachine = this.app.stateMachine

        this.loadingEnvironment = new LoadingEnvironment()

        // Wait for resources
        this.stateMachine.states.ready.on('on', () => {
            // Setup
            this.environment = new Environment()
        })
    }

    update() {
    }
}