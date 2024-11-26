import { useRef, useEffect, useState, ReactNode, RefObject } from "react"
import { useMapsLibrary } from "@vis.gl/react-google-maps"

interface Props {
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void
  children: (ref: RefObject<HTMLInputElement>) => ReactNode
}

export const PlaceAutocompleteClassic = ({
  onPlaceSelect,
  children,
}: Props) => {
  const [placeAutocomplete, setPlaceAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const places = useMapsLibrary("places")

  useEffect(() => {
    if (!places || !inputRef.current) return

    const options = {
      fields: ["geometry", "name", "formatted_address"],
    }

    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options))
  }, [places])

  useEffect(() => {
    if (!placeAutocomplete) return

    placeAutocomplete.addListener("place_changed", () => {
      onPlaceSelect(placeAutocomplete.getPlace())
    })
  }, [onPlaceSelect, placeAutocomplete])

  return children(inputRef)
}
