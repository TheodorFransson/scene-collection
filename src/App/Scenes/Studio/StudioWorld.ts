import * as THREE from 'three'

import World from '../../World/World'
import StudioEnvironment from './StudioEnvironment'
import StudioCamera from './StudioCamera'

export default class StudioWorld extends World {
    constructor() {
        super(new THREE.Scene(), 'studio')

        super.listenToTransition(StudioEnvironment, StudioCamera)
    }
}