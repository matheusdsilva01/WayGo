import fastify from 'fastify'
import cors from '@fastify/cors'
import { rideRoutes, driverRoutes } from 'routes'
import dotenv from 'dotenv'


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

server.get('/', (_, res) => {
    res.send({ message: 'Hello World' })
})


server.listen({
    port: 8080,
    host: process.env.HOST || '0.0.0.0'
}, () => {
    console.log('Server listening at port 8080') 
    dotenv.config()
})