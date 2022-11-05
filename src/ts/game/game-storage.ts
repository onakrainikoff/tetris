/**
 * Interface for GameStorage, 
 * the main purpose of which is permanent storing of game data
 */
interface GameStorage {
    getBestScore(): number
    setBestScore(score: number):void
}

export default GameStorage