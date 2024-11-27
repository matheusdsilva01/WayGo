import { InvalidDataError, InvalidDistanceError } from 'errors'
import { Ride, RideController, RideCreateBody, RideEstimateResponse, RideListParams } from 'interfaces'
import { DriverUseCase, RideUseCase } from 'usecases'
import { MapsApiUseCase } from 'usecases/external'

export class RideControllerImpl implements RideController {
    async estimate({ destination, origin }: { destination: string
        origin: string }): Promise<RideEstimateResponse> {
        try {

            const mapsApiUseCase = new MapsApiUseCase()
            const driverUseCase = new DriverUseCase()
            
            const routePath = await mapsApiUseCase.getRoutePath({
                destination,
                origin
            })

            if (!routePath.routes.length || !routePath.routes[0].distanceMeters) {
                throw new InvalidDataError('No routes found')
            }

            const formattedRoutePath = {
                origin: routePath.routes[0].legs[0].startLocation.latLng,
                destination: routePath.routes[0].legs[0].endLocation.latLng,
                distance: routePath.routes[0].distanceMeters,
                duration: routePath.routes[0].localizedValues.duration.text
            }
        
            const routeDistance = routePath.routes[0].distanceMeters
            const kmMin = Math.round(Number(routeDistance) / 1000)
            const drivers = await driverUseCase.listByKmMin(kmMin)

            return {
                ...formattedRoutePath,
                options: drivers,
                routeResponse: routePath
            }
        } catch (error) {
            if (error instanceof Error) {
                throw error
            }
            throw new Error('An unexpected error occurred')
        }
    }

    async confirm(body: RideCreateBody): Promise<void> {
        const rideUseCase = new RideUseCase()
        const driverUseCase = new DriverUseCase()

        try {
            const driver = await driverUseCase.findById(body.driver.id)
            
            if (Math.round(body.distance / 1000) < driver.kmMin) {
                throw new InvalidDistanceError('The driver is not available for this route')
            }
            
            await rideUseCase.create({
                customer_id: body.customer_id,
                origin: body.origin,
                destination: body.destination,
                distance: body.distance,
                duration: body.duration,
                driver: body.driver,
                value: body.value
            })
        } catch (error) {
            if (error instanceof Error) {
                throw error
            }
            throw new Error('An unexpected error occurred')
        }
    }

    async list(params: RideListParams): Promise<Ride[]> {
        const { customer_id, driver_id } = params

        try {
            const rideUseCase = new RideUseCase()
            const driverUseCase = new DriverUseCase()

            if (driver_id) {
                await driverUseCase.findById(driver_id)
            }

            const rides = await rideUseCase.list(customer_id, driver_id)

            return rides
        } catch (error) {
            if (error instanceof Error) {
                throw error
            }
            throw new Error('An unexpected error occurred')
        }
    }

}
