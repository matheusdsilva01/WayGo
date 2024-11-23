import { prisma } from 'database/prisma-client'
import { DriverNotFoundError } from 'errors/DriverNotFoundError'
import { Driver, DriverRepository } from 'interfaces/driver.interface'

export class DriverRepositoryPrisma implements DriverRepository {

    async findById(id: number): Promise<Driver> {
        const driver = await prisma.driver.findUnique({
            where: { id }
        })
        if (!driver) {
            throw new DriverNotFoundError('Driver not found')
        }
        return {
            id: driver.id,
            name: driver.name,
            description: driver.description,
            vehicle: driver.vehicle,
            review: {
                rating: driver.rating,
                comment: driver.comment
            },
            value: driver.value,
            createdAt: driver.createdAt,
            kmMin: driver.kmMin
        }
    }

    async list(): Promise<Driver[]> {
        const data = await prisma.driver.findMany()
        const formattedDrivers = data.map((d) => ({
            id: d.id,
            name: d.name,
            description: d.description,
            vehicle: d.vehicle,
            review: {
                rating: d.rating,
                comment: d.comment
            },
            value: d.value,
            createdAt: d.createdAt,
            kmMin: d.kmMin
        }))
        return formattedDrivers
    
    }

    async listByKmMin(kmMin: number): Promise<Driver[]> {
        const data = await prisma.driver.findMany({
            where: {
                kmMin: {
                    lte: kmMin
                }
            },
            orderBy: {
                value: 'asc'
            }
        })
        const formattedDrivers = data.map((d) => ({
            id: d.id,
            name: d.name,
            description: d.description,
            vehicle: d.vehicle,
            review: {
                rating: d.rating,
                comment: d.comment
            },
            value: d.value,
            createdAt: d.createdAt,
            kmMin: d.kmMin
        }))
        return formattedDrivers
    }
}