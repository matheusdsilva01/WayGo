"use client"

import React from "react"
import { AxiosError } from "axios"
import { Car, LoaderCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import { useCreateRide } from "@/hooks/requests"
import { Driver } from "@/types/entities/Driver"
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

  function onCreateRide() {
    const value = Math.round(Number(rideData.distance) / 1000) * driver.value

    try {
      mutateAsync({
        driver_id: driverId,
        distance: rideData.distance,
        duration: rideData.duration,
        customer_id: rideData.customer_id,
        destination: rideData.destination,
        origin: rideData.origin,
        value,
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
          <div className="flex gap-2 text-sm text-zinc-300">
            <Car width={18} height={18} /> <p>{driver.vehicle}</p>
          </div>
          <p className="text-right text-lg font-bold text-primary">
            {formatCurrency(
              Math.round(Number(rideData.distance) / 1000) * driver.value,
            )}
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
          "Selecionar motorista"
        )}
      </Button>
    </div>
  )
}
