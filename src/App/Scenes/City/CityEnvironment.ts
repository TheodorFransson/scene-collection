import * as THREE from 'three'
import { GUI } from 'dat.gui'

import Camera from '../../Camera/Camera'
import Environment from '../../World/Environment'

export default class CityEnvironment extends Environment {
    constructor(scene: THREE.Scene, camera: Camera, gui: GUI) {
        super(scene, camera, gui)

        this.backgroundColor =  '#0a0a0a'

        this.createScene()
    }

    createScene(): void {

    }
}
