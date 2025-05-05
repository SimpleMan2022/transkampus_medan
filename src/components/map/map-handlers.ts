"use client"

import { useEffect } from "react"
import { useMap, useMapEvents } from "react-leaflet"

// Component to handle map click events
export function MapClickHandler({
  onMapClick,
  isSelectingLocation,
}: {
  onMapClick?: (latlng: [number, number]) => void
  isSelectingLocation?: boolean
}) {
  const map = useMapEvents({
    
    click(e) {
      if (isSelectingLocation && onMapClick) {
        onMapClick([e.latlng.lat, e.latlng.lng])
      }
    },
  })

  // Change cursor when in selection mode
  useEffect(() => {
    if (isSelectingLocation) {
      document.getElementById("map")?.classList.add("selecting-location")
    } else {
      document.getElementById("map")?.classList.remove("selecting-location")
    }
  }, [isSelectingLocation])

  return null
}

// Function to handle map events like resize when in fullscreen
export function MapEventHandler() {
  const map = useMap()

  useEffect(() => {
    const handleResize = () => {
      map.invalidateSize()
    }

    window.addEventListener("resize", handleResize)
    document.addEventListener("fullscreenchange", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      document.removeEventListener("fullscreenchange", handleResize)
    }
  }, [map])

  return null
}

// Menyimpan bounds di state eksternal (parent component)
export function MapBoundsHandler({
  onBoundsChange,
}: {
  onBoundsChange: (bounds: L.LatLngBounds) => void
}) {
  useMapEvents({
    moveend(e) {
      onBoundsChange(e.target.getBounds())
    },
    zoomend(e) {
      onBoundsChange(e.target.getBounds())
    },
  })

  return null
}
