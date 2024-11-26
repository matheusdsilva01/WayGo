import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/api"
import { Driver } from "@/types/entities/Driver"

export interface CreateEstimateRideParams {
  origin: string
  destination: string
  customer_id: string
}

export interface CreateEstimateRideResponse {
  origin: {
    latitude: number
    longitude: number
  }
  destination: {
    latitude: number
    longitude: number
  }
  distanceMeters: number
  distance: string
  duration: string
  options: Driver[]
  routeResponse: {
    routes: {
      distanceMeters: number
      duration: string
      legs: [
        {
          startLocation: {
            latLng: {
              latitude: number
              longitude: number
            }
          }
          endLocation: {
            latLng: {
              latitude: number
              longitude: number
            }
          }
        },
      ]
      localizedValues: {
        distance: {
          text: string
        }
        duration: {
          text: string
        }
        staticDuration: {
          text: string
        }
      }
    }[]
  }
}
export interface CreateEstimateRideCache extends CreateEstimateRideResponse {
  address: {
    origin: string
    destination: string
  }
}

export function useCreateEstimateRide() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ["estimate-ride"],
    onSuccess: (data, variables) => {
      queryClient.setQueryData(["estimate-ride", variables.customer_id], {
        address: {
          origin: variables.origin,
          destination: variables.destination,
        },
        ...data,
      })
    },
    mutationFn: async (params: CreateEstimateRideParams) => {
      const response = await api.post<CreateEstimateRideResponse>(
        "/ride/estimate",
        params,
      )
      return response.data
    },
  })
}