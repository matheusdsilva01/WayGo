import { Driver } from './driver.interface'

export interface Ride {
    id: number
    customer_id: string
    origin: string
    destination: string
    distance: number
    duration: string
    driver_id: number
    createdAt: Date
    value: number
}

export interface RideCreateBody {
    customer_id: string
    origin: string
    destination: string
    distance: number
    duration: string
    driver: {
        id: number
        name: string
    }
    value: number
}

export interface RideEstimateBody {
    customer_id: number
    origin: string
    destination: string
}

export interface RideEstimateResponse {
    origin: {
        latitude: number
        longitude: number
    }
    destination: {
        latitude: number
        longitude: number
    }
    distance: number
    duration: string
    options: Driver[]
    routeResponse: object
}

export interface RideListParams {
    customer_id: string
    driver_id?: number
}

export interface RideRepository {
    create(ride: RideCreateBody): Promise<Ride>
    list(customer_id: string, driver_id?: number): Promise<Ride[]>
}

export interface RideController {
    estimate({ destination, origin }: {
        destination: string
        origin: string
    }): Promise<RideEstimateResponse>
    confirm(body: RideCreateBody): Promise<void>
    list(params: RideListParams): Promise<Ride[]>
}