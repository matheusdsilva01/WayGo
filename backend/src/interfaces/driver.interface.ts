export interface Driver {
    id: number
    name: string
    description: string
    vehicle: string
    review: {
        rating: number
        comment: string
    }
    value: number
    createdAt: Date
    kmMin: number
}

export interface DriverRepository {
    list(): Promise<Driver[]>
    listByKmMin(kmMin: number): Promise<Driver[]>
    findById(id: number): Promise<Driver>
}