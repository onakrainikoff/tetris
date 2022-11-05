const ZingTouch = require('zingtouch');
import { GameController, GameControllerAction } from "../game/game-controller"

/**
 * Browser implementation of GameController
 */
class Controller implements GameController {
    private gameControllerActionListener?: (action: GameControllerAction) => void

    constructor() {
        document.onkeydown = (e) => {
            this.keyBoardEventsHandler(e)
        };
        const field = document.querySelector(".field")
        if (field === null) {
            throw new Error(".game-scene .field not found")
        }
        const touchRegion = new ZingTouch.Region(field);
        const tap = new ZingTouch.Tap({
            numInputs: 1,
            maxDelay: 200,
            tolerance: 10
        })
        const pan = new ZingTouch.Pan({
            threshold: 30
        })
        touchRegion.bind(field, tap, (e: any) => this.touchEventsHandler(e))
        touchRegion.bind(field, pan, (e: any) => this.touchEventsHandler(e))
    }
    setControllerActionListener(listener: (action: GameControllerAction) => void): void {
        this.gameControllerActionListener = listener
    }

    onPauseClick(): void {
        if (this.gameControllerActionListener !== undefined) {
            this.gameControllerActionListener(GameControllerAction.PAUSE)
        }
    }

    onResumeClick(): void {
        if (this.gameControllerActionListener !== undefined) {
            this.gameControllerActionListener(GameControllerAction.RESUME)
        }
    }

    onRestartClick(): void {
        if (this.gameControllerActionListener !== undefined) {
            this.gameControllerActionListener(GameControllerAction.NEW_GAME)
        }
    }

    private touchEventsHandler(e: any): void {
        if (this.gameControllerActionListener !== undefined) {
            const eventType = e.type
            if (eventType === 'tap') {
                this.gameControllerActionListener(GameControllerAction.ROTATE)
            } else if (eventType === 'swipe') {
                const { currentDirection } = e.detail.data[0]
                if (currentDirection >= 202.5 && currentDirection <= 337.5) {
                    this.gameControllerActionListener(GameControllerAction.DOWN) 
                }
            } else if (eventType === 'pan') {
                const {currentDirection} = e.detail.data[0]
                if (currentDirection >= 135 && currentDirection <= 225) {
                    this.gameControllerActionListener(GameControllerAction.LEFT) 
                } else if (currentDirection >= 315 || currentDirection <= 45) {
                    this.gameControllerActionListener(GameControllerAction.RIGHT) 
                } else if (currentDirection > 225 && currentDirection < 315) {
                    this.gameControllerActionListener(GameControllerAction.DOWN) 
                }
            }
        }
    }

    private keyBoardEventsHandler(e: KeyboardEvent): void {
        if (this.gameControllerActionListener !== undefined) {
            if (["ArrowLeft", "KeyA"].includes(e.code)) {
                this.gameControllerActionListener(GameControllerAction.LEFT)
            } else if (["ArrowRight", "KeyD"].includes(e.code)) {
                this.gameControllerActionListener(GameControllerAction.RIGHT)
            } else if (["ArrowDown", "KeyS", "Space"].includes(e.code)) {
                this.onDownAction()
            } else if (["ArrowUp", "KeyW", "Enter"].includes(e.code)) {
                this.gameControllerActionListener(GameControllerAction.ROTATE)
            }
        }
    }

    private onDownAction(): void {
        new Promise<void>((resolve, reject) => {
            if (this.gameControllerActionListener !== undefined) {
                this.gameControllerActionListener(GameControllerAction.DOWN)
                setTimeout(() => {
                    if (this.gameControllerActionListener !== undefined) {
                        this.gameControllerActionListener(GameControllerAction.DOWN)
                        resolve()
                    }
                }, 50)
            } else {
                resolve()
            }
        })
    }
}

export default Controller