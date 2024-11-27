import { ReactNode, useCallback, useEffect, useState } from "react"
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps"
import { MapPin } from "lucide-react"

interface PlaceAutocompleteProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void
  inputValue: string
  setInputValue: (value: string) => void
  children: ReactNode
}

export const PlaceAutocomplete = ({
  onPlaceSelect,
  inputValue,
  setInputValue,
  children,
}: PlaceAutocompleteProps) => {
  const map = useMap()
  const places = useMapsLibrary("places")

  const [sessionToken, setSessionToken] =
    useState<google.maps.places.AutocompleteSessionToken>()

  const [autocompleteService, setAutocompleteService] =
    useState<google.maps.places.AutocompleteService | null>(null)

  const [placesService, setPlacesService] =
    useState<google.maps.places.PlacesService | null>(null)

  const [predictionResults, setPredictionResults] = useState<
    Array<google.maps.places.AutocompletePrediction>
  >([])

  useEffect(() => {
    if (!places || !map) return

    setAutocompleteService(new places.AutocompleteService())
    setPlacesService(new places.PlacesService(map))
    setSessionToken(new places.AutocompleteSessionToken())

    return () => setAutocompleteService(null)
  }, [map, places])

  const fetchPredictions = useCallback(
    async (inputValue: string) => {
      if (!autocompleteService || !inputValue) {
        setPredictionResults([])
        return
      }

      const request = { input: inputValue, sessionToken }
      const response = await autocompleteService.getPlacePredictions(request)

      setPredictionResults(response.predictions)
    },
    [autocompleteService, sessionToken],
  )

  const handleSuggestionClick = useCallback(
    (placeId: string) => {
      if (!places) return

      const detailRequestOptions = {
        placeId,
        fields: ["geometry", "name", "formatted_address"],
        sessionToken,
      }

      const detailsRequestCallback = (
        placeDetails: google.maps.places.PlaceResult | null,
      ) => {
        onPlaceSelect(placeDetails)
        setPredictionResults([])
        setInputValue(placeDetails?.formatted_address ?? "")
        setSessionToken(new places.AutocompleteSessionToken())
      }

      placesService?.getDetails(detailRequestOptions, detailsRequestCallback)
    },
    [onPlaceSelect, places, placesService, sessionToken],
  )

  useEffect(() => {
    fetchPredictions(inputValue)
  }, [inputValue])

  return (
    <div className="group relative">
      {children}
      {predictionResults.length > 0 && (
        <ul className="absolute z-10 hidden h-auto w-full bg-white text-black group-focus-within:block group-focus:block">
          {predictionResults.map(({ place_id, description }) => {
            return (
              <li
                key={place_id}
                className="cursor-pointer truncate text-xs hover:bg-gray-100"
              >
                <button
                  type="button"
                  onClick={() => handleSuggestionClick(place_id)}
                  className="p-2"
                >
                  <MapPin size={16} className="mr-2 inline-block" />
                  {description}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
