import * as THREE from 'three'

import App from '../App.js'
import Renderer from '../Renderer.js'
import Resources from '../Utils/Resources.js'
import StateMachine from '../StateMachine/StateMachine.js'
import Environment from './Environment.js'

export default class World {
    scene: THREE.Scene
    renderer: Renderer
    resources: Resources
    stateMachine: StateMachine
    environment: Environment

    constructor() {
        const app = App.getInstance()
        this.resources = app.resources
        this.stateMachine = app.stateMachine
    }

    update(): void {
    }

    resize(): void {
    }
}