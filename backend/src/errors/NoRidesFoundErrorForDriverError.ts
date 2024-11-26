export class NoRidesFoundForDriverError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'NO_RIDES_FOUND_FOR_DRIVER'
    }
}