import * as THREE from 'three'
import { GUI } from 'dat.gui'

import App from '../App'
import Camera from '../Camera/Camera'
import Debug from '../Utils/Debug'
import StateMachine from '../StateMachine/StateMachine'
import Resources from '../Utils/Resources'

interface EnvironmentMap {
    intensity: number
    texture: THREE.Texture
    updateMaterials: () => void
}

export default class Environment {
    scene: THREE.Scene
    camera: Camera
    resources: Resources
    stateMachine: StateMachine
    debug: Debug
    debugFolder: GUI | undefined
    environmentMap: EnvironmentMap
    backgroundColor: THREE.ColorRepresentation

    constructor(scene: THREE.Scene, camera: Camera, ui: GUI) {
        this.scene = scene
        this.camera = camera
  
        this.debugFolder = ui.addFolder('environment')

        const app = App.getInstance()

        this.resources = app.resources
        this.stateMachine = app.stateMachine
        this.debug = app.debug
    }

    update(): void {
        this.camera.update()
    }

    resize(): void {
        this.camera.resize()
    }

    createScene(): void {
    }

    setupDebug(): void {
    }

    setEnvironmentMap(): void {
        this.environmentMap = {
            intensity: 0,
            texture: this.resources.items.environmentMapTexture as THREE.Texture,
            updateMaterials: () => {
                this.scene.traverse((child: THREE.Object3D) => {
                    if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
                        child.material.envMap = this.environmentMap.texture
                        child.material.envMapIntensity = this.environmentMap.intensity
                        child.material.needsUpdate = true
                    }
                })
            },
        }

        this.environmentMap.texture.colorSpace= THREE.SRGBColorSpace
        this.scene.environment = this.environmentMap.texture
        this.environmentMap.updateMaterials()

        if (this.debug.active && this.debugFolder) {
            this.debugFolder
                .add(this.environmentMap, 'intensity', 0, 4, 0.001)
                .name('envMapIntensity')
                .onChange(this.environmentMap.updateMaterials);
        }
    }

    setState(): void {
    }

    updateMaterial(scene: THREE.Scene, material: THREE.Material): void {
        scene.traverse((child: THREE.Object3D) => {
            if (child instanceof THREE.Mesh) {
                child.material = material
                child.castShadow = false
                child.receiveShadow = false
            }
        })
    }

    updateTexture(scene: THREE.Scene, texture: THREE.Texture): void {
        scene.traverse((child: THREE.Object3D) => {
            if (child instanceof THREE.Mesh && 'map' in child.material) {
                (child.material as THREE.MeshStandardMaterial).map = texture
            }
        })
    }
}
