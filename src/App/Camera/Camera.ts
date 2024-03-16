import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import App from '../App.js'
import Sizes from '../Utils/Sizes'
import Debug from '../Utils/Debug'
import StateMachine from '../StateMachine/StateMachine'

export default class Camera
{
    scene: THREE.Scene
    instance: THREE.PerspectiveCamera
    sizes: Sizes
    canvas: HTMLElement
    debug: Debug
    stateMachine: StateMachine
    orbitControls: OrbitControls

    constructor(scene: THREE.Scene) {
        const app = App.getInstance()
        this.sizes = app.sizes
        this.scene = scene
        this.canvas = app.canvas
        this.debug = app.debug
        this.stateMachine = app.stateMachine
    }

    initDefault(): void {
        this.setInstance()
        this.setControls()
        this.handleStates()
    }

    setInstance(): void {
        this.instance = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 10, 6000)
        this.instance.position.set(0, 100, 0)
        this.scene.add(this.instance)
    }

    setControls(): void {
        this.orbitControls = new OrbitControls(this.instance, this.canvas)
        this.orbitControls.enableDamping = true
        this.orbitControls.enablePan = false
        this.orbitControls.enableRotate = false
        this.orbitControls.enableZoom = false
    }

    resize(): void {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    handleStates(): void {
        this.stateMachine.on('transition', (_previousState: string, currentState: string) => {
            const isInteractiveState = ['city', 'studio', 'weights'].includes(currentState)
            this.orbitControls.enablePan = isInteractiveState
            this.orbitControls.enableRotate = isInteractiveState
            this.orbitControls.enableZoom = isInteractiveState
        })
    }

    update(): void {
        this.orbitControls.update()
    }
}