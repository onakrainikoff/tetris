import GameStorage from "../game/game-storage";

/**
 * Browser implementation of GameStorage
 */
class Storage implements GameStorage {

    constructor() {
        if (localStorage.bestScore === undefined) {
            localStorage.bestScore = 0
        }
    }

    getBestScore(): number {
        return localStorage.bestScore as number

    }
    setBestScore(score: number): void {
        localStorage.bestScore = score
    }
}

export default Storage