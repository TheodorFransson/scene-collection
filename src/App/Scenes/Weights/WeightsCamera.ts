import * as THREE from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Camera from '../../Camera/Camera'

export default class WeightsCamera extends Camera {
    constructor(scene: THREE.Scene) {
        super(scene)

        super.init()
    }

    setInstance(): void {
        this.instance = new THREE.PerspectiveCamera(20, this.sizes.width / this.sizes.height, 0.1, 1000)
        this.instance.position.set(0, 3, 10)
        this.scene.add(this.instance)
    }

    setControls(): void {
        this.orbitControls = new OrbitControls(this.instance, this.canvas)
        this.orbitControls.target.set(0, 1, 0)
        this.initialControlSettings = {
            enableDamping: true,
            enablePan: false,
            enableRotate: true,
            enableZoom: true,
        }
    }
}