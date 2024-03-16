import * as THREE from 'three'
import App from '../App.js'
import BetterFog from '../Effects/BetterFog.js'

export default class LoadingEnvironment {
    constructor() {
        this.app = new App()
        this.resources = this.app.resources
        this.scene = this.app.scene
        this.debug = this.app.debug
        this.stateMachine = this.app.stateMachine
        this.debugFolder = this.debug.ui.addFolder('loading environment')

        this.createEnvironment()
        this.resources.startLoading()
    }

    createEnvironment() {
    }

    setSunLight()
    {
        let skyColor = '#2a5bb0'

        const skySphereGeometry = new THREE.SphereGeometry(2000, 100, 100)
        const skyMaterial = new THREE.MeshBasicMaterial({
            color: skyColor,
            side: THREE.BackSide
        })
        const skySphere = new THREE.Mesh(skySphereGeometry, skyMaterial)
        this.scene.add(skySphere)

        this.sunLight = new THREE.DirectionalLight('#ffffff', 10)
        this.sunLight.castShadow = true
        this.sunLight.shadow.camera.far = 500
        this.sunLight.shadow.camera.near = 1
        this.sunLight.shadow.camera.top = 500
        this.sunLight.shadow.camera.bottom = -500
        this.sunLight.shadow.camera.left = -500
        this.sunLight.shadow.camera.right = 500
        
        this.sunLight.shadow.mapSize.set(256, 256)
        this.sunLight.shadow.normalBias = 0.01
        this.sunLight.position.set(50, 300, -50)

        this.scene.add(this.sunLight)

        this.fog = new BetterFog()

        // Debug
        if(this.debug.active) {

            this.debugFolder
                .add(this.sunLight, 'intensity')
                .name('sunLightIntensity')
                .min(0)
                .max(10)
                .step(0.001)
            
            this.debugFolder
                .add(this.sunLight.position, 'x')
                .name('sunLightX')
                .min(- 5)
                .max(5)
                .step(0.001)
            
            this.debugFolder
                .add(this.sunLight.position, 'y')
                .name('sunLightY')
                .min(- 5)
                .max(5)
                .step(0.001)
            
            this.debugFolder
                .add(this.sunLight.position, 'z')
                .name('sunLightZ')
                .min(- 5)
                .max(5)
                .step(0.001)
        }
    }
}