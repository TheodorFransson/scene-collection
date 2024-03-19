import * as THREE from 'three'

import Camera from "../../Camera/Camera"
import { GUI } from 'dat.gui'

export default class StudioCamera extends Camera {
    constructor(scene: THREE.Scene, parentFolder: GUI) {
        super(scene)
        super.init()
    }
}