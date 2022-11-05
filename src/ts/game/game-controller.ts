/**
 * Interface for GameController, 
 * the main purpose of which is senging of Game Actions from User
 */
interface GameController {
    setControllerActionListener(listener: (action: GameControllerAction)=> void): void
}

/**
 * Enum of Game Actions
 */
enum GameControllerAction {
    DOWN,
    LEFT,
    RIGHT,
    ROTATE,
    PAUSE,
    RESUME,
    NEW_GAME
}

export {GameController, GameControllerAction}