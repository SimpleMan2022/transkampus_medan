"use client"

import { Marker, Popup } from "react-leaflet"
import L from "leaflet"
import { CampusIcon, getStationIcon } from "./map-icons"

interface NearestLocationMarkerProps {
  location: any
  type: "campus" | "station"
}

export function NearestLocationMarker({ location, type }: NearestLocationMarkerProps) {
  if (!location || !location.geom) return null

  const position: [number, number] = [location.geom.coordinates[1], location.geom.coordinates[0]]

  const icon = type === "campus" ? CampusIcon : getStationIcon(location.tipe || "halte")

  // Create a custom icon with a highlight
  const highlightedIcon = L.divIcon({
    html: `
      <div class="relative">
        <div class="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-75"></div>
        ${
          icon.options.iconSize && Array.isArray(icon.options.iconSize)
            ? `<img src="${icon.options.iconUrl}" class="relative z-10" style="width: ${icon.options.iconSize[0]}px; height: ${icon.options.iconSize[1]}px;" />`
            : ""
        }
      </div>
    `,
    className: "nearest-location-marker",
    iconSize: icon.options.iconSize,
    iconAnchor: icon.options.iconAnchor,
  })

  return (
    <Marker position={position} icon={highlightedIcon}>
      <Popup>
        <div className="p-1">
          <h3 className="font-bold text-base">{location.nama}</h3>
          {type === "campus" ? (
            <>
              <p className="text-sm text-gray-600">{location.alamat}</p>
              <div className="mt-2 text-xs">
                <p>
                  <span className="font-semibold">Website:</span>{" "}
                  <a
                    href={location.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {location.website}
                  </a>
                </p>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-600">{location.tipe}</p>
              <div className="mt-2 text-xs">
                <p>
                  <span className="font-semibold">Jam Operasional:</span> {location.jam_operasional}
                </p>
              </div>
            </>
          )}
          <p className="text-xs mt-1 font-medium text-emerald-600">Jarak: {location.jarak.toFixed(2)} km</p>
        </div>
      </Popup>
    </Marker>
  )
}
