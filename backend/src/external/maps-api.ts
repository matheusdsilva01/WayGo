import axios from 'axios'

export const mapsApi = axios.create({
    baseURL: 'https://routes.googleapis.com/directions/v2:computeRoutes',
    headers: {
        'X-Goog-Api-Key': process.env.GOOGLE_API_KEY,
        'X-Goog-FieldMask': 'routes'
    }
})
