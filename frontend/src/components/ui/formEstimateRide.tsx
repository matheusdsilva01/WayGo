"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { APIProvider, Map } from "@vis.gl/react-google-maps"
import { LoaderCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { z } from "zod"
import { Button, Input } from "@/components/common"
import { PlaceAutocomplete } from "@/components/google"
import { useCreateEstimateRide } from "@/hooks/requests"

const schema = z.object({
  customer_id: z.string().min(1),
  origin: z.string().min(1),
  destination: z.string().min(1),
})

type schemaType = z.infer<typeof schema>

export const FormEstimateRide = () => {
  const route = useRouter()

  const { mutateAsync, isPending } = useCreateEstimateRide()
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<schemaType>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: schemaType) {
    try {
      await mutateAsync(data)
      route.push(`/ride-options?customer_id=${data.customer_id}`)
    } catch (error) {
      if (error instanceof Error) {
        return toast.error(error.message)
      }
      return toast.error("Erro ao pedir viagem")
    }
  }

  return (
    <>
      <p className="mb-4 text-sm text-zinc-300">
        Para pedir uma viagem, preencha os campos abaixo.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          register={register("customer_id")}
          placeholder="User id"
          error={!!errors.customer_id}
        />
        <div className="flex flex-col gap-2">
          <p className="text-zinc-400">
            Escolha o local de origem e destino da viagem
          </p>
          <APIProvider
            apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string}
          >
            <Map
              defaultZoom={3}
              defaultCenter={{ lat: -14.235004, lng: -51.92528 }}
            />
            <PlaceAutocomplete
              inputValue={watch("origin")}
              setInputValue={value =>
                setValue("origin", value, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
              onPlaceSelect={place => {
                setValue("origin", place?.formatted_address as string, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }}
            >
              <Input
                onKeyDown={event => {
                  if (event.key === "Enter") {
                    event.preventDefault()
                  }
                }}
                register={register("origin")}
                placeholder="Origem"
                error={!!errors.origin}
              />
            </PlaceAutocomplete>
            <PlaceAutocomplete
              onPlaceSelect={e => {
                setValue("destination", e?.formatted_address as string, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }}
              inputValue={watch("destination")}
              setInputValue={value =>
                setValue("destination", value, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
            >
              <Input
                onKeyDown={event => {
                  if (event.key === "Enter") {
                    event.preventDefault()
                  }
                }}
                register={register("destination")}
                placeholder="Destino"
                error={!!errors.destination}
              />
            </PlaceAutocomplete>
          </APIProvider>
          <Button type="submit" color="primary" disabled={isPending}>
            {isPending ? (
              <LoaderCircle className="m-auto animate-spin" />
            ) : (
              "Pedir viagem"
            )}
          </Button>
        </div>
      </form>
    </>
  )
}
