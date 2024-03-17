import * as THREE from 'three'

import World from '../../World/World'
import CityEnvironment from './CityEnvironment'
import CityCamera from './CityCamera'

export default class CityoWorld extends World {
    constructor() {
        super(new THREE.Scene(), 'city')

        super.listenToTransition(CityEnvironment, CityCamera)
    }
}