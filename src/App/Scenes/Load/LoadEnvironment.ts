import * as THREE from 'three'

import { GUI } from "dat.gui"
import { Scene } from "three"
import Camera from "../../Camera/Camera"
import Environment from "../../World/Environment"
import gsap from 'gsap'

export default class LoadEnvironment extends Environment {
    loadingBarElement: HTMLElement
    overlayMaterial: THREE.ShaderMaterial

    constructor(scene: Scene, camera: Camera, gui: GUI) {
        super(scene, camera, gui)

        this.loadingBarElement = document.querySelector('.loading-bar')

        this.createOverlay()

        this.resources.on("sourceLoaded", (loaded, toLoad) => 
            this.updateProgressBar(loaded, toLoad))

        this.resources.startLoading()
    }

    createOverlay() {
        const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1)
        this.overlayMaterial = new THREE.ShaderMaterial({
            transparent: true,
            uniforms: {
                uAlpha: { value: 1 }
            },
            vertexShader: `
                void main() {
                    gl_Position = vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float uAlpha;

                void main() {
                    gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
                }
            `
        })
        const overlay = new THREE.Mesh(overlayGeometry, this.overlayMaterial)
        this.scene.add(overlay)
    }

    updateProgressBar(loaded: number, toLoad: number) {
        const progressRatio = loaded / toLoad
        this.loadingBarElement.style.transform = `scaleX(${progressRatio})`
    }

    removeOverlay() {
        gsap.to(this.overlayMaterial.uniforms.uAlpha, 
            {delay: 0.5, duration: 1, value: 0, ease: "power0.out"})
        this.loadingBarElement.classList.add('ended')
        this.loadingBarElement.style.transform = ''
    }
}