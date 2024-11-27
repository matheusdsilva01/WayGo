"use client"

import React from "react"
import { AxiosError } from "axios"
import { Car, LoaderCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import { useCreateRide } from "@/hooks/requests"
import { Driver } from "@/types/entities"
import { formatCurrency } from "@/util"
import { Button } from "../common"

interface CardDriverProps {
  driver: Driver
  rideData: {
    origin: string
    destination: string
    duration: string
    distance: number
    customer_id: string
  }
}

export const CardDriver = ({ driver, rideData }: CardDriverProps) => {
  const driverId = driver.id
  const router = useRouter()
  const { mutateAsync, isPending } = useCreateRide()

  async function onCreateRide() {

    try {
      await mutateAsync({
        driver: { id: driverId, name: driver.name },
        distance: rideData.distance,
        duration: rideData.duration,
        customer_id: rideData.customer_id,
        destination: rideData.destination,
        origin: rideData.origin,
        value: driver.value,
      })
      toast.success("Viagem pedida com sucesso")
      router.push(`/ride-list?customer_id=${rideData.customer_id}`)
    } catch (error) {
      if (error instanceof AxiosError) {
        return toast.error(error.response?.data.error_description)
      }
      toast.error("Erro ao pedir viagem")
    }
  }

  return (
    <div className="max-w-lg rounded-md border border-zinc-500 bg-zinc-950 p-4 shadow">
      <div className="flex justify-between">
        <div>
          <h2 className="text-xl font-semibold">{driver.name}</h2>
          <span className="text-xs text-zinc-500">
            Avaliação: {driver.review.rating}/5
          </span>
        </div>
        <div>
          <div className="flex gap-2 text-end text-xs text-zinc-300 md:text-sm">
            <Car width={18} height={18} className="hidden md:block" />{" "}
            <p>{driver.vehicle}</p>
          </div>
          <p className="text-right font-bold text-primary md:text-lg">
            {formatCurrency(driver.value)}
          </p>
        </div>
      </div>
      <p className="mb-6 mt-4 text-sm text-zinc-200">{driver.description}</p>
      <Button
        disabled={isPending}
        color="primary"
        fullWidth
        size="sm"
        onClick={() => onCreateRide()}
      >
        {isPending ? (
          <LoaderCircle className="m-auto animate-spin" />
        ) : (
          "Selecionar"
        )}
      </Button>
    </div>
  )
}
