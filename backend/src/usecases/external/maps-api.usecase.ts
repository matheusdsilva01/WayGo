import { getRouteBody, getRouteResponse, mapsApiRepository } from 'interfaces/external'
import { MapsApiRepository } from 'repositories/external'

export class MapsApiUseCase {
    private mapsApiRepository: mapsApiRepository

    constructor() {
        this.mapsApiRepository = new MapsApiRepository()
    }

    async getRoutePath(body: getRouteBody): Promise<getRouteResponse> {
        return await this.mapsApiRepository.getRoutePath(body)
    }
}