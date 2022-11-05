/**
 * The main script of the web application
 */

import Game from "./game/game"
import Scene from "./browser/scene"
import Controller from "./browser/controller"
import Storage from "./browser/storage"

// set height variable for mobile browsers
const appHeight = () => {
    const doc = document.documentElement
    doc.style.setProperty('--app-height', `${window.innerHeight}px`)
}
window.addEventListener('resize', appHeight)
appHeight()

// init game
const controller = new Controller()
const scene = new Scene(controller)
const store = new Storage()
let game = new Game(scene, controller, store)
game.onStart()