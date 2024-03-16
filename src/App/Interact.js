import * as THREE from 'three'
import App from './App.js'
import States from './StateMachine/States.js'

export default class Interact {
    constructor() {
        this.app = new App()
        this.scene = this.app.scene
        this.stateMachine = this.app.stateMachine
        this.camera = this.app.camera.instance

        this.raycaster = new THREE.Raycaster()
        this.pointer = new THREE.Vector2()

        this.object = null

        this.setupEvents()
    }

    setupEvents() {
        window.addEventListener('pointermove', (event) => this.onPointerMove(event))
        window.addEventListener('pointerdown', (event) => this.onPointerDown(event))
    }

    onPointerDown() {
        if (this.object !== null) {
            if (this.object.onInteract !== undefined) {
                this.object.onInteract()
            }
        }
    }

    onPointerMove(event) {
        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1
        this.pointer.y = - (event.clientY / window.innerHeight) * 2 + 1

        this.raycaster.setFromCamera(this.pointer, this.camera)


        if (this.target === undefined) this.target = this.scene.getObjectByName('interact')
        
        if (this.target !== undefined) {
            const intersects = this.raycaster.intersectObjects(this.target.children)

            this.object = null
    
            if (intersects.length > 0) {
                this.object = intersects[0].object
            }
        }
    }
}