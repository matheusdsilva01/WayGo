export class NoRidesFoundError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'NO_RIDES_FOUND'
    }
}