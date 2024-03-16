import * as THREE from 'three';

import Debug from './Utils/Debug'
import Sizes from './Utils/Sizes'
import Time from './Utils/Time'
import Resources from './Utils/Resources'
import sources from './World/Data/sources'
import StateMachine from './StateMachine/StateMachine'
import StudioWorld from './Scenes/Studio/StudioWorld'
import World from './World/World'

export default class App {
    private static instance: App | null = null

    canvas: HTMLCanvasElement
    debug: Debug
    sizes: Sizes
    time: Time
    resources: Resources
    stateMachine: StateMachine
    worlds: World[]
    activeWorld: World

    constructor(_canvas?: HTMLCanvasElement) {
        if (_canvas) {
            this.canvas = _canvas
        }
    }

    public static initializeInstance(_canvas: HTMLCanvasElement): void {
        if (!App.instance) {
            App.instance = new App(_canvas);
            (window as any).experience = App.instance
       
            App.instance.completeInitialization()
        }
    }

    private completeInitialization(): void {
        this.debug = new Debug()
        this.sizes = new Sizes()
        this.time = new Time()

        
        this.stateMachine = new StateMachine()
        this.stateMachine.initialize(['load', 'ready', 'city', 'studio', 'weights'])

        this.resources = new Resources(sources)

        this.worlds = [new StudioWorld()]
        this.activeWorld = this.worlds[0]

        this.sizes.on('resize', () => this.resize())
        this.time.on('tick', () => this.update())
    }

    resize(): void {
        this.activeWorld.resize()
    }

    update(): void {
        this.debug.preUpdate()
        this.activeWorld.update()
        this.debug.update()
    }

    destroy(): void {
        this.sizes.off('resize')
        this.time.off('tick')

        this.activeWorld.scene.traverse((child: THREE.Object3D) => {
            if(child instanceof THREE.Mesh) {
                child.geometry.dispose()

                const materials = Array.isArray(child.material) ? child.material : [child.material];
                materials.forEach(material => {
                    Object.keys(material).forEach(prop => {
                        const value = (material as any)[prop]
                        if(value && typeof value.dispose === 'function') {
                            value.dispose()
                        }
                    })
                })
            }
        })

        if(this.debug.active) {
            this.debug.ui.destroy()
        }
    }

    public static getInstance(): App {
        return App.instance
    }
}
