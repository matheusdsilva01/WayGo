export class DriverNotFoundError extends Error {
    constructor(error: string) {
        super(error || 'Driver not found')
        this.name = 'DRIVER_NOT_FOUND'
    }
}