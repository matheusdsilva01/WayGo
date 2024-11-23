export interface getRouteBody {
    origin: string
    destination: string
}

export interface getRouteResponse {
    routes: {
        distanceMeters: number
        duration: string
        legs: [
            {
                startLocation: {
                    latLng: {
                        latitude: number
                        longitude: number
                    }
                }
                endLocation: {
                    latLng: {
                        latitude: number
                        longitude: number
                    }
                }
            }
        ]
        localizedValues: {
            distance: {
                text: string
            }
            duration: {
                text: string
            }
            staticDuration: {
                text: string
            }
        }
    }[]
}

export interface mapsApiRepository {
    getRoutePath(body: getRouteBody): Promise<getRouteResponse>
}