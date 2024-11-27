import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/api"

export interface CreateRideData {
  customer_id: string
  origin: string
  destination: string
  distance: number
  duration: string
  driver: {
    id: number
    name: string
  }
  value: number
}

export function useCreateRide() {
  const queryCLient = useQueryClient()

  return useMutation({
    mutationKey: ["confirm-ride"],
    onSuccess(_, variables) {
      queryCLient.setQueryData(["rides", variables.customer_id], undefined)
    },
    mutationFn: async (data: CreateRideData) => {
      const response = await api.patch("/ride/confirm", data)
      return response.data
    },
  })
}
