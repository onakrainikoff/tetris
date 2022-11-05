import Tetro from "./tetro"

/**
 * Class of GameField
 * the main purpose of which is to store game states and provide methods for changing them 
 */
class GameField {
    private maxX: number = 10
    private maxY: number = 20
    private centerX: number = 5
    private fieldStates: Array<Array<number>>
    private fieldImage: Array<Array<string | null>>
    private tetro: Tetro | null = null
    private nextTetro: Tetro | null = null
    private x0: number = 0
    private y0: number = 0

    constructor() {
        this.fieldStates = new Array<Array<number>>(this.maxY);
        this.fieldImage = new Array<Array<string>>(this.maxY);
        for (let y = 0; y < this.maxY; y++) {
            this.fieldStates[y] = new Array<number>(this.maxX).fill(0)
            this.fieldImage[y] = new Array<string | null>(this.maxX).fill(null);
        }
    }

    getFieldImage(): Array<Array<string | null>> {
        return this.fieldImage
    }

    getNextTero(): Tetro | null {
        return this.nextTetro
    }

    setNextTetro(): boolean {
        const tetro = this.nextTetro ?? Tetro.randome()
        const x0 = tetro.size < 3 ? this.centerX - 1 : this.centerX - 2
        const y0 = 0
        if (this.isIntersected(x0, y0, tetro)) {
            return false
        }
        this.tetro = tetro
        this.x0 = x0
        this.y0 = y0
        this.drow(this.x0, this.y0, this.tetro.points, FieldState.Active, this.tetro.typeId)
        this.nextTetro = Tetro.randome()
        return true
    }

    freezeTetro(): void {
        if (this.tetro !== null) {
            this.drow(this.x0, this.y0, this.tetro.points, FieldState.Frozen, this.tetro.typeId)
        }
    }

    rotateTetro(): void {
        if (this.tetro !== null) {
            let x0 = this.x0
            let y0 = this.y0
            const rotated = this.tetro.getRotated()
            const coordsX = this.getСoords(x0, y0, rotated.points).map((coords) => coords[0])
            const maxX = Math.max(...coordsX)
            const rebound = this.maxX - maxX - 1
            if (rebound < 0) {
                x0 += rebound
            }
            if (this.isIntersected(x0, y0, rotated)) {
                return
            }
            this.drow(this.x0, this.y0, this.tetro.points, FieldState.Empty, null)
            this.x0 = x0
            this.y0 = y0
            this.tetro = rotated
            this.drow(this.x0, this.y0, this.tetro.points, FieldState.Active, this.tetro.typeId)
        }
    }

    moveTetroDown(): boolean {
        return this.moveTetro(this.x0, this.y0 + 1)
    }

    moveTetroLeft(): void {
        this.moveTetro(this.x0 - 1, this.y0)
    }

    moveTetroRight(): void {
        this.moveTetro(this.x0 + 1, this.y0)
    }

    removeFilledLines(): number[] {
        const filled: number[] = []
        for (let y = 0; y < this.maxY; y++) {
            if (this.fieldStates[y].every((cell) => cell === FieldState.Frozen)) {
                filled.push(y)
            }
        }
        filled.forEach((y) => {
            this.fieldStates.splice(y, 1)
            this.fieldImage.splice(y, 1)
            this.fieldStates.unshift(new Array<number>(this.maxX).fill(0))
            this.fieldImage.unshift(new Array<string | null>(this.maxX).fill(null))
        })
        return filled
    }

    private moveTetro(x0: number, y0: number): boolean {
        if (this.tetro === null) {
            return false
        }
        if (this.isIntersected(x0, y0, this.tetro)) {
            return false
        }
        this.drow(this.x0, this.y0, this.tetro.points, FieldState.Empty, null)
        this.x0 = x0
        this.y0 = y0
        this.drow(this.x0, this.y0, this.tetro.points, FieldState.Active, this.tetro.typeId)
        return true
    }

    private isIntersected(x0: number, y0: number, tetro: Tetro): boolean {
        return this.getСoords(x0, y0, tetro.points)
            .some((coords) => {
                const [x, y] = coords
                return x < 0 || x >= this.maxX ||
                    y < 0 || y >= this.maxY ||
                    this.fieldStates[y][x] === FieldState.Frozen
            })
    }

    private drow(x0: number, y0: number, points: Array<[number, number]>, state: FieldState, typeId: string | null): void {
        this.getСoords(x0, y0, points)
            .forEach((point) => {
                const [x, y] = point
                this.fieldStates[y][x] = state
                this.fieldImage[y][x] = typeId
            })
    }

    private getСoords(x0: number, y0: number, points: Array<[number, number]>,): Array<[number, number]> {
        return points.map((point) => {
            const [x, y] = point
            return [x0 + x, y0 + y]
        })
    }

}

enum FieldState {
    Empty,
    Active,
    Frozen
}

export default GameField