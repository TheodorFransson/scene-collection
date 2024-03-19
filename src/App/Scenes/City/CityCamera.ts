import * as THREE from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Camera from '../../Camera/Camera'
import { GUI } from 'dat.gui'
import Time from '../../Utils/Time'
import App from '../../App'

export default class CityCamera extends Camera {
    time: Time
    settingsFolder: GUI
    pivot: THREE.Object3D

    constructor(scene: THREE.Scene, parentFolder: GUI) {
        super(scene)

        this.settingsFolder = parentFolder.addFolder('camera')
       
        super.init()

        this.time = App.getInstance().time

        this.pivot = new THREE.Object3D()
        this.pivot.position.set(-50, 0, 0)
        this.pivot.attach(this.instance)
    }

    setInstance(): void {
        this.instance = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 10, 6000)
        this.instance.position.set(500, 300, 500)
        this.scene.add(this.instance)
    }

    setControls(): void {
        this.orbitControls = new OrbitControls(this.instance, this.canvas)
        this.orbitControls.target.set(0, 1, 0)

        this.initialControlSettings = {
            enableDamping: false,
            enablePan: false,
            enableRotate: false,
            enableZoom: false,
        }
    }

    update(): void {
        this.pivot.rotateY(this.time.delta / 10000)
        this.instance.lookAt(0, 0, 0)
    }
}