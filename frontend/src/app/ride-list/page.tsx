"use client"

import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import dayjs from "dayjs"
import { LoaderCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button, Input } from "@/components/common"
import { useGetDriverList, useGetRideListMutation } from "@/hooks/requests"
import { formatCurrency, formatDistance } from "@/util"

interface pageProps {
  searchParams: {
    customer_id?: string
  }
}

const schema = z.object({
  driver_id: z.number().optional(),
  customer_id: z.string().min(1),
})

type schemaType = z.infer<typeof schema>

const page = (props: pageProps) => {
  const { register, handleSubmit, setValue } = useForm<schemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      customer_id: props.searchParams.customer_id,
    },
  })

  const { data: driverList } = useGetDriverList()
  const {
    data: rideList,
    mutate,
    isPending,
    error,
    isError,
  } = useGetRideListMutation()

  async function onSubmit(data: schemaType) {
    mutate({
      customer_id: data.customer_id,
      driver_id: data.driver_id || undefined,
    })
  }

  useEffect(() => {
    if (props.searchParams.customer_id) {
      setValue("customer_id", props.searchParams.customer_id)
      mutate({
        customer_id: props.searchParams.customer_id,
      })
    }
  }, [])

  return (
    <div className="m-auto w-full max-w-7xl px-1 py-6 md:px-8">
      <h1 className="mb-4 text-center text-2xl font-bold text-primary">
        Histórico de viagens
      </h1>
      <section className="rounded-md border border-zinc-500 bg-zinc-950  p-4 md:p-6">
        <h3 className="text-lg font-semibold">Filtros</h3>
        <p className="text-sm text-zinc-400">
          Informe o ID do cliente para buscar as viagens, você também pode
          filtrar por um motorista específico
        </p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-4 flex w-full flex-col gap-4 sm:flex-row"
        >
          <Input
            className="h-full"
            fullWidth
            placeholder="ID do cliente"
            {...register("customer_id")}
          />
          <select
            defaultValue={0}
            className="w-full rounded-md border border-zinc-800 bg-transparent px-5 py-3 text-white outline-none transition-all hover:border-zinc-600 focus:border-primary active:border-primary"
            {...register("driver_id", {
              valueAsNumber: true,
              required: false,
            })}
          >
            <option value={0} className="bg-zinc-700">
              Todos
            </option>
            {driverList?.map(driver => (
              <option key={driver.id} value={driver.id} className="bg-zinc-700">
                {driver.name}
              </option>
            ))}
          </select>
          <Button type="submit" fullWidth>
            Buscar
          </Button>
        </form>
      </section>
      <section className="mt-6 overflow-auto rounded-md border border-zinc-500 bg-zinc-950 p-6 text-sm md:mt-14">
        {isPending && (
          <LoaderCircle className="m-auto animate-spin" size={32} />
        )}
        {!rideList?.length && !isPending && (
          <p className="text-center text-lg font-semibold">
            {isError
              ? error.message
              : "Digite um ID de usuário para buscar viagens"}
          </p>
        )}
        {rideList?.length && (
          <table className="w-full table-auto border-collapse rounded-md">
            <thead className="text-zinc-300">
              <tr>
                <th className="border-b border-zinc-500 p-4 pb-3 pl-12 pt-0 text-left font-medium">
                  Data e hora
                </th>
                <th className="border-b border-zinc-500 p-4 pb-3 pt-0 text-left font-medium">
                  Motorista
                </th>
                <th className="border-b border-zinc-500 p-4 pb-3 pt-0 text-left font-medium">
                  Destino
                </th>
                <th className="border-b border-zinc-500 p-4 pb-3 pt-0 text-left font-medium">
                  Distancia
                </th>
                <th className="border-b border-zinc-500 p-4 pb-3 pt-0 text-left font-medium">
                  Duração
                </th>
                <th className="border-b border-zinc-500 p-4 pb-3 pr-12 pt-0 text-left font-medium">
                  Valor
                </th>
              </tr>
            </thead>
            <tbody className="bg-zinc-900">
              {rideList?.map(ride => (
                <tr key={ride.id}>
                  <td className="whitespace-nowrap border-b border-zinc-500 p-4 pl-8">
                    {dayjs(ride.createdAt).format("DD/MM/YYYY HH:mm")}
                  </td>
                  <td className="border-b border-zinc-500 p-4">
                    {ride.driver.name}
                  </td>
                  <td className="border-b border-zinc-500 p-4">
                    {ride.destination}
                  </td>
                  <td className="border-b border-zinc-500 p-4">
                    {formatDistance(ride.distance / 1000)}
                  </td>
                  <td className="whitespace-nowrap border-b border-zinc-500 p-4">
                    {ride.duration}
                  </td>
                  <td className="border-b border-zinc-500 p-4 pr-8">
                    {formatCurrency(ride.value)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  )
}

export default page
