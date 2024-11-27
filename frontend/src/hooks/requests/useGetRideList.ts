import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { api } from "@/api"
import { Ride } from "@/types/entities"

export interface useGetRideListParams {
  customer_id: string
  driver_id?: number
}

const errors = new Map([
  ["NO_RIDES_FOUND", "Nenhuma viagem encontrada"],
  [
    "NO_RIDES_FOUND_FOR_DRIVER",
    "Nenhuma viagem encontrada para o motorista selecionado",
  ],
])

export function useGetRideListMutation() {
  return useMutation({
    onError: error => {
      if (error instanceof AxiosError) {
        const message = errors.get(error.response?.data.error_code)
        if (message) {
          return {
            error_code: error.response?.data.error_code,
            message,
          }
        }
      }
      return {
        error_code: "UNKNOWN_ERROR",
        message: "Não foi possível buscar as viagens",
      }
    },
    mutationFn: async (data: useGetRideListParams) => {
      try {
        const response = await api.get<Ride[]>(
          `/ride/${data.customer_id}${
            data.driver_id ? `?driver_id=${data.driver_id}` : ""
          }`,
        )
        return response.data
      } catch (error) {
        if (error instanceof AxiosError) {
          const message = errors.get(error.response?.data.error_code)
          if (message) {
            throw new Error(message)
          }
        }
        throw new Error("Não foi possível buscar as viagens")
      }
    },
  })
}
