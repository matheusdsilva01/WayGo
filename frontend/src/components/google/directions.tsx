"use client"
import { useEffect, useState } from "react"
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps"

interface DirectionsProps {
  origin:
    | {
        lat: number
        lng: number
      }
    | string
  destination:
    | {
        lat: number
        lng: number
      }
    | string
}

export function Directions({ origin, destination }: DirectionsProps) {
  const map = useMap()
  const routesLibrary = useMapsLibrary("routes")

  const [directionsService, setDirectionsService] =
    useState<google.maps.DirectionsService | null>(null)
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer | null>(null)

  useEffect(() => {
    if (!routesLibrary || !map) return
    setDirectionsService(new google.maps.DirectionsService())
    setDirectionsRenderer(
      new google.maps.DirectionsRenderer({
        map,
      }),
    )
  }, [map, routesLibrary])

  useEffect(() => {
    if (!directionsService || !directionsRenderer) return
    directionsService.route(
      {
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          directionsRenderer.setDirections(result)
        }
      },
    )
  }, [directionsService, directionsRenderer])

  return null
}
