import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass }  from 'three/examples/jsm/postprocessing/UnrealBloomPass.js' 
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js'
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js'
import { GUI } from 'dat.gui'

import App from './App.js'
import Sizes from './Utils/Sizes.js'
import Camera from './Camera/Camera.js'
import Time from './Utils/Time.js'
import Settings from './Utils/Settings.js'
import { Vector2 } from 'three'

export default class Renderer {
    canvas: HTMLCanvasElement
    sizes: Sizes
    time: Time
    rendererInstance: THREE.WebGLRenderer
    composer: EffectComposer
    renderPass: RenderPass
    DOFPass: BokehPass

    settings: Settings
    settingsFolder: GUI
    toneMappingFolder: GUI
    DOFFolder: GUI
    bloomFolder: GUI

    constructor() {
        const app = App.getInstance()
        this.canvas = app.canvas
        this.sizes = app.sizes
        this.time = app.time
        this.settings = app.settings

        this.settingsFolder = this.settings.gui.addFolder('postprocessing')
        this.toneMappingFolder = this.settings.gui.addFolder('toneMapping')
        this.DOFFolder = this.settingsFolder.addFolder('DOF')
        this.bloomFolder = this.settingsFolder.addFolder('unreal bloom')

        this.toneMappingDebug()

        this.setInstance()
        this.initPostprocessing()
    }

    private setInstance(): void {
        this.rendererInstance = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            powerPreference: "high-performance",
            stencil: false,
            depth: true
        })

        this.rendererInstance.outputColorSpace = THREE.SRGBColorSpace
        this.rendererInstance.toneMapping = THREE.LinearToneMapping
        this.rendererInstance.toneMappingExposure = 1
        this.rendererInstance.shadowMap.enabled = true
        this.rendererInstance.shadowMap.autoUpdate = false
        this.rendererInstance.shadowMap.needsUpdate = true
        this.rendererInstance.shadowMap.type = THREE.PCFSoftShadowMap
        this.rendererInstance.autoClear = false
        this.rendererInstance.info.autoReset = false
        this.rendererInstance.setSize(this.sizes.width, this.sizes.height)
        this.rendererInstance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))

        let samples = 0

        if (this.rendererInstance.getPixelRatio() === 1) {
            samples = 4
        } 
        
        const renderTarget = new THREE.WebGLRenderTarget(this.sizes.width, this.sizes.height, {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat,
            colorSpace: THREE.SRGBColorSpace,
            samples: samples
        })

        this.composer = new EffectComposer(this.rendererInstance, renderTarget)
    }

    private initBloom(): void {
        const unrealBloomPass = new UnrealBloomPass(new Vector2(this.sizes.width, this.sizes.height), 0.025, 0.3, 0.3)
        unrealBloomPass.enabled = false
        this.composer.addPass(unrealBloomPass)

        const bloomController = {
            strength: 0.025,
            radius: 0.3,
            threshold: 0.3,
            enabled: false
        }

        const bloomUpdate = () => {
            unrealBloomPass.strength = bloomController.strength
            unrealBloomPass.radius = bloomController.radius
            unrealBloomPass.threshold = bloomController.threshold
            unrealBloomPass.enabled = bloomController.enabled
        }

        this.bloomFolder.add(bloomController, 'strength', 0.01, 1, 0.001).onChange(bloomUpdate)
        this.bloomFolder.add(bloomController, 'radius', 0.001, 1, 0.001).onChange(bloomUpdate)
        this.bloomFolder.add(bloomController, 'threshold', 0.01, 1, 0.01).onChange(bloomUpdate)
        this.bloomFolder.add(bloomController, 'enabled').onChange(bloomUpdate)
    
        bloomUpdate()
    }

    private initDOF(): void {
        const DOFController = {
            focus: 20, 
            aperture: 1.1, 
            maxblur: 0.005,
            enabled: false
        }

        const DOFUpdate = () => {
            this.DOFPass.uniforms['focus'].value = DOFController.focus
            this.DOFPass.uniforms['aperture'].value = DOFController.aperture * 0.00001
            this.DOFPass.uniforms['maxblur'].value = DOFController.maxblur
            this.DOFPass.enabled = DOFController.enabled
        }

        this.DOFFolder.add(DOFController, 'focus', 10, 3000, 10).onChange(DOFUpdate)
        this.DOFFolder.add(DOFController, 'aperture', 0, 10, 0.1).onChange(DOFUpdate)
        this.DOFFolder.add(DOFController, 'maxblur', 0, 0.01, 0.001).onChange(DOFUpdate)
        this.DOFFolder.add(DOFController, 'enabled').onChange(DOFUpdate)
    }

    private updateDOF(scene: THREE.Scene, camera: Camera) {
        if (this.DOFPass) {
            this.composer.removePass(this.DOFPass)
        }

        this.DOFPass = new BokehPass(scene, camera.instance, {})
        this.DOFPass.enabled = false

        this.composer.addPass(this.DOFPass)
    }

    private initPostprocessing(): void {
        if(this.rendererInstance.getPixelRatio() === 1 && !this.rendererInstance.capabilities.isWebGL2) {
            const smaaPass = new SMAAPass(this.sizes.width, this.sizes.height)
            this.composer.addPass(smaaPass)
        
            console.log('Using SMAA')
        }

        this.initBloom()
        this.initDOF()
    }

    private toneMappingDebug(): void {
        let guiExposure = null

        const params = {
            exposure: 1.0,
            toneMapping: 'Linear'
        }

        const toneMappingOptions = {
            None: THREE.NoToneMapping,
            Linear: THREE.LinearToneMapping,
            Reinhard: THREE.ReinhardToneMapping,
            Cineon: THREE.CineonToneMapping,
            ACESFilmic: THREE.ACESFilmicToneMapping,
            Custom: THREE.CustomToneMapping
        }

        THREE.ShaderChunk.tonemapping_pars_fragment = THREE.ShaderChunk.tonemapping_pars_fragment.replace(
            'vec3 CustomToneMapping( vec3 color ) { return color; }',
            `#define Uncharted2Helper( x ) max( ( ( x * ( 0.15 * x + 0.10 * 0.50 ) + 0.20 * 0.02 ) / ( x * ( 0.15 * x + 0.50 ) + 0.20 * 0.30 ) ) - 0.02 / 0.30, vec3( 0.0 ) )
            float toneMappingWhitePoint = 1.0;
            vec3 CustomToneMapping( vec3 color ) {
                color *= toneMappingExposure;
                return saturate( Uncharted2Helper( color ) / Uncharted2Helper( vec3( toneMappingWhitePoint ) ) );
            }`
        )

        const updateGUI = () => {
            if (guiExposure !== null ) {
                guiExposure.remove()
                guiExposure = null;
            }

            if (params.toneMapping !== 'None') {
                guiExposure = this.toneMappingFolder.add(params, 'exposure', 0, 2).onChange(() => {
                    this.rendererInstance.toneMappingExposure = params.exposure;
                })
            }
        }

        this.toneMappingFolder.add(params, 'toneMapping', Object.keys(toneMappingOptions)).onChange(() => {
            updateGUI()
            this.rendererInstance.toneMapping = toneMappingOptions[params.toneMapping]
        })
    }

    setRenderScene(scene: THREE.Scene, camera: Camera) {
        if (this.renderPass) {
            this.composer.removePass(this.renderPass)
        }

        this.renderPass = new RenderPass(scene, camera.instance)
        this.composer.passes.unshift(this.renderPass)

        this.updateDOF(scene, camera)
    }

    setClearColor(color: THREE.ColorRepresentation): void {
        this.rendererInstance.setClearColor(color)
    }

    resize(): void {
        this.rendererInstance.setSize(this.sizes.width, this.sizes.height)
        this.rendererInstance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))

        this.composer.setSize(this.sizes.width, this.sizes.height)
        this.composer.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))
    }

    update(): void {
        this.rendererInstance.info.reset()
        this.composer.render(this.time.delta)
    }
}