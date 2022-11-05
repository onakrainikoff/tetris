import GameScene from "../game/game-scene"
import Controller from "./controller"
/**
 * Browser implementation of GameScene
 */
class Scene implements GameScene {
    private controller: Controller
    private field: HTMLDivElement[][]
    private level: Element
    private score: Element
    private modalAria: HTMLElement
    private modalGameOver: HTMLElement
    private modalPause: HTMLElement
    private bestScore: Element
    private nextTetro: HTMLDivElement[][]
    private maxX: number = 10
    private maxY: number = 20

    constructor(controller: Controller) {
        this.controller = controller
        // init scene
        const gameScene = document.querySelector('.game-scene');
        if (gameScene === null) {
            throw new Error(".game-scene not found")
        }
        // init filed
        const field = gameScene.querySelector(".field")
        if (field === null) {
            throw new Error(".game-scene .field not found")
        }
        this.field = new Array<Array<HTMLDivElement>>()
        for (let y = 0; y < this.maxY; y++) {
            let row = []
            for (let x = 0; x < this.maxX; x++) {
                let cell = document.createElement('div')
                cell.classList.add('cell')
                row.push(cell)
                field.append(cell)
            }
            this.field.push(row)
        }
        // init level
        const level = gameScene.querySelector(".level-value")
        if (level === null) {
            throw new Error(".game-scene .level-value not found")
        }
        this.level = level
        // init score
        const score = gameScene.querySelector(".score-value")
        if (score === null) {
            throw new Error(".game-scene .score-value not found")
        }
        this.score = score
        // init bestScore
        const bestScore = gameScene.querySelector(".best-score-value")
        if (bestScore === null) {
            throw new Error(".game-scene .best-score-value not found")
        }
        this.bestScore = bestScore
        // init nextTetro
        const nextTetroField = gameScene.querySelector(".next-tetro-field")
        if (nextTetroField === null) {
            throw new Error(".game-scene .next-tetro-field not found")
        }
        this.nextTetro = new Array<Array<HTMLDivElement>>()
        for (let y = 0; y < 4; y++) {
            let row = []
            for (let x = 0; x < 4; x++) {
                let cell = document.createElement('div')
                cell.classList.add('cell')
                row.push(cell)
                nextTetroField.append(cell)
            }
            this.nextTetro.push(row)
        }
        // init buttons 
        const scenePauseBtn = gameScene.getElementsByClassName("pause-button")[0] as HTMLElement
        if (scenePauseBtn === undefined) {
            throw new Error(".game-scene .pause-button not found")
        }
        scenePauseBtn.onclick = () => {
            this.controller.onPauseClick()
            this.modalAria.style.display = 'grid'
            this.modalPause.style.display = 'block'
        }

        // init modals
        const modalAria = document.getElementsByClassName("modal-aria")[0] as HTMLElement
        if (modalAria === undefined) {
            throw new Error(".modal-aria not found")
        }
        this.modalAria = modalAria
        this.modalAria.style.display = "none"
        
        const modalPause = this.modalAria.getElementsByClassName("modal-pause")[0] as HTMLElement
        if (modalPause === undefined) {
            throw new Error(".modal-pause not found")
        }
        this.modalPause = modalPause
        this.modalPause.style.display = "none"
        const restartBtn = this.modalPause.getElementsByClassName("restart-button")[0] as HTMLElement
        if (restartBtn === undefined) {
            throw new Error(".restart-buton not found")
        }
        restartBtn.onclick = () => {
            this.controller.onRestartClick()
            this.modalAria.style.display = 'none'
            this.modalPause.style.display = 'none'
        }

        const continueBtn = this.modalPause.getElementsByClassName("continue-button")[0] as HTMLElement
        if (continueBtn === undefined) {
            throw new Error(".continue-buton not found")
        }
        continueBtn.onclick = () => {
            this.controller.onResumeClick()
            this.modalAria.style.display = 'none'
            this.modalPause.style.display = 'none'
        }

        const modalGameOver = this.modalAria.getElementsByClassName("modal-game-over")[0] as HTMLElement
        if (modalGameOver === undefined) {
            throw new Error(".modal-game-over not found")
        }
        this.modalGameOver = modalGameOver
        this.modalGameOver.style.display = "none"
        const restartBtn2 = this.modalGameOver.getElementsByClassName("restart-button")[0] as HTMLElement
        if (restartBtn2 === undefined) {
            throw new Error(".restart-buton not found")
        }
        restartBtn2.onclick = () => {
            this.controller.onRestartClick() 
            this.modalAria.style.display = 'none'
            this.modalGameOver.style.display = 'none'
        }
    }

    updateLevel(level: number): void {
        this.level.textContent = level.toString()
    }

    updateScore(score: number): void {
        this.score.textContent = score.toString()
    }

    updateBestScore(score: number): void {
        this.bestScore.textContent = score.toString()
    }

    updateNextTetro(tetroPoints: Array<[number, number]>, typeId: string, size: number): void {
        this.nextTetro.forEach(line => {
            line.forEach(cell => cell.classList.remove(...this.getTetroStyles(cell)))
        })
        let [x0, y0] = size < 3 ? [1, 1] : [0, 0]
        tetroPoints.forEach(point => {
            let [x, y] = point
            const cell = this.nextTetro[y0 + y][x0 + x]
            cell.classList.add(`tetro-${typeId}`)
        })
    }

    updateField(fieldImage: Array<Array<string | null>>): void {
        for (let y = 0; y < this.maxY; y++) {
            for (let x = 0; x < this.maxX; x++) {
                const value = fieldImage[y][x]
                const cell = this.field[y][x]
                const tetroStyles = this.getTetroStyles(cell)
                if (value === null && tetroStyles.length > 0) {
                    cell.classList.remove(...tetroStyles)
                } else {
                    cell.classList.remove(...tetroStyles);
                    cell.classList.add(`tetro-${value}`)
                }
            }
        }
    }

    removeLines(removeLines: number[]): Promise<void> {
        const promise = new Promise<void>((resolve) => {
            if (removeLines != undefined && removeLines.length > 0) {
                removeLines.forEach((y) => {
                    this.field[y].forEach((cell) => {
                        const tetroStyles = this.getTetroStyles(cell)
                        cell.classList.add('tetro-removed')
                    })
                })
                setTimeout(() => resolve(), 400)
            } else {
                resolve()
            }
        })
        return promise
    }
    onGameOver(): void {
        this.modalAria.style.display = 'grid'
        this.modalGameOver.style.display = 'block'
    }

    private getTetroStyles(elment: HTMLDivElement): string[] {
        const tetroStyles = new Array<string>()
        elment.classList.forEach((c) => {
            if (c.startsWith('tetro-'))
                tetroStyles.push(c)
        })
        return tetroStyles
    }
}

export default Scene