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
    driver_id: number
    value: number
}

export interface RideEstimateBody {
    customer_id: number
    origin: string
    destination: string
}

export interface RideRepository {
    create(ride: RideCreateBody): Promise<Ride>
    list(customer_id: string, driver_id?: number): Promise<Ride[]>
}