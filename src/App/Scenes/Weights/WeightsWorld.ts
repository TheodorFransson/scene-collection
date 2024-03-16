import * as THREE from 'three'

import World from '../../World/World'
import WeightsEnvironment from './WeightsEnvironment'
import Renderer from '../../Renderer'
import WeightsCamera from './WeightsCamera'

export default class WeightsWorld extends World {
    constructor() {
        super()

        this.scene = new THREE.Scene()
        const camera = new WeightsCamera(this.scene)
        this.renderer.setRenderScene(this.scene, camera)

        this.stateMachine.on('transition', (previousState: string, currentState: string) => {
            if (currentState === 'ready') {
                this.environment = new WeightsEnvironment(this.scene, camera)
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