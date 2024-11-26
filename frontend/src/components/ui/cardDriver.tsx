"use client"

import React from "react"
import { Car, LoaderCircle } from "lucide-react"
import { Driver } from "@/types/entities/Driver"
import { formatCurrency } from "@/util"
import { Button } from "../common"

interface CardDriverProps {
  driver: Driver
  distanceRide: number
  loading: boolean
  handleCreateRide: () => void
}

export const CardDriver = ({
  driver,
  distanceRide,
  loading,
  handleCreateRide,
}: CardDriverProps) => {
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
              Math.round(Number(distanceRide) / 1000) * driver.value,
            )}
          </p>
        </div>
      </div>
      <p className="mb-6 mt-4 text-sm text-zinc-200">{driver.description}</p>
      <Button
        disabled={loading}
        color="primary"
        fullWidth
        size="sm"
        onClick={handleCreateRide}
      >
        Confirmar motorista
      </Button>
    </div>
  )
}
