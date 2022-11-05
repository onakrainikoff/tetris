/**
 * Interface for GameScene, 
 * the main purpose of which is displaying the game
 */
interface GameScene {
    updateField(fieldImage: Array<Array<string | null>>): void
    removeLines(removeLines: number[]): Promise<void>
    updateLevel(level: number): void
    updateScore(score: number): void
    updateBestScore(score: number): void
    updateNextTetro(tetroPoints: Array<[number, number]>, typeId: string, size: number): void
    onGameOver(): void
}
export default GameScene