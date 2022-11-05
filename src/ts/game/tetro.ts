/**
 * Class for Tetromino - is a geometric shape 
 * @link https://en.wikipedia.org/wiki/Tetromino
 */
class Tetro {
    readonly typeId: string
    readonly shape: number[][]
    readonly points: Array<[number, number]>
    readonly shapeImage: Array<Array<string | null>>
    readonly size: number

    constructor(typeId: string, shape: number[][]) {
        this.typeId = typeId
        this.shape = shape;
        this.points = new Array()
        this.size = shape.length
        this.shapeImage = new Array<Array<string | null>>()
        for (let y = 0; y < this.size; y++) {
            let line = new Array<string | null>()
            for (let x = 0; x < this.size; x++) {
                if (this.shape[y][x] === 1) {
                    this.points.push([x, y])
                    line.push(this.typeId)
                } else {
                    line.push(null)
                }
            }
            this.shapeImage.push(line)
        }
    }

    getRotated(): Tetro {
        const shapeRotated = new Array<Array<number>>(this.size)

        for (let y = 0; y < shapeRotated.length; y++) {
            shapeRotated[y] = new Array<number>(this.size)
        }

        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                shapeRotated[x][this.size - 1 - y] = this.shape[y][x]
            }
        }

        return new Tetro(this.typeId, shapeRotated)
    }

    static readonly T: Tetro = new Tetro("t",
        [
            [1, 1, 1],
            [0, 1, 0],
            [0, 0, 0],
        ]
    )

    static readonly I: Tetro = new Tetro("i",
        [
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
        ]
    )

    static readonly I2: Tetro = new Tetro("i2",
        [
            [0, 1, 0],
            [0, 1, 0],
            [0, 1, 0],
        ]
    )

    static readonly I3: Tetro = new Tetro("i3",
        [
            [0, 1],
            [0, 1],
        ]
    )
    static readonly L: Tetro = new Tetro("l",
        [
            [0, 1, 0],
            [0, 1, 0],
            [0, 1, 1],

        ]
    )

    static readonly L2: Tetro = new Tetro("l2",
        [
            [0, 1, 0],
            [0, 1, 0],
            [1, 1, 0],
        ]
    )
    static readonly L3: Tetro = new Tetro("l3",
        [
            [1, 0],
            [1, 1],
        ]
    )

    static readonly L4: Tetro = new Tetro("l4",
        [
            [0, 1],
            [1, 1],
        ]
    )
    static readonly Z: Tetro = new Tetro("z",
        [
            [0, 1, 1],
            [1, 1, 0],
            [0, 0, 0],
        ]
    )

    static readonly Z2: Tetro = new Tetro("z2",
        [
            [1, 1, 0],
            [0, 1, 1],
            [0, 0, 0],
        ]
    )

    static readonly O: Tetro = new Tetro("o",
        [
            [1, 1],
            [1, 1],
        ]
    )

    static readonly O2: Tetro = new Tetro("o2",
        [
            [1]
        ]
    )

    static readonly List: Tetro[] = [this.I, this.I2, this.I3, this.L, this.L2, this.L3, this.L4, this.O, this.O2, this.T, this.Z, this.Z2]

    static randome(): Tetro {
        const n = Math.floor(Math.random() * this.List.length);
        let tetro = this.List[n]
        const countRotations = Math.floor(Math.random() * 4);
        for (let i = 0; i < countRotations; i++) {
            tetro = tetro.getRotated();
        }
        return tetro
    }
}

export default Tetro