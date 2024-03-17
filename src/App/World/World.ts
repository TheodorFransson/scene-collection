import * as THREE from 'three'

import App from '../App.js'
import Renderer from '../Renderer.js'
import Resources from '../Utils/Resources.js'
import StateMachine from '../StateMachine/StateMachine.js'
import Environment from './Environment.js'
import Camera from '../Camera/Camera.js'
import { GUI } from 'dat.gui'
import Settings from '../Utils/Settings.js'

export default class World {
    scene: THREE.Scene
    renderer: Renderer
    resources: Resources
    stateMachine: StateMachine
    settings: Settings
    environment: Environment
    camera: Camera
    name: string
    worldFolder: GUI

    constructor(scene: THREE.Scene, name: string) {
        this.scene = scene
        this.name = name

        const app = App.getInstance()
        this.resources = app.resources
        this.stateMachine = app.stateMachine
        this.renderer = app.renderer
        this.settings = app.settings

        this.initWorldFolder()
    }

    initWorldFolder(): void {
        this.worldFolder = this.settings.gui.addFolder(this.name)
        this.worldFolder.hide()
    }

    listenToTransition(EnvironmentClass: new (scene: THREE.Scene, camera: Camera, ui: GUI) => Environment, CameraClass: new (scene: THREE.Scene, parentFolder: GUI) => Camera): void {
        this.stateMachine.on('transition', (previousState: string, currentState: string) => {
            if (currentState === this.name) {
                if (!this.camera) this.camera = new CameraClass(this.scene, this.worldFolder)
                if (!this.environment) this.environment = new EnvironmentClass(this.scene, this.camera, this.worldFolder)

                this.camera.setEnabled(true)

                this.renderer.setRenderScene(this.scene, this.camera)
                this.renderer.setClearColor(this.environment.backgroundColor)

                this.worldFolder.show()
            } else if (previousState === this.name) {
                this.camera.setEnabled(false)
                this.worldFolder.hide()
            }
        })
    }

    update(): void {
        if (this.environment) this.environment.update()
    }

    resize(): void {
        if (this.environment) this.environment.resize()
    }
}