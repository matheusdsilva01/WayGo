import { FastifyInstance } from 'fastify'
import { DriverUseCase } from 'usecases/driver.usecase'

export async function driverRoutes(server: FastifyInstance) {
    const driverUseCase = new DriverUseCase()

    server.get<{ Params: { kmMin: number } }>('/drivers', async (req, res) => {
        const drivers = await driverUseCase.list()
        res.send(drivers)
    })
}
