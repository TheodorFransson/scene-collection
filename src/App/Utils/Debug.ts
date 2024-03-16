import * as dat from 'dat.gui'
import Stats from 'stats.js'

export default class Debug {
    active: boolean
    showStats: boolean
    night: boolean
    ui: dat.GUI
    stats?: Stats

    constructor() {
        this.active = window.location.hash.includes('debug')
        this.showStats = window.location.hash.includes('stats')

        this.ui = new dat.GUI();

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
