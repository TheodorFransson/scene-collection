import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import App from '../App.js'
import States from '../StateMachine/States.js'

export default class Camera
{
    constructor()
    {
        this.app = new App()
        this.sizes = this.app.sizes
        this.time = this.app.time
        this.scene = this.app.scene
        this.canvas = this.app.canvas
        this.debug = this.app.debug

        this.stateMachine = this.app.stateMachine

        this.setInstance()
        this.setControls()
        this.handeEvents()
    }

    setInstance()
    {
        this.instance = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 10, 6000)
        this.instance.position.set(0, 100, 0)
        this.scene.add(this.instance)
    }

    setControls()
    {
        this.orbitControls = new OrbitControls(this.instance, this.canvas)
        this.orbitControls.enableDamping = true
        this.orbitControls.enablePan = false
        this.orbitControls.enableRotate = false
        this.orbitControls.enableZoom = false
    }

    resize()
    {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    handeEvents() {
        this.stateMachine.states.view.on('on', () => {
            this.orbitControls.enablePan = true
            this.orbitControls.enableRotate = true
            this.orbitControls.enableZoom = true
        })
    }

    update()
    {
        this.orbitControls.update()
    }
}