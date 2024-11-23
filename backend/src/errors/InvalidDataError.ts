export class InvalidDataError extends Error {
    constructor(error: string) {
        super(error || 'Invalid data')
        this.name = 'INVALID_DATA'
    }
}
  