import * as THREE from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Camera from '../../Camera/Camera'
import { GUI } from 'dat.gui'

export default class CityCamera extends Camera {
    settingsFolder: GUI

    constructor(scene: THREE.Scene, parentFolder: GUI) {
        super(scene)

        this.settingsFolder = parentFolder.addFolder('camera')

        super.init()
    }

    setControls(): void {
        this.orbitControls = new OrbitControls(this.instance, this.canvas)
        this.orbitControls.target.set(0, 1, 0)

        this.initialControlSettings = {
            enableDamping: true,
            enablePan: true,
            enableRotate: true,
            enableZoom: true,
        }
    }
}