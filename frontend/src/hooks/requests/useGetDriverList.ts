import { useQuery } from "@tanstack/react-query"
import { api } from "@/api"
import { Driver } from "@/types/entities/Driver"

export function useGetDriverList() {
  return useQuery({
    queryKey: ["drivers"],
    queryFn: async () => {
      {
        const response = await api.get<Driver[]>("/drivers")
        return response.data
      }
    },
  })
}
