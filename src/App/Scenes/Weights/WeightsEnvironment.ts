import * as THREE from 'three'

import Environment from "../../World/Environment";
import { isGLTF } from '../../Utils/ResourceItem';
import Camera from '../../Camera/Camera';

interface BakedTextureMaps {
    full: THREE.Texture
    back: THREE.Texture
    side: THREE.Texture
    three: THREE.Texture
}

export default class WeightsEnvironment extends Environment {
    ground: THREE.Scene
    equipment: THREE.Scene

    bakedGround: BakedTextureMaps
    bakedEquipment: BakedTextureMaps
    
    constructor(scene: THREE.Scene, camera: Camera) {
        super(scene, camera)

        //this.debugFolder = this.debug.ui.addFolder('environment')
        this.backgroundColor =  '#160b00'

        this.createScene()

        this.stateMachine.switchState('weights')
    }

    createScene() {
        if (isGLTF(this.resources.items.ground)) {
            this.ground = new THREE.Scene()
            this.ground.add(this.resources.items.ground.scene)
        }

        const bakedGround = this.resources.items.bakedGround as THREE.Texture

        bakedGround.flipY = false
        bakedGround.colorSpace = THREE.SRGBColorSpace
        let material = new THREE.MeshBasicMaterial({ map: bakedGround })

        super.updateMaterial(this.ground, material)
        this.scene.add(this.ground)

        if (isGLTF(this.resources.items.equipment)) {
            this.equipment = new THREE.Scene()
            this.equipment.add(this.resources.items.equipment.scene)
        }

        const bakedEquipment = this.resources.items.bakedEquipment as THREE.Texture
        bakedEquipment.flipY = false
        bakedEquipment.colorSpace = THREE.SRGBColorSpace
        material = new THREE.MeshBasicMaterial({ 
            map: bakedEquipment,
            side: THREE.DoubleSide 
        })

        super.updateMaterial(this.equipment, material)
        this.scene.add(this.equipment)
    }
}