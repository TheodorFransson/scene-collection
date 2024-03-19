import * as THREE from 'three'
import { GUI } from 'dat.gui'

import Camera from '../../Camera/Camera'
import Environment from '../../World/Environment'
import { isGLTF } from '../../Utils/ResourceItem'
import BetterFog from '../../Effects/BetterFog'

export default class CityEnvironment extends Environment {
    partsDay: THREE.Group<THREE.Object3DEventMap>[] = []
    partsNight: THREE.Group<THREE.Object3DEventMap>[] = []
    texturesDay: THREE.Texture[] = []
    texturesNight: THREE.Texture[] = []

    fog: BetterFog
    skySphere: THREE.Mesh
    sunLight: THREE.DirectionalLight

    constructor(scene: THREE.Scene, camera: Camera, gui: GUI) {
        super(scene, camera, gui)

        this.backgroundColor =  '#0a0a0a'

        this.setupSettings()
        this.createScene()

        super.setEnvironmentMap()

        this.fog = new BetterFog(this.scene, gui)
    }

    createScene(): void {
        this.createCity()
        this.createBillboards()
        this.createSky()
    }

    setupSettings(): void {
        const times = ['day', 'night']
        const timeofday = { timeofday: 'day' }
        this.settingsFolder.add(timeofday, 'timeofday', times).onChange((time) => {
            if (time === 'night') {
                this.setDay(false)
            } else {
                this.setDay(true)
            }
        })
    }

    setDay(day: boolean): void {
        this.partsDay.forEach((part) => {
            part.visible = day
        })

        this.partsNight.forEach((part) => {
            part.visible = !day
        })

        if (day) {
            this.fog.params.color = '#ebebeb';
            (this.skySphere.material as THREE.MeshBasicMaterial).color = new THREE.Color('#2a5bb0')
            this.sunLight.intensity = 10
        } else {
            this.fog.params.color = '#000000';
            (this.skySphere.material as THREE.MeshBasicMaterial).color = new THREE.Color('#000000')
            this.sunLight.intensity = 0
        }

        this.fog.update()
    }
    
    setMaterials(parts: THREE.Group<THREE.Object3DEventMap>[], textures: THREE.Texture[]): void {
        let length = Math.min(textures.length, parts.length)

        for (let i = 0; i < length; i++) {
            const material = new THREE.MeshBasicMaterial({
                map: textures[i]
            })

            super.updateMaterial(parts[i], material)
        }
    }

    createCity(): void {
        for (let i = 0; i < 7; i++) {
            const part = this.resources.items["cityPart0" + i]
            if (isGLTF(part)) {
                this.partsDay.push(part.scene)
            }
        }

        for (let i = 0; i < 6; i++) {
            const part = this.resources.items["cityPartNight0" + i]
            if (isGLTF(part)) {
                this.partsNight.push(part.scene)
            }
        }

        this.partsNight.push(this.partsDay[this.partsDay.length - 1].clone())

        for (let i = 0; i < 7; i++) {
            const textureDay = this.resources.items["cityBaked0" + i] as THREE.Texture
            const textureNight = this.resources.items["cityBakedNight0" + i] as THREE.Texture

            textureDay.flipY = false
            textureDay.colorSpace = THREE.SRGBColorSpace

            textureNight.flipY = false
            textureNight.colorSpace = THREE.SRGBColorSpace

            this.texturesDay.push(textureDay)
            this.texturesNight.push(textureNight)
        }

        this.setMaterials(this.partsDay, this.texturesDay)
        this.setMaterials(this.partsNight, this.texturesNight)
        
        this.partsDay.forEach((part) => {
            part.position.set(0, 0, 0)
            this.scene.add(part)
        })

        this.partsNight.forEach((part) => {
            part.position.set(0, 0, 0)
            part.visible = false
            this.scene.add(part)
        })
    }

    createBillboards(): void {
        let backsides = undefined
        if (isGLTF(this.resources.items.backsides)) {
            backsides = this.resources.items.backsides.scene
        }
        
        backsides.position.set(0, 0, 0)
        this.scene.add(backsides)

        let color = '#cad0db'     

        let scaffolding = undefined
        if (isGLTF(this.resources.items.scaffolding)) {
            scaffolding = this.resources.items.scaffolding.scene
        }
        const scaffoldMaterial = new THREE.MeshBasicMaterial({color})
        super.updateMaterial(scaffolding, scaffoldMaterial)

        scaffolding.position.set(0,0,0)
        this.scene.add(scaffolding)   

        let screens = undefined
        if (isGLTF(this.resources.items.screens)) {
            screens = this.resources.items.screens.scene
        }

        screens.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.material.emissiveIntesity = 1
                child.castShadow = false
                child.receiveShadow = false
            }
        })

        this.scene.add(screens)
    }


    createSky(): void {
        let skyColor = '#2a5bb0'

        const skySphereGeometry = new THREE.SphereGeometry(2000, 100, 100)
        const skyMaterial = new THREE.MeshBasicMaterial({
            color: skyColor,
            side: THREE.BackSide
        })
        this.skySphere = new THREE.Mesh(skySphereGeometry, skyMaterial)
        this.scene.add(this.skySphere)

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

        this.settingsFolder
            .add(this.sunLight, 'intensity')
            .name('sunLightIntensity')
            .min(0)
            .max(10)
            .step(0.001)
        
        this.settingsFolder
            .add(this.sunLight.position, 'x')
            .name('sunLightX')
            .min(- 5)
            .max(5)
            .step(0.001)
        
        this.settingsFolder
            .add(this.sunLight.position, 'y')
            .name('sunLightY')
            .min(- 5)
            .max(5)
            .step(0.001)
        
        this.settingsFolder
            .add(this.sunLight.position, 'z')
            .name('sunLightZ')
            .min(- 5)
            .max(5)
            .step(0.001)
    }
}
