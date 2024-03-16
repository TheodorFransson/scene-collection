import * as THREE from 'three'

import World from '../../World/World'
import StudioEnvironment from './StudioEnvironment'
import Renderer from '../../Renderer'
import StudioCamera from './StudioCamera'

export default class StudioWorld extends World {
    constructor() {
        super()

        this.scene = new THREE.Scene()
        const camera = new StudioCamera(this.scene)
        this.renderer.setRenderScene(this.scene, camera)

        this.stateMachine.on('transition', (previousState: string, currentState: string) => {
            if (currentState === 'ready') {
                this.environment = new StudioEnvironment(this.scene, camera)
                this.renderer.setClearColor(this.environment.backgroundColor)
            }
        })
    }

    update(): void {
        if (this.environment) this.environment.update()
    }

    resize(): void {
        if (this.environment) this.environment.resize()
    }
}