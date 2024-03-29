import * as THREE from 'three'

import Environment from "../../World/Environment"
import { isGLTF } from '../../Utils/ResourceItem'
import Camera from '../../Camera/Camera'
import { GUI } from 'dat.gui'

interface BakedTextureMaps {
    full: THREE.Texture
    back: THREE.Texture
    side: THREE.Texture
    three: THREE.Texture
}

export default class StudioEnvironment extends Environment {
    backdrop: THREE.Scene
    model: THREE.Scene

    backdropBaked: BakedTextureMaps
    modelBaked: BakedTextureMaps
    
    constructor(scene: THREE.Scene, camera: Camera, gui: GUI) {
        super(scene, camera, gui)

        this.backgroundColor =  '#0a0a0a'

        this.createScene()
        this.setupSettings()
    }

    createScene() {
        this.backdropBaked = {
            full: this.resources.items.backdropFull as THREE.Texture,
            back: this.resources.items.backdropBack as THREE.Texture,
            side: this.resources.items.backdropSide as THREE.Texture,
            three: this.resources.items.backdropThree as THREE.Texture,
        }

        this.modelBaked = {
            full: this.resources.items.modelFull as THREE.Texture,
            back: this.resources.items.modelBack as THREE.Texture,
            side: this.resources.items.modelSide as THREE.Texture,
            three: this.resources.items.modelThree as THREE.Texture,
        }

        Object.values(this.backdropBaked).forEach(texture => {
            texture.colorSpace = THREE.SRGBColorSpace
            texture.flipY = false
        });

        Object.values(this.modelBaked).forEach(texture => {
            texture.colorSpace = THREE.SRGBColorSpace
            texture.flipY = false
        })

        const backdropMaterial = new THREE.MeshBasicMaterial({ map: this.backdropBaked.full })
        const modelMaterial = new THREE.MeshBasicMaterial({ map: this.modelBaked.full })

        if (isGLTF(this.resources.items.backdrop)) {
            this.backdrop = new THREE.Scene()
            this.backdrop.add(this.resources.items.backdrop.scene)
        }

        if (isGLTF(this.resources.items.model)) {
            this.model = new THREE.Scene()
            this.model.add(this.resources.items.model.scene)
        }
        
        super.updateMaterial(this.backdrop, backdropMaterial)
        super.updateMaterial(this.model, modelMaterial)

        this.scene.add(this.backdrop)
        this.scene.add(this.model)
    }

    setupSettings() {
        const params = {
            light: "full"
        }

        const lightOptions = {
            full: "full",
            back: "back",
            side: "side",
            three: "three"
        }

        const updateLight = () => {
            this.updateTexture(this.backdrop, this.backdropBaked[params.light])
            this.updateTexture(this.model, this.modelBaked[params.light])
        }

        this.settingsFolder.add(params, 'light', Object.keys(lightOptions)).onChange(() => {
            updateLight()
        })
    }
}