import * as THREE from 'three'
import App from '../App'
import Settings from '../Utils/Settings'
import { GUI } from 'dat.gui'

interface Params {
    density: number
    color: string
    enabled: boolean
}

export default class BetterFog {
    scene: THREE.Scene
    params: Params
    fog: THREE.FogExp2
    settingsFolder: any

    constructor(scene: THREE.Scene, gui: GUI) {
        const app = App.getInstance()
        this.scene = scene

        this.params = {
            density: 0.1,
            color: '#ebebeb',
            enabled: true
        }

        this.inject()
        this.assign()

        this.settingsFolder = gui.addFolder('fog')
        this.initSettings()        
    }

    inject(): void {
        THREE.ShaderChunk.fog_fragment = `
        #ifdef USE_FOG
            vec3 fogOrigin = cameraPosition;
            vec3 fogDirection = normalize(vWorldPosition - fogOrigin);
            float fogDepth = distance(vWorldPosition, fogOrigin);
        
            float fogStartDistance = 250.0;
            float adjustedFogDepth = max(fogDepth - fogStartDistance, 0.0); // Apply start distance
        
            float heightFactor = 0.05;
            float fogFactor = heightFactor * exp(-fogOrigin.y * fogDensity) * (
                1.0 - exp(-adjustedFogDepth * fogDirection.y * fogDensity)) / fogDirection.y;
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

    update(): void {
        this.fog.density = this.params.density
        this.fog.color.set(this.params.color)
    }

    initSettings(): void {
        const update = () => this.update()

        this.settingsFolder.add(this.params, 'density', 0.0001, 0.1, 0.0001).onChange(update)
        this.settingsFolder.addColor(this.params, 'color').onChange(update)
    }
}