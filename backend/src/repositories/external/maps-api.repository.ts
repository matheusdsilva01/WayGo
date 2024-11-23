import { mapsApi } from 'external/maps-api'
import { getRouteBody, getRouteResponse, mapsApiRepository } from 'interfaces/external/maps.interface'

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
        
        return data
    }
    
}