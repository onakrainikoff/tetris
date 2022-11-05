import GameField from './game-field'
import GameScene from './game-scene'
import {GameController, GameControllerAction}from './game-controller'
import GameStorage from './game-storage'

/**
 * Main class of Tetris game
 */
class Game {
    private scene: GameScene
    private controller: GameController
    private storage: GameStorage
    private gameField: GameField
    private gameState: GameState
    private score: number = 0
    private timer: any
    private sratrTimerDelay = 500
    private minTimerDelay = 50
    private speedUpPercent = 2
    private level: number = 0


    constructor(scene: GameScene, controller: GameController, storage: GameStorage) {
        this.gameState = GameState.NotStarted
        this.gameField = new GameField()
        this.scene = scene
        this.controller = controller
        this.storage = storage
        this.controller.setControllerActionListener((action: GameControllerAction) => this.onGameControllerAction(action))
        this.scene.updateField(this.gameField.getFieldImage())
    }

    /**
     * Listener Game Controller Actions
     * @param action GameControllerAction
     */
    private onGameControllerAction(action: GameControllerAction):void {
        if(action === GameControllerAction.NEW_GAME) {
            this.onRestart()
        }
        if(action === GameControllerAction.LEFT) {
            this.onLeft()
        }
        if(action === GameControllerAction.RIGHT) {
            this.onRight()
        }
        if(action === GameControllerAction.DOWN) {
            this.onDown()
        }
        if(action === GameControllerAction.ROTATE) {
            this.onRotate()
        }
        if(action === GameControllerAction.PAUSE) {
            this.onPause()
        }
        if(action === GameControllerAction.RESUME) {
            this.onResume()
        }
    }


    private onRestart(): void {
        this.gameState = GameState.NotStarted
        this.gameField = new GameField()
        this.onStart()
    }

    onStart() {
        this.score = 0
        this.level = 0
        this.updateGameStatistic([])
        this.gameField.setNextTetro()
        const next = this.gameField.getNextTero()
        if(next !== null){
            this.scene.updateNextTetro(next.points, next.typeId, next.size)
        }
        this.gameState = GameState.Started
        this.runTimer()
    }

    private runTimer(): void {
        if (this.timer !== undefined && this.timer !== null) {
            clearInterval(this.timer);
        }
        this.timer = setInterval(() => this.onDown(), this.calcSpeed())
    }

    private stopTimer(): void {
        if (this.timer !== undefined && this.timer !== null) {
            clearInterval(this.timer);
        }
    }

    private onLeft(): void {
        if (this.gameState === GameState.Started) {
            this.gameField.moveTetroLeft()
            this.scene.updateField(this.gameField.getFieldImage())
        }
    }

    private onRight(): void {
        if (this.gameState === GameState.Started) {
            this.gameField.moveTetroRight()
            this.scene.updateField(this.gameField.getFieldImage())
        }
    }

    private onDown(): void {
        if (this.gameState === GameState.Started) {
            const moveDownSuccess = this.gameField.moveTetroDown()
            if (!moveDownSuccess) {
                this.gameState = GameState.Await
                this.stopTimer()
                this.gameField.freezeTetro()
                const removed = this.gameField.removeFilledLines()
                this.scene.removeLines(removed)
                    .then(() => {
                        this.updateGameStatistic(removed)
                        const nextTetroSuccess = this.gameField.setNextTetro()
                        if (!nextTetroSuccess) {
                            this.gameState = GameState.GameOver
                            this.scene.onGameOver()
                        } else {
                            const next = this.gameField.getNextTero()
                            if(next !== null){
                                this.scene.updateNextTetro(next.points, next.typeId, next.size)
                            }
            
                            this.scene.updateField(this.gameField.getFieldImage())
                            this.gameState = GameState.Started
                            this.runTimer()
                        }
                    })
            } else {
                this.scene.updateField(this.gameField.getFieldImage())
            }
        }
    }

    private onRotate(): void {
        if (this.gameState === GameState.Started) {
            this.gameField.rotateTetro()
            this.scene.updateField(this.gameField.getFieldImage())
        }
    }

    private onPause(): void {
        if (this.gameState === GameState.Started) {
            this.gameState = GameState.Paused
            this.stopTimer()
        }
    }

    private onResume(): void {
        if (this.gameState === GameState.Paused) {
            this.gameState = GameState.Started
            this.runTimer()
        }
    }

    private updateGameStatistic(removeLines: number[]): void {
        let addScore = 0
        switch (removeLines.length) {
            case 1:
                addScore += 100
                break;
            case 2:
                addScore += 300
                break;
            case 3:
                addScore += 700
                break;
            case 4:
                addScore += 1500
                break;
        }
        this.score += addScore
        if(this.storage.getBestScore() < this.score) {
            this.storage.setBestScore(this.score)
        }
        this.level = Math.floor(this.score / 500)
        this.scene.updateLevel(this.level + 1)
        this.scene.updateScore(this.score)
        this.scene.updateBestScore(this.storage.getBestScore())
    }

    private calcSpeed(): number {
        const speedUp = this.sratrTimerDelay * (((this.level - 1) * this.speedUpPercent) / 100)
        let delay = Math.round(this.sratrTimerDelay - speedUp)
        return Math.max(this.minTimerDelay, delay)
    }
}

/**
 * Enum of Game States
 */
enum GameState {
    NotStarted,
    Started,
    Paused,
    Await,
    GameOver
}
export default Game