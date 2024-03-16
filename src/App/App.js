import * as THREE from 'three'

import Debug from './Utils/Debug.js'
import Sizes from './Utils/Sizes.js'
import Time from './Utils/Time.js'
import Renderer from './Renderer.js'
import Resources from './Utils/Resources.js'
import sources from './World/Data/sources.js'
import StateMachine from './StateMachine/StateMachine.js'
import Interact from './Interact.js'
import StudioWorld from './Scenes/Studio/StudioWorld.js'

let instance = null

export default class App
{
    constructor(_canvas)
    {
        // Singleton
        if(instance)
        {
            return instance
        }
        instance = this
        
        // Global access
        window.experience = this

        // Options
        this.canvas = _canvas

        // State
        this.stateMachine = new StateMachine()

        // Setup
        this.debug = new Debug()
        this.sizes = new Sizes()
        this.time = new Time()
        this.resources = new Resources(sources)
        //this.interacter = new Interact()
        this.worlds = [new StudioWorld()]
        this.activeWorld = this.worlds[0]

        // Resize event
        this.sizes.on('resize', () =>
        {
            this.resize()
        })

        // Time tick event
        this.time.on('tick', () =>
        {
            this.update()
        })
    }

    resize()
    {
        this.activeWorld.resize()
    }

    update()
    {
        this.debug.preUpdate()
        this.activeWorld.update()
        this.debug.update()
    }

    destroy()
    {
        this.sizes.off('resize')
        this.time.off('tick')

        // Traverse the whole scene
        this.activeWorld.scene.traverse((child) =>
        {
            // Test if it's a mesh
            if(child instanceof THREE.Mesh)
            {
                child.geometry.dispose()

                // Loop through the material properties
                for(const key in child.material)
                {
                    const value = child.material[key]

                    // Test if there is a dispose function
                    if(value && typeof value.dispose === 'function')
                    {
                        value.dispose()
                    }
                }
            }
        })

        this.activeWorld.camera.controls.dispose()
        this.activeWorld.renderer.instance.dispose()

        if(this.debug.active)
            this.debug.ui.destroy()
    }
}