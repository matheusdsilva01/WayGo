import { useMutation, useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { api } from "@/api"
import { Ride } from "@/types/entities/Ride"

export interface useGetRideListParams {
  customer_id: string
  driver_id?: number
}

const errors = new Map([
  ["NO_RIDES_FOUND", "Nenhuma viagem encontrada"],
  ["NO_RIDES_FOUND_FOR_DRIVER", "Nenhuma viagem encontrada para o motorista"],
])

export function useGetRideList({
  customer_id,
  driver_id,
}: useGetRideListParams) {
  return useQuery({
    queryKey: ["ride-list", customer_id, driver_id],
    queryFn: async ({ queryKey: [, customer_id] }) => {
      const response = await api.get<Ride[]>(`/ride/${customer_id}`, {
        params: {
          driver_id,
        },
      })
      return response.data
    },
    enabled: !!customer_id,
  })
}

export function useGetRideListMutation() {
  return useMutation({
    onError: error => {
      if (error instanceof AxiosError) {
        const message = errors.get(error.response?.data.error_code)
        if (message) {
          throw new Error(message)
        }
        throw new Error("Erro ao buscar viagens")
      }
    },
    mutationFn: async (data: useGetRideListParams) => {
      const response = await api.get<Ride[]>(
        `/ride/${data.customer_id}${
          data.driver_id ? `?driver_id=${data.driver_id}` : ""
        }`,
      )
      return response.data
    },
  })
}
