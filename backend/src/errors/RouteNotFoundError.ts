export class RouteNotFound extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'ROUTE_NOT_FOUND'
    }
}