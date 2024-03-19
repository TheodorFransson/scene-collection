import * as THREE from 'three'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

import App from '../App'
import StateMachine from '../StateMachine/StateMachine'
import ResourceItem from './ResourceItem'
import Resource from '../World/Data/Resource'
import EventEmitter from './EventEmitter'

export default class Resources extends EventEmitter {
    app: App
    stateMachine: StateMachine
    sources: Resource[]
    items: ResourceItem
    toLoad: number
    loaded: number
    loaders: {
        gltfLoader: GLTFLoader
        textureLoader: THREE.TextureLoader
        cubeTextureLoader: THREE.CubeTextureLoader
    }

    constructor(sources: Resource[]) {
        super()

        this.app = App.getInstance()
        this.stateMachine = this.app.stateMachine

        this.sources = sources

        this.items = {}
        this.toLoad = this.sources.length
        this.loaded = 0

        this.setLoaders()
    }

    setLoaders(): void {
        this.loaders = {
            gltfLoader: new GLTFLoader(),
            textureLoader: new THREE.TextureLoader(),
            cubeTextureLoader: new THREE.CubeTextureLoader(),
        }
    }

    startLoading(): void {
        this.stateMachine.switchState('load')

        for (const source of this.sources) {
            if (source.type === 'gltfModel') {
                this.loaders.gltfLoader.load(source.path[0], (file) => {
                    this.sourceLoaded(source, file)
                })
            } else if (source.type === 'texture') {
                this.loaders.textureLoader.load(source.path[0], (file) => {
                    this.sourceLoaded(source, file)
                })
            } else if (source.type === 'cubeTexture') {
                this.loaders.cubeTextureLoader.load(source.path, (file) => {
                    this.sourceLoaded(source, file)
                })
            }
        }
    }

    sourceLoaded(source: Resource, file: THREE.Texture | GLTF): void {
        if (source) this.items[source.name] = file

        this.loaded++

        this.trigger("sourceLoaded", [this.loaded, this.toLoad])

        if (this.loaded === this.toLoad) {
            this.stateMachine.switchState('ready')
        }
    }
}
