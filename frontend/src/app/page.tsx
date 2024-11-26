"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { APIProvider } from "@vis.gl/react-google-maps"
import { AxiosError } from "axios"
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

const Home = () => {
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
      toast.success("Viagem pedida com sucesso")
      route.push(`/ride-options?customer_id=${data.customer_id}`)
    } catch (error) {
      if (error instanceof AxiosError) {
        return toast.error(error.response?.data.error_description)
      }
      toast.error("Erro ao pedir viagem")
    }
  }

  return (
    <div className="flex h-full w-full">
      <div className="m-auto mt-8 w-full max-w-lg rounded-md border border-zinc-500 bg-zinc-950 p-6 shadow">
        <h1 className="text-xl font-bold text-primary">Pedir uma viagem</h1>
        <p className="mb-4 text-sm text-gray-400">
          Para pedir uma viagem, preencha os campos abaixo.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            register={register("customer_id")}
            placeholder="User id"
            error={!!errors.customer_id}
          />
          <APIProvider
            apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string}
          >
            <PlaceAutocompleteClassic
              onPlaceSelect={e => {
                setValue("origin", e?.formatted_address as string, {
                  shouldDirty: true,
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
        </form>
      </div>
    </div>
  )
}

export default Home
