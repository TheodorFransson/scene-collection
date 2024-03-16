import * as THREE from 'three'

import World from '../../World/World.js'
import StudioEnvironment from './StudioEnvironment.js'
import Renderer from '../../Renderer.js'
import StudioCamera from './StudioCamera.js'

export default class StudioWorld extends World {
    constructor() {
        super()

        this.scene = new THREE.Scene()
        const camera = new StudioCamera(this.scene)
        this.renderer = new Renderer(this.scene, camera)

        this.resources.startLoading()

        this.stateMachine.on('transition', (previousState: string, currentState: string) => {
            if (currentState === 'ready') {
                this.environment = new StudioEnvironment(this.scene, camera)
            }
        })
    }

    update(): void {
        if (this.environment) this.environment.update()
        this.renderer.update()
    }

    resize(): void {
        if (this.environment) this.environment.resize()
        this.renderer.resize()
    }
}