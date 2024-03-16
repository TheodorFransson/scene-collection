import * as THREE from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Camera from '../../Camera/Camera'
import { GUI } from 'dat.gui'

export default class StudioCamera extends Camera {
    debugFolder: GUI

    constructor(scene: THREE.Scene) {
        super(scene)

        this.debugFolder = this.debug.ui.addFolder('camera')

        this.setInstance()
        this.setControls()
        super.handleStates()
    }

    setInstance(): void {
        this.instance = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 100)
        this.instance.position.set(0, 1, 3.5)
        this.scene.add(this.instance)
    }

    setControls(): void {
        this.orbitControls = new OrbitControls(this.instance, this.canvas)
        this.orbitControls.target.set(0, 1, 0)
        this.orbitControls.enableDamping = true
        this.orbitControls.enablePan = true
        this.orbitControls.enableRotate = true
        this.orbitControls.enableZoom = true

        const params = {
            fov: 35
        }

        const updateFOV = () => {
            this.instance.fov = params.fov
            this.instance.updateProjectionMatrix()
        }

        this.debugFolder.add(params, 'fov', 5, 120, 5).onChange(updateFOV)
    }
}