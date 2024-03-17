import * as THREE from 'three';

import Settings from './Utils/Settings'
import Sizes from './Utils/Sizes'
import Time from './Utils/Time'
import Resources from './Utils/Resources'
import sources from './World/Data/sources'
import StateMachine from './StateMachine/StateMachine'
import StudioWorld from './Scenes/Studio/StudioWorld'
import World from './World/World'
import WeightsWorld from './Scenes/Weights/WeightsWorld'
import Renderer from './Renderer'
import { GUIController } from 'dat.gui'
import CityWorld from './Scenes/City/CityWorld';

export default class App {
    private static instance: App | null = null

    canvas: HTMLCanvasElement
    settings: Settings
    sizes: Sizes
    time: Time
    stateMachine: StateMachine
    resources: Resources
    renderer: Renderer
    worlds: World[]
    activeWorld: World | undefined

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
        this.settings = new Settings()
        this.sizes = new Sizes()
        this.time = new Time()

       
        this.stateMachine = new StateMachine()
        this.stateMachine.initialize(['load', 'ready'])

        this.resources = new Resources(sources)
        this.resources.startLoading()

        this.renderer = new Renderer()
        
        this.worlds = [new CityWorld(), new StudioWorld(), new WeightsWorld()]

        this.addWorldSelector()

        this.sizes.on('resize', () => this.resize())
        this.time.on('tick', () => this.update())
    }

    addWorldSelector(): void {
        const worldNames = this.worlds.map(config => config.name)
        const initialWorldName = worldNames[0]

        const worldSelector = { world: initialWorldName }
        this.settings.gui.add(worldSelector, 'world', worldNames).onChange((selectedWorldName) => {
            const world = this.worlds.find((world) => world.name === selectedWorldName)
            this.switchWorld(world)
        })

        this.stateMachine.on('transition', (previousState: string, currentState: string) => {
            if (currentState === 'ready') {
                const world = this.worlds.find((world) => world.name === initialWorldName)
                this.switchWorld(world)
            }
        })
    }

    switchWorld(world: World) {
        this.activeWorld = world
        this.stateMachine.switchState(world.name)
    }

    resize(): void {
        if (this.activeWorld) this.activeWorld.resize()
        this.renderer.resize()
    }

    update(): void {
        this.settings.preUpdate()
        if (this.activeWorld) this.activeWorld.update()
        this.renderer.update()
        this.settings.update()
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

        this.settings.gui.destroy()
    }

    public static getInstance(): App {
        return App.instance
    }
}
