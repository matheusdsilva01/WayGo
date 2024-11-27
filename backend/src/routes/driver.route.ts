import { FastifyInstance } from 'fastify'
import { DriverUseCase } from 'usecases/driver.usecase'

export async function driverRoutes(server: FastifyInstance) {
    const driverUseCase = new DriverUseCase()

    server.get('/drivers', async (_, res) => {
        try {
            const drivers = await driverUseCase.list()

            res.send(drivers)
        } catch (error) {
            if (error instanceof Error) {
                return res.status(400).send({
                    error_code: error.name,
                    error_description: error.message
                })
            }

            return res.status(400).send({
                error_code: 'SOMETHING_WENT_WRONG',
                error_description: 'An unexpected error occurred'
            })
        }
    })
}
