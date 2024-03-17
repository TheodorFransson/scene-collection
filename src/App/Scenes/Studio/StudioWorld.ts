import * as THREE from 'three'

import World from '../../World/World'
import StudioEnvironment from './StudioEnvironment'
import Renderer from '../../Renderer'
import StudioCamera from './StudioCamera'

export default class StudioWorld extends World {
    constructor() {
        const scene = new THREE.Scene()
        super(scene, 'studio')

        super.listenToTransition(StudioEnvironment, StudioCamera)
    }
}