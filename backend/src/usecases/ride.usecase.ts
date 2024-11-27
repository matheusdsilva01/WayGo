import { Ride, RideCreateBody, RideRepository } from 'interfaces'
import { RideRepositoryPrisma } from 'repositories'

export class RideUseCase {
    private rideRepository: RideRepository

    constructor() {
        this.rideRepository = new RideRepositoryPrisma()
    }

    async create(ride: RideCreateBody): Promise<Ride> {
        return await this.rideRepository.create(ride) 
    }

    async list(customer_id: string, driver_id?: number): Promise<Ride[]> {
        return await this.rideRepository.list(customer_id, driver_id)
    }
}