import { InvalidDataError } from 'errors/InvalidDataError'
import { InvalidDistanceError } from 'errors/InvalidDistanceError'
import { FastifyInstance } from 'fastify'
import { RideCreateBody, RideEstimateBody } from 'interfaces/ride.interface'
import { DriverUseCase } from 'usecases/driver.usecase'
import { MapsApiUseCase } from 'usecases/external/maps-api.usecase'
import { RideUseCase } from 'usecases/ride.usecase'
import { z } from 'zod'

export async function rideRoutes(server: FastifyInstance) {
    server.post<{ Body: RideEstimateBody }>('/estimate', async (req, res) => {
        const schema = z.object({
            origin: z.string().min(1),
            destination: z.string().min(1),
            customer_id: z.string().min(1)
        })

        const body = schema.safeParse(req.body)
        if (!body.success) {
            return res.status(400).send({
                error_code: 'INVALID_DATA',
                error_description: 'The data provided is invalid'
            })
        }

        const { destination, origin } = body.data!

        const mapsApiUseCase = new MapsApiUseCase()
        const driverUseCase = new DriverUseCase()
        try {

            const routePath = await mapsApiUseCase.getRoutePath({
                destination,
                origin
            })
            const formattedRoutePath = {
                origin: routePath.routes[0].legs[0].startLocation.latLng,
                destination: routePath.routes[0].legs[0].endLocation.latLng,
                distanceMeters: routePath.routes[0].distanceMeters,
                distance: routePath.routes[0].localizedValues.distance.text,
                duration: routePath.routes[0].localizedValues.duration.text
            }

            const routeDistance = routePath.routes[0].distanceMeters
            const kmMin = Math.round(Number(routeDistance) / 1000)
            const drivers = await driverUseCase.listByKmMin(kmMin)

            res.send({
                ...formattedRoutePath,
                options: drivers,
                routeResponse: routePath
            })
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

    server.patch<{ Body: RideCreateBody }>('/confirm', async (req, res) => {
        const rideUseCase = new RideUseCase()
        const driverUseCase = new DriverUseCase()

        const schema = z.object({
            customer_id: z.string().min(1),
            origin: z.string().min(1),
            destination: z.string().min(1),
            distance: z.number().int().positive(),
            duration: z.string().min(1),
            driver_id: z.number().int().positive(),
            value: z.number().int().positive()
        })
        const body = schema.safeParse(req.body)

        try {
            if (!body.success) {
                throw new InvalidDataError('The data provided is invalid')
            }
            if (body.data!.origin === body.data!.destination) {
                throw new InvalidDataError('The origin and destination cannot be the same')
            }
            const driver = await driverUseCase.findById(body.data!.driver_id)
            if (Math.round(body.data!.distance / 1000) < driver.kmMin) {
                throw new InvalidDistanceError('The driver is not available for this route')
            }
            await rideUseCase.create(req.body)
            res.send({
                success: true
            })
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

    server.get<{
        Params: { customer_id: string }
        Querystring: { driver_id: string }
    }>('/:customer_id', async (req, res) => {
        const schema = z.object({
            customer_id: z.string().min(1),
            driver_id: z.coerce.number().int().positive().optional()
        })

        const params = schema.safeParse({
            customer_id: req.params.customer_id,
            driver_id: req.query.driver_id
        })
        try {
            if (!params.success) {
                throw new InvalidDataError('The data provided is invalid')
            }

            const { customer_id, driver_id } = params.data!
            const rideUseCase = new RideUseCase()
            const driverUseCase = new DriverUseCase()
            if (driver_id) {
                await driverUseCase.findById(driver_id)
            }
            const rides = await rideUseCase.list(customer_id, driver_id)
            return res.send(rides)
        } catch (error) {
            if (error instanceof Error) {
                if (error.name === 'DRIVER_NOT_FOUND') {
                    return res.status(400).send({
                        error_code: error.name,
                        error_description: 'The driver with the provided id was not found'
                    })
                }
                return res.status(404).send({
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
