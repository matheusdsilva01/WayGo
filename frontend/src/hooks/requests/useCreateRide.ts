import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/api"

export interface CreateRideData {
  customer_id: string
  origin: string
  destination: string
  distance: number
  duration: string
  driver_id: number
  value: number
}

export function useCreateRide() {
  const queryCLient = useQueryClient()

  return useMutation({
    mutationKey: ["confirm-ride"],
    onSuccess(_, variables) {
      queryCLient.invalidateQueries({
        queryKey: ["estimate-ride", variables.customer_id],
      })
    },
    mutationFn: async (data: CreateRideData) => {
      const response = await api.post("/ride/confirm", data)
      return response.data
    },
  })
}
