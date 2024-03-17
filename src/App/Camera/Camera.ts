import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import App from '../App.js'
import Sizes from '../Utils/Sizes'
import Settings from '../Utils/Settings.js'
import StateMachine from '../StateMachine/StateMachine'

export default class Camera
{
    scene: THREE.Scene
    instance: THREE.PerspectiveCamera
    sizes: Sizes
    canvas: HTMLElement
    settings: Settings
    stateMachine: StateMachine
    orbitControls: OrbitControls

    initialControlSettings: {
        enableDamping?: boolean
        enablePan?: boolean
        enableRotate?: boolean
        enableZoom?: boolean
    } = {}

    constructor(scene: THREE.Scene) {
        const app = App.getInstance()
        this.sizes = app.sizes
        this.scene = scene
        this.canvas = app.canvas
        this.settings = app.settings
        this.stateMachine = app.stateMachine
    }

    init(): void {
        this.setInstance()
        this.setControls()
    }

    setInstance(): void {
        this.instance = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 10, 6000)
        this.instance.position.set(0, 100, 0)
        this.scene.add(this.instance)
    }

    setControls(): void {
        this.orbitControls = new OrbitControls(this.instance, this.canvas)
        this.initialControlSettings = {
            enableDamping: true,
            enablePan: false,
            enableRotate: false,
            enableZoom: false,
        }
    }

    updateControls(): void {
        if (this.orbitControls && this.initialControlSettings) {
            Object.keys(this.initialControlSettings).forEach((setting) => {
                this.orbitControls[setting] = this.initialControlSettings[setting]
            })
        }
    }

    resize(): void {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    setEnabled(boolean: boolean): void {
        this.orbitControls.enabled = boolean

        if (boolean) {
            this.updateControls()
        } 
    }

    update(): void {
        this.orbitControls.update()
    }
}