import * as dat from 'dat.gui'
import * as Stats from 'stats-js'

export default class Debug {
    constructor() {
        this.active = window.location.hash.includes('debug')
        this.showStats = window.location.hash.includes('stats')

        if(this.active) {
            this.ui = new dat.GUI()
        } 

        if (this.showStats) {
            this.stats = new Stats()
            this.stats.showPanel(0)
            document.body.appendChild(this.stats.dom)
        }
    }

    preUpdate() {
        if (this.showStats) this.stats.begin()
    }

    update() {
        if (this.showStats) this.stats.end()
    }
}