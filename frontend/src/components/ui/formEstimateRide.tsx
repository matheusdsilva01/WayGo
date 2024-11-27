"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { APIProvider } from "@vis.gl/react-google-maps"
import { LoaderCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { z } from "zod"
import { Button, Input } from "@/components/common"
import { PlaceAutocompleteClassic } from "@/components/google/autocomplete"
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
            <PlaceAutocompleteClassic
              onPlaceSelect={e => {
                setValue("origin", e?.formatted_address as string, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }}
            >
              {ref => (
                <Input placeholder="Origem" error={!!errors.origin} ref={ref} />
              )}
            </PlaceAutocompleteClassic>
            <PlaceAutocompleteClassic
              onPlaceSelect={e => {
                setValue("destination", e?.formatted_address as string, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }}
            >
              {ref => (
                <Input
                  ref={ref}
                  placeholder="Destino"
                  error={!!errors.destination}
                />
              )}
            </PlaceAutocompleteClassic>
          </APIProvider>
          <Button type="submit" color="primary">
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
