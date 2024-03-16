import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass }  from 'three/examples/jsm/postprocessing/UnrealBloomPass.js' 
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js'
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js'
import App from './App.js'

export default class Renderer
{
    constructor(scene, camera)
    {
        this.app = new App()
        this.canvas = this.app.canvas
        this.sizes = this.app.sizes
        this.scene = scene
        this.camera = camera
        this.time = this.app.time
        this.debug = this.app.debug

        this.debugFolder = this.debug.ui.addFolder('postprocessing')
        this.toneMappingFolder = this.debug.ui.addFolder('toneMapping')
        this.DOFFolder = this.debugFolder.addFolder('DOF')
        this.bloomFolder = this.debugFolder.addFolder('unreal bloom')

        this.toneMappingDebug()
        

        this.setInstance()
        this.initPostprocessing()
    }

    setInstance()
    {
        this.rendererInstance = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            powerPreference: "high-performance",
            stencil: false,
            depth: true
        })

        this.rendererInstance.physicallyCorrectLights = true
        this.rendererInstance.outputEncoding = THREE.sRGBEncoding
        this.rendererInstance.toneMapping = THREE.LinearToneMapping
        this.rendererInstance.toneMappingExposure = 1
        this.rendererInstance.shadowMap.enabled = true
        this.rendererInstance.shadowMap.autoUpdate = false
        this.rendererInstance.shadowMap.needsUpdate = true
        this.rendererInstance.shadowMap.type = THREE.PCFSoftShadowMap
        this.rendererInstance.setClearColor('#2a5bb0')
        this.rendererInstance.autoClear = false
        this.rendererInstance.info.autoReset = false
        this.rendererInstance.setSize(this.sizes.width, this.sizes.height)
        this.rendererInstance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))

        let samples = null

        if(this.rendererInstance.getPixelRatio() === 1) {
            samples = 4
        } else {
            samples = 0
        }    
        
        const renderTarget = new THREE.WebGLRenderTarget(this.sizes.width, this.sizes.height, {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat,
            encoding: THREE.sRGBEncoding,
            samples: samples
        })

        this.composer = new EffectComposer(this.rendererInstance, renderTarget)
        this.composer.addPass(new RenderPass(this.scene, this.camera.instance))
    }

    initPostprocessing() {
        const unrealBloomPass = new UnrealBloomPass()
        unrealBloomPass.enabled = false
        unrealBloomPass.strength = 0.025
        unrealBloomPass.radius = 0.3
        unrealBloomPass.threshold = 0.3
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

        if(this.rendererInstance.getPixelRatio() === 1 && !this.rendererInstance.capabilities.isWebGL2) {
            const smaaPass = new SMAAPass()
            this.composer.addPass(smaaPass)
        
            console.log('Using SMAA')
        }

        const bokehPass = new BokehPass(this.scene, this.camera.instance, {
            focus: 1, 
            aperture: 0.025, 
            maxblur: 0.01,
            width: this.sizes.width,
            height: this.sizes.height
        })
        this.composer.addPass(bokehPass)

        const DOFController = {
            focus: 20, 
            aperture: 1.1, 
            maxblur: 0.005,
            enabled: false
        }

        const DOFUpdate = () => {
            bokehPass.uniforms['focus'].value = DOFController.focus
            bokehPass.uniforms['aperture'].value = DOFController.aperture * 0.00001
            bokehPass.uniforms['maxblur'].value = DOFController.maxblur
            bokehPass.enabled = DOFController.enabled
        }

        if(this.debug.active) {
            this.DOFFolder.add(DOFController, 'focus', 10, 3000, 10).onChange(DOFUpdate)
            this.DOFFolder.add(DOFController, 'aperture', 0, 10, 0.1).onChange(DOFUpdate)
            this.DOFFolder.add(DOFController, 'maxblur', 0, 0.01, 0.001).onChange(DOFUpdate)
            this.DOFFolder.add(DOFController, 'enabled').onChange(DOFUpdate)

            this.bloomFolder.add(bloomController, 'strength', 0.01, 1, 0.001).onChange(bloomUpdate)
            this.bloomFolder.add(bloomController, 'radius', 0.001, 1, 0.001).onChange(bloomUpdate)
            this.bloomFolder.add(bloomController, 'threshold', 0.01, 1, 0.01).onChange(bloomUpdate)
            this.bloomFolder.add(bloomController, 'enabled').onChange(bloomUpdate)
        }

        DOFUpdate()
        bloomUpdate()
    }

    toneMappingDebug() {
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

    resize()
    {
        this.rendererInstance.setSize(this.sizes.width, this.sizes.height)
        this.rendererInstance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))

        this.composer.setSize(this.sizes.width, this.sizes.height)
        this.composer.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))
    }

    update()
    {
        this.rendererInstance.info.reset()
        this.composer.render(this.time.delta)
    }
}