import * as dat from 'dat.gui'
import Stats from 'three/examples/jsm/libs/stats.module.js';

export default class Settings {
    showStats: boolean
    gui: dat.GUI
    stats?: Stats

    constructor() {
        this.gui = new dat.GUI()

        if (this.showStats) {
            this.stats = new Stats()
            this.stats.showPanel(0)
            document.body.appendChild(this.stats.dom)
        }
    }

    preUpdate(): void {
        if (this.showStats && this.stats) this.stats.begin()
    }

    update(): void {
        if (this.showStats && this.stats) this.stats.end()
    }
}
