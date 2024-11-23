import { getRouteBody, getRouteResponse, mapsApiRepository } from 'interfaces/external/maps.interface'
import { MapsApiRepository } from 'repositories/external/maps-api.repository'

export class MapsApiUseCase {
    private mapsApiRepository: mapsApiRepository

    constructor() {
        this.mapsApiRepository = new MapsApiRepository()
    }

    async getRoutePath(body: getRouteBody): Promise<getRouteResponse> {
        return await this.mapsApiRepository.getRoutePath(body)
    }
}