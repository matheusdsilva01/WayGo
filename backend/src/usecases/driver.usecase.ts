import { Driver, DriverRepository } from 'interfaces/driver.interface'
import { DriverRepositoryPrisma } from 'repositories/driver.respository'

export class DriverUseCase {
    private DriverRepository: DriverRepository

    constructor() {
        this.DriverRepository = new DriverRepositoryPrisma()
    }

    async list(): Promise<Driver[]> {
        return await this.DriverRepository.list()
    }

    async listByKmMin(kmMin: number): Promise<Driver[]> {
        return await this.DriverRepository.listByKmMin(kmMin)
    }

    async findById(id: number): Promise<Driver> {
        return await this.DriverRepository.findById(id)
    }
}