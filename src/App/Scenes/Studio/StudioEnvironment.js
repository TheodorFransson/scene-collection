import * as THREE from 'three'

import Environment from "../../World/Environment";

export default class StudioEnvironment extends Environment {
    constructor(scene, camera) {
        super(scene, camera)
    }

    createScene() {
        this.backdropBaked = {}
        this.backdropBaked.full = this.resources.items.backdropFull
        this.backdropBaked.back = this.resources.items.backdropBack
        this.backdropBaked.side = this.resources.items.backdropSide
        this.backdropBaked.three = this.resources.items.backdropThree

        this.modelBaked = {}
        this.modelBaked.full = this.resources.items.modelFull
        this.modelBaked.back = this.resources.items.modelBack
        this.modelBaked.side = this.resources.items.modelSide
        this.modelBaked.three = this.resources.items.modelThree

        for (const texture in this.backdropBaked) {
            this.backdropBaked[texture].encoding = THREE.sRGBEncoding;
            this.backdropBaked[texture].flipY = false;
        }

        for (const texture in this.modelBaked) {
            this.modelBaked[texture].encoding = THREE.sRGBEncoding;
            this.modelBaked[texture].flipY = false;
        }

        const backdropMaterial = new THREE.MeshBasicMaterial({ map: this.backdropBaked.full })
        const modelMaterial = new THREE.MeshBasicMaterial({ map: this.modelBaked.full })

        this.backdrop = this.resources.items.backdrop.scene
        this.model = this.resources.items.model.scene

        super.updateMaterial(this.backdrop, backdropMaterial)
        super.updateMaterial(this.model, modelMaterial)

        this.scene.add(this.backdrop)
        this.scene.add(this.model)
    }

    setupDebug() {
        const params = {
            light: "full"
        }

        const lightOptions = {
            full: "full",
            back: "back",
            side: "side",
            three: "three"
        }

        const updateLight = () => {
            this.updateTexture(this.backdrop, this.backdropBaked[params.light])
            this.updateTexture(this.model, this.modelBaked[params.light])
        }

        this.debugFolder.add(params, 'light', Object.keys(lightOptions)).onChange(() => {
            updateLight()
        })
    }

    setState() {
        this.stateMachine.switchState(States.studio)
    }
}