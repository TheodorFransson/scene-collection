import * as THREE from 'three'

import World from '../../World/World.js'
import LoadingEnvironment from '../../World/LoadingEnvironment.js'
import StudioEnvironment from './StudioEnvironment.js'
import StudioCamera from './StudioCamera.js'
import Renderer from '../../Renderer.js'

export default class StudioWorld extends World {
    constructor() {
        super()

        this.scene = new THREE.Scene()
        this.camera = new StudioCamera(this.scene)
        this.renderer = new Renderer(this.scene, this.camera)

        this.loadingEnvironment = new LoadingEnvironment()

        // Wait for resources
        this.stateMachine.states.ready.on('on', () => {
            // Setup
            this.environment = new StudioEnvironment(this.scene, this.camera)
        })
    }

    update() {
        this.camera.update()
        this.renderer.update()
    }

    resize() {
        this.camera.resize()
        this.renderer.resize()
    }
}