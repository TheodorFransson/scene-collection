import * as THREE from 'three'

import World from "../../World/World"
import LoadEnvironment from './LoadEnvironment'
import LoadCamera from './LoadCamera'

export default class LoadWorld extends World {
    constructor() {
        super(new THREE.Scene(), 'load')

        super.listenToTransition(LoadEnvironment, LoadCamera)
    }

    onTransitionFrom(environment: LoadEnvironment): void {
        environment.removeOverlay()
    }
}