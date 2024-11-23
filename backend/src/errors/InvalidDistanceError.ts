export class InvalidDistanceError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'INVALID_DISTANCE'
    }
}