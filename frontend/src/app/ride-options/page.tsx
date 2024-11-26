"use client"
import { useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { APIProvider, Map } from "@vis.gl/react-google-maps"
import { AxiosError } from "axios"
import { LoaderCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import { Directions } from "@/components/google/directions"
import { CardDriver } from "@/components/ui"
import { CreateEstimateRideCache, useCreateRide } from "@/hooks/requests"

interface PageProps {
  searchParams: {
    customer_id: string
  }
}

const page = (params: PageProps) => {
  const { customer_id } = params.searchParams

  const router = useRouter()
  const { data, isFetched } = useQuery<CreateEstimateRideCache>({
    queryKey: ["estimate-ride", customer_id],
    retry: 1,
  })
  const { mutateAsync, isPending } = useCreateRide()
  function onCreateRide(driverId: number) {
    const driverSelected = data?.options?.find(
      driver => driver.id === driverId,
    )!
    const value =
      Math.round(Number(data!.distanceMeters) / 1000) * driverSelected.value
    try {
      mutateAsync({
        driver_id: driverId,
        distance: data!.distanceMeters,
        duration: data!.duration,
        customer_id,
        destination: data!.address.destination,
        origin: data!.address.origin,
        value,
      })
      toast.success("Viagem pedida com sucesso")
      router.push(`/ride-list?customer_id=${customer_id}`)
    } catch (error) {
      if (error instanceof AxiosError) {
        return toast.error(error.response?.data.error_description)
      }
      toast.error("Erro ao pedir viagem")
    }
  }

  useEffect(() => {
    if (!data && isFetched) {
      router.push("/")
    }
  }, [data, isFetched])

  if (!isFetched || !data) {
    return (
      <div className="flex h-full w-full">
        <div className="m-auto mt-6">
          <LoaderCircle className="m-auto animate-spin" size={64} />
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full w-full">
      <div className="m-auto mt-6 w-full max-w-[656px]">
        <h1 className="mb-4 text-2xl font-bold text-primary">
          Escolha um motorista para sua viagem
        </h1>
        <div className="h-80 w-full">
          <APIProvider
            apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string}
          >
            <Map
              defaultZoom={3}
              defaultCenter={{
                lat: -14.235004,
                lng: -51.92528,
              }}
            >
              <Directions
                origin={{
                  lat: data?.origin.latitude as number,
                  lng: data?.origin.longitude as number,
                }}
                destination={{
                  lat: data?.destination.latitude as number,
                  lng: data?.destination.longitude as number,
                }}
              />
            </Map>
          </APIProvider>
        </div>
        <section className="mt-4 flex flex-col items-center gap-6">
          {data?.options &&
            data?.options?.map(driver => (
              <CardDriver
                loading={isPending}
                key={driver.id}
                driver={driver}
                distanceRide={data.distanceMeters}
                handleCreateRide={() => onCreateRide(driver.id)}
              />
            ))}
        </section>
      </div>
    </div>
  )
}

export default page
