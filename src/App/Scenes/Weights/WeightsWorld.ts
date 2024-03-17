import * as THREE from 'three'

import World from '../../World/World'
import WeightsEnvironment from './WeightsEnvironment'
import Renderer from '../../Renderer'
import WeightsCamera from './WeightsCamera'

export default class WeightsWorld extends World {
    constructor() {
        const scene = new THREE.Scene()
        super(scene, 'weights')

        super.listenToTransition(WeightsEnvironment, WeightsCamera)
    }
}