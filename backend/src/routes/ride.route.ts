import { RideControllerImpl } from 'controller'
import { InvalidDataError } from 'errors'
import type { FastifyInstance } from 'fastify'
import { RideCreateBody, RideEstimateBody } from 'interfaces'
import { z } from 'zod'

export async function rideRoutes(server: FastifyInstance) {
    const rideController = new RideControllerImpl()

    server.post<{ Body: RideEstimateBody }>('/estimate', async (req, res) => {
        const schema = z.object({
            origin: z.string().min(1),
            destination: z.string().min(1),
            customer_id: z.string().min(1)
        })

        const body = schema.safeParse(req.body)
        
        try {
            if (!body.success) {
                throw new InvalidDataError('The data provided is invalid')
            }
    
            const { destination, origin } = body.data!

            if (destination === origin) {
                throw new InvalidDataError('The data provided is invalid')
            }
            const data = await rideController.estimate({ destination,
                origin })
            res.send(data)
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
        const schema = z.object({
            customer_id: z.string().min(1),
            origin: z.string().min(1),
            destination: z.string().min(1),
            distance: z.number().int().positive(),
            duration: z.string().min(1),
            driver: z.object({
                id: z.number().int().positive(),
                name: z.string().min(1)
            }),
            value: z.number().positive()
        })
        const body = schema.safeParse(req.body)

        try {
            if (!body.success) {
                throw new InvalidDataError('The data provided is invalid')
            }
            if (body.data!.origin === body.data!.destination) {
                throw new InvalidDataError('The origin and destination cannot be the same')
            }
            await rideController.confirm(body.data!)
            res.send({
                success: true
            })
        } catch (error) {
            if (error instanceof Error) {
                if (error.name === 'DRIVER_NOT_FOUND') {
                    return res.status(404).send({
                        error_code: 'DRIVER_NOT_FOUND',
                        error_description: 'Driver not found'
                    })
                }
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

            const rides = await rideController.list(params.data!)

            res.send(rides)
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
