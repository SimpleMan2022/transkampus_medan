"use client"

import { useEffect, useRef } from "react"
import { useMap } from "react-leaflet"
import L from "leaflet"
import type { CompleteRoute } from "./routing-service"

interface RouteDisplayProps {
  route: CompleteRoute | null
}

export function RouteDisplay({ route }: RouteDisplayProps) {
  const map = useMap()
  const routeLayerRef = useRef<L.LayerGroup | null>(null)

  useEffect(() => {
    // Clear existing route
    if (routeLayerRef.current) {
      map.removeLayer(routeLayerRef.current)
      routeLayerRef.current = null
    }

    if (!route) return

    // Create a new layer group for the route
    routeLayerRef.current = L.layerGroup().addTo(map)

    // Add each route segment
    route.segments.forEach((segment) => {
      // Create the polyline for the route segment
      const polyline = L.polyline(segment.path, {
        color: segment.color,
        weight: 5,
        opacity: 0.8,
        lineCap: "round",
        lineJoin: "round",
        className: "route-segment",
      }).bindPopup(`
        <div class="p-1">
          <h3 class="font-bold text-base">${segment.name}</h3>
          <p class="text-sm text-gray-600">${segment.type}</p>
          <div class="mt-2 text-xs grid grid-cols-2 gap-1">
            <p><span class="font-semibold">Jarak:</span> ${segment.distance.toFixed(2)} km</p>
            <p><span class="font-semibold">Waktu:</span> ${Math.round(segment.duration)} menit</p>
          </div>
        </div>
      `)

      // Add markers for start and end points
      const startMarker = L.circleMarker(segment.path[0], {
        radius: 8,
        color: "#fff",
        weight: 2,
        fillColor: segment.color,
        fillOpacity: 1,
      }).bindPopup("Titik Awal Rute")

      const endMarker = L.circleMarker(segment.path[segment.path.length - 1], {
        radius: 8,
        color: "#fff",
        weight: 2,
        fillColor: segment.color,
        fillOpacity: 1,
      }).bindPopup("Titik Akhir Rute")

      // Add to the layer group
      routeLayerRef.current?.addLayer(polyline)
      routeLayerRef.current?.addLayer(startMarker)
      routeLayerRef.current?.addLayer(endMarker)
    })

    // Fit map to the route bounds
    const bounds = L.latLngBounds([
      route.startLocation,
      route.endLocation,
      ...route.segments.flatMap((segment) => segment.path),
    ])
    map.fitBounds(bounds, { padding: [50, 50] })

    // Cleanup on unmount
    return () => {
      if (routeLayerRef.current) {
        map.removeLayer(routeLayerRef.current)
      }
    }
  }, [route, map])

  return null
}
