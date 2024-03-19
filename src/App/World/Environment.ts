import * as THREE from 'three'
import { GUI } from 'dat.gui'

import App from '../App'
import Camera from '../Camera/Camera'
import Settings from '../Utils/Settings'
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
    settings: Settings
    settingsFolder: GUI | undefined
    environmentMap: EnvironmentMap
    backgroundColor: THREE.ColorRepresentation

    constructor(scene: THREE.Scene, camera: Camera, gui: GUI) {
        this.scene = scene
        this.camera = camera
  
        this.settingsFolder = gui.addFolder('environment')

        const app = App.getInstance()

        this.resources = app.resources
        this.stateMachine = app.stateMachine
        this.settings = app.settings
    }

    update(): void {
        this.camera.update()
    }

    resize(): void {
        this.camera.resize()
    }

    createScene(): void {
    }

    setupSettings(): void {
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

        if (this.settingsFolder) {
            this.settingsFolder
                .add(this.environmentMap, 'intensity', 0, 4, 0.001)
                .name('envMapIntensity')
                .onChange(this.environmentMap.updateMaterials);
        }
    }

    updateMaterial(scene: THREE.Scene | THREE.Group<THREE.Object3DEventMap>, material: THREE.Material): void {
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
