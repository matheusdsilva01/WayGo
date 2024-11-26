export interface Ride {
  id: string
  origin: string
  destination: string
  value: number
  duration: number
  distance: number
  driver: {
    id: string
    name: string
  }
  createdAt: string
}
