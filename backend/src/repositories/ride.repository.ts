import { prisma } from 'database/prisma-client'
import { NoRidesFoundError } from 'errors/NoRidesFoundError'
import { NoRidesFoundForDriverError } from 'errors/NoRidesFoundErrorForDriverError'
import { Ride, RideCreateBody, RideRepository } from 'interfaces/ride.interface'

export class RideRepositoryPrisma implements RideRepository {
    async create(ride: RideCreateBody): Promise<Ride> {
        const data = await prisma.ride.create({
            data: ride
        })
        return data
    }

    async list(customer_id: string, driver_id?: number): Promise<Ride[]> {
        const data = await prisma.ride.findMany({
            where: {
                customer_id,
                driver_id
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                driver: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        })
        if (!data.length && driver_id) {
            throw new NoRidesFoundForDriverError('No rides found for this driver')
        }
        if (!data.length) {
            throw new NoRidesFoundError('No rides found')
        }
        return data
    }
}