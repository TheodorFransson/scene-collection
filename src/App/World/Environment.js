import * as THREE from 'three'
import App from '../App.js'

export default class Environment
{
    constructor()
    {
        this.app = new App()
        this.scene = this.app.scene
        this.camera = this.app.camera.instance
        this.resources = this.app.resources
        this.stateMachine = this.app.stateMachine
        this.debug = this.app.debug
       
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('environment')
        }

        this.createSimpleScene()
        this.setEnvironmentMap()
    }

    setEnvironmentMap()
    {
        this.environmentMap = {}
        this.environmentMap.intensity = 0
        this.environmentMap.texture = this.resources.items.environmentMapTexture
        this.environmentMap.texture.encoding = THREE.sRGBEncoding
        
        this.scene.environment = this.environmentMap.texture

        this.environmentMap.updateMaterials = () =>
        {
            this.scene.traverse((child) =>
            {
                if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
                {
                    child.material.envMap = this.environmentMap.texture
                    child.material.envMapIntensity = this.environmentMap.intensity
                    child.material.needsUpdate = true
                }
            })
        }
        this.environmentMap.updateMaterials()

        // Debug
        if(this.debug.active)
        {
            this.debugFolder
                .add(this.environmentMap, 'intensity')
                .name('envMapIntensity')
                .min(0)
                .max(4)
                .step(0.001)
                .onChange(this.environmentMap.updateMaterials)
        }
    }

    createSimpleScene() {
    }

    setState() {
        this.stateMachine.switchState(States.view)
    }

    setupChildren(scene, material) {
        scene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.material = material
                child.castShadow = false
                child.receiveShadow = false
            }
        })
    }
}