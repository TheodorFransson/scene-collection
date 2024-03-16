import * as THREE from 'three'
import App from '../App'
import Debug from '../Utils/Debug'

interface Params {
    density: number
    color: string
    enabled: boolean
}

export default class BetterFog {
    scene: THREE.Scene
    debug: Debug
    night: boolean
    params: Params
    fog: THREE.FogExp2
    debugFolder: any

    constructor(scene: THREE.Scene) {
        const app = App.getInstance()
        this.scene = scene
        this.debug = app.debug

        this.night = this.debug.night

        this.params = {
            density: 0.01,
            color: '#dedede',
            enabled: true
        };

        if (this.night) this.params.color = '#1d2366'

        this.inject()
        this.assign()

        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('Fog')
            this.initDebug()
        }
    }

    inject(): void {
        THREE.ShaderChunk.fog_fragment = `
        #ifdef USE_FOG
            vec3 fogOrigin = cameraPosition;
            vec3 fogDirection = normalize(vWorldPosition - fogOrigin);
            float fogDepth = distance(vWorldPosition, fogOrigin);

            float heightFactor = 0.05;
            float fogFactor = heightFactor * exp(-fogOrigin.y * fogDensity) * (
                1.0 - exp(-fogDepth * fogDirection.y * fogDensity)) / fogDirection.y;
            fogFactor = saturate(fogFactor);
             
            gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
        #endif`

        THREE.ShaderChunk.fog_pars_fragment = `
        #ifdef USE_FOG
            uniform vec3 fogColor;
            varying vec3 vWorldPosition;
            #ifdef FOG_EXP2
                uniform float fogDensity;
            #else
                uniform float fogNear;
                uniform float fogFar;
            #endif
        #endif`

        THREE.ShaderChunk.fog_vertex = `
        #ifdef USE_FOG
            vWorldPosition = worldPosition.xyz;
        #endif`

        THREE.ShaderChunk.fog_pars_vertex = `
        #ifdef USE_FOG
            varying vec3 vWorldPosition;
        #endif`
    }

    assign(): void {
        this.fog = new THREE.FogExp2(this.params.color, this.params.density)
        if (this.params.enabled) {
            this.scene.fog = this.fog
        } 
    }

    initDebug(): void {
        const update = () => {
            this.fog.density = this.params.density
            this.fog.color.set(this.params.color);
        }

        this.debugFolder.add(this.params, 'density', 0.0001, 0.05, 0.0001).onChange(update)
        this.debugFolder.addColor(this.params, 'color').onChange(update)
    }
}