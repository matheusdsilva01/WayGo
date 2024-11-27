"use client"
import { useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { APIProvider, Map } from "@vis.gl/react-google-maps"
import { LoaderCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { Directions } from "@/components/google"
import { CardDriver } from "@/components/ui"
import { CreateEstimateRideCache } from "@/hooks/requests"

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
      <div className="m-auto mt-6 w-full max-w-[656px] p-2 md:p-0">
        <h1 className="mb-4 text-xl font-bold text-primary md:text-2xl">
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
          {data?.options.length ? (
            data?.options?.map(driver => (
              <CardDriver
                key={driver.id}
                driver={driver}
                rideData={{
                  distance: data.distance,
                  duration: data.duration,
                  customer_id,
                  destination: data.address.destination,
                  origin: data.address.origin,
                }}
              />
            ))
          ) : (
            <p className="text-center text-lg font-semibold text-gray-400">
              Nenhum motorista disponível para essa viagem
            </p>
          )}
        </section>
      </div>
    </div>
  )
}

export default page
