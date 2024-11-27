import { RouteNotFound } from 'errors'
import { mapsApi } from 'external/maps-api'
import { getRouteBody, getRouteResponse, mapsApiRepository } from 'interfaces/external'

export class MapsApiRepository implements mapsApiRepository {
    async getRoutePath(body: getRouteBody): Promise<getRouteResponse> {
        const { data } = await mapsApi.post('/', {
            origin: {
                address: body.origin
            },
            destination: {
                address: body.destination
            },
            languageCode: 'pt-BR',
            travelMode: 'DRIVE',
            units: 'metric'    
        })

        if (!data.routes || !data.routes[0].distanceMeters) {
            throw new RouteNotFound('Ride not found')
        }
        return data
    }
    
}