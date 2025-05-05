"use client"

import { useEffect, useRef } from "react"
import { useMap } from "react-leaflet"
import L from "leaflet"

interface NearestRoutesDisplayProps {
  routes: any[] | null
  campusId?: number | null
}

export function NearestRoutesDisplay({ routes, campusId }: NearestRoutesDisplayProps) {
  const map = useMap()
  const routeLayersRef = useRef<L.LayerGroup | null>(null)

  useEffect(() => {
    // Clear existing route layers
    if (routeLayersRef.current) {
      map.removeLayer(routeLayersRef.current)
      routeLayersRef.current = null
    }

    if (!routes || routes.length === 0) return

    // Create a new layer group for the routes
    routeLayersRef.current = L.layerGroup().addTo(map)

    // Parse the closest point for each route
    routes.forEach((route) => {
      if (!route.titik_terdekat) return

      // Extract coordinates from the WKT format "POINT(lng lat)"
      const match = route.titik_terdekat.match(/POINT$$([^ ]+) ([^)]+)$$/)
      if (!match) return

      const lng = Number.parseFloat(match[1])
      const lat = Number.parseFloat(match[2])

      // Create a marker for the closest point
      const marker = L.circleMarker([lat, lng], {
        radius: 8,
        color: "#fff",
        weight: 2,
        fillColor: route.warna || "#3b82f6",
        fillOpacity: 1,
        className: "nearest-route-point",
      }).bindPopup(`
        <div class="p-1">
          <h3 class="font-bold text-base">Titik Terdekat</h3>
          <p class="text-sm text-gray-600">Rute: ${route.nama}</p>
          <p class="text-xs mt-1">
            <span class="font-medium">Jarak:</span> ${route.jarak_terbaca}
          </p>
        </div>
      `)

      // Add a pulsing effect
      const pulseIcon = L.divIcon({
        className: "highlight-marker",
        html: `
          <div class="relative">
            <div class="absolute inset-0 animate-ping rounded-full bg-${route.warna.replace("#", "")} opacity-75" style="background-color: ${route.warna}"></div>
            <div class="relative rounded-full h-6 w-6 bg-${route.warna.replace("#", "")} opacity-50" style="background-color: ${route.warna}"></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      })

      const pulseMarker = L.marker([lat, lng], { icon: pulseIcon })

      // Add to the layer group
      routeLayersRef.current?.addLayer(marker)
      routeLayersRef.current?.addLayer(pulseMarker)
    })

    // Fit map to show all markers if there are any
    if (routes.length > 0) {
      const bounds = L.latLngBounds(
        routes
          .filter((route) => route.titik_terdekat)
          .map((route) => {
            const match = route.titik_terdekat.match(/POINT\\(([^ ]+) ([^)]+)\\)/)
            if (!match) return null
            return [Number.parseFloat(match[2]), Number.parseFloat(match[1])] as [number, number]
          })
          .filter((coords): coords is [number, number] => coords !== null),
      )
      

      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50] })
      }
    }

    // Cleanup on unmount
    return () => {
      if (routeLayersRef.current) {
        map.removeLayer(routeLayersRef.current)
      }
    }
  }, [routes, map])

  return null
}
