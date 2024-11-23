import fastify from 'fastify'
import cors from '@fastify/cors'
import { rideRoutes } from './routes/ride'
import { driverRoutes } from 'routes/driver'

const server = fastify()

const corsOptions = {
    credentials: true,
    origin: '*'
}

server.register(cors, corsOptions)

server.register(rideRoutes, {
    prefix: '/ride'
})
server.register(driverRoutes)

server.get('/', () => {
    return { 
        message: 'Hello World'
    }
})


server.listen({
    port: 8080
}, () => {
    console.log('Server listening at port 8080') 
})