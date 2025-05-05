"use client"

import { useEffect, useRef } from "react"
import { useMap } from "react-leaflet"
import L from "leaflet"
import type { CampusData, FacilityData, StationData, RouteData, KecamatanData } from "./types"
import { CampusIcon, FacilityIcon, getStationIcon, DefaultIcon } from "./map-icons"
import { getLatLngFromGeoJSON, processRouteGeometry, processPolygonGeometry } from "./map-utils"
import { createClusterGroups } from "./marker-cluster"

interface CampusLayerProps {
  campusData: CampusData[]
  visible: boolean
}

export function CampusLayer({ campusData, visible }: CampusLayerProps) {
  const map = useMap()
  const markersRef = useRef<L.Marker[]>([])

  useEffect(() => {
    // Clear existing markers
    markersRef.current.forEach((marker) => {
      if (map.hasLayer(marker)) {
        map.removeLayer(marker)
      }
    })
    markersRef.current = []

    if (!visible) return

    // Add individual markers to map
    campusData.forEach((campus) => {
      const position = getLatLngFromGeoJSON(campus.geom)
      const marker = L.marker(position, {
        icon: CampusIcon,
        zIndexOffset: 1000, // Higher z-index to ensure it's above kecamatan
      }).bindPopup(`
        <div class="p-1">
          <h3 class="font-bold text-base">${campus.nama}</h3>
          <p class="text-sm text-gray-600">${campus.alamat}</p>
          <div class="mt-2 text-xs">
            <p>
              <span class="font-semibold">Website:</span>
              <a href="${campus.website}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">
                ${campus.website}
              </a>
            </p>
            <p>
              <span class="font-semibold">Fakultas:</span> ${campus.jumlah_fakultas}
            </p>
            <p>
              <span class="font-semibold">Mahasiswa:</span> ${campus.jumlah_mahasiswa}
            </p>
          </div>
        </div>
      `)

      marker.addTo(map)
      markersRef.current.push(marker)
    })

    // Cleanup on unmount
    return () => {
      markersRef.current.forEach((marker) => {
        if (map.hasLayer(marker)) {
          map.removeLayer(marker)
        }
      })
    }
  }, [campusData, visible, map])

  return null
}

interface FacilityLayerProps {
  facilityData: FacilityData[]
  visible: boolean
}

export function FacilityLayer({ facilityData, visible }: FacilityLayerProps) {
  const map = useMap()
  const clusterRef = useRef<any>(null)

  useEffect(() => {
    if (!visible) {
      if (clusterRef.current) {
        map.removeLayer(clusterRef.current)
      }
      return
    }

    // Create cluster group if it doesn't exist
    if (!clusterRef.current) {
      const { facilityCluster } = createClusterGroups()
      clusterRef.current = facilityCluster
    }

    // Clear existing markers
    clusterRef.current.clearLayers()

    // Add markers to cluster
    facilityData.forEach((facility) => {
      const position = getLatLngFromGeoJSON(facility.geom)
      const marker = L.marker(position, {
        icon: FacilityIcon,
        zIndexOffset: 900, // Higher z-index to ensure it's above kecamatan
      }).bindPopup(`
        <div class="p-1">
          <h3 class="font-bold text-base">${facility.nama}</h3>
          <p class="text-sm text-gray-600">${facility.jenis}</p>
        </div>
      `)

      clusterRef.current.addLayer(marker)
    })

    // Add cluster to map
    map.addLayer(clusterRef.current)

    // Cleanup on unmount
    return () => {
      if (clusterRef.current) {
        map.removeLayer(clusterRef.current)
      }
    }
  }, [facilityData, visible, map])

  return null
}

interface StationLayerProps {
  stationData: StationData[]
  visible: boolean
}

export function StationLayer({ stationData, visible }: StationLayerProps) {
  const map = useMap()
  const markersRef = useRef<L.Marker[]>([])

  useEffect(() => {
    // Clear existing markers
    markersRef.current.forEach((marker) => {
      if (map.hasLayer(marker)) {
        map.removeLayer(marker)
      }
    })
    markersRef.current = []

    if (!visible) return

    // Add individual markers to map
    stationData.forEach((station) => {
      const position = getLatLngFromGeoJSON(station.geom)
      const marker = L.marker(position, {
        icon: getStationIcon(station.tipe),
        zIndexOffset: 800, // Higher z-index to ensure it's above kecamatan
      }).bindPopup(`
        <div class="p-1">
          <h3 class="font-bold text-base">${station.nama}</h3>
          <p class="text-sm text-gray-600">${station.tipe}</p>
        </div>
      `)

      marker.addTo(map)
      markersRef.current.push(marker)
    })

    // Cleanup on unmount
    return () => {
      markersRef.current.forEach((marker) => {
        if (map.hasLayer(marker)) {
          map.removeLayer(marker)
        }
      })
    }
  }, [stationData, visible, map])

  return null
}

interface RouteLayerProps {
  routeData: RouteData[]
  visible: boolean
}

export function RouteLayer({ routeData, visible }: RouteLayerProps) {
  const map = useMap()
  const routesRef = useRef<L.Polyline[]>([])

  useEffect(() => {
    // Clear existing routes
    routesRef.current.forEach((route) => {
      if (map.hasLayer(route)) {
        map.removeLayer(route)
      }
    })
    routesRef.current = []

    if (!visible) return

    // Add routes to map with higher z-index
    routeData.forEach((route) => {
      const routePaths = processRouteGeometry(route.geom)

      routePaths.forEach((path, index) => {
        const polyline = L.polyline(path, {
          color: route.warna || "#3b82f6",
          weight: 4,
          opacity: 0.7,
          // Set higher z-index to ensure routes are above kecamatan polygons
          pane: "overlayPane",
          // Make sure routes are interactive
          interactive: true,
          bubblingMouseEvents: false,
        }).bindPopup(`
          <div class="p-1">
            <h3 class="font-bold text-base">${route.nama}</h3>
            <p class="text-sm text-gray-600">
              Kode:(${route.jenis})${route.nomor_angkot && ` - No. ${route.nomor_angkot}`}
            </p>
          </div>
        `)

        polyline.addTo(map)
        routesRef.current.push(polyline)
      })
    })

    // Cleanup on unmount
    return () => {
      routesRef.current.forEach((route) => {
        if (map.hasLayer(route)) {
          map.removeLayer(route)
        }
      })
    }
  }, [routeData, visible, map])

  return null
}

interface KecamatanLayerProps {
  kecamatanData: KecamatanData[]
  visible: boolean
  isSelectingLocation?: boolean
}

// Update the KecamatanLayer component to accept and use the isSelectingLocation prop
export function KecamatanLayer({ kecamatanData, visible, isSelectingLocation = false }: KecamatanLayerProps) {
  const map = useMap()
  const polygonsRef = useRef<L.Polygon[]>([])

  useEffect(() => {
    // Clear existing polygons
    polygonsRef.current.forEach((polygon) => {
      if (map.hasLayer(polygon)) {
        map.removeLayer(polygon)
      }
    })
    polygonsRef.current = []

    if (!visible) return

    // Create a custom pane for kecamatan with lower z-index if it doesn't exist
    if (!map.getPane("kecamatanPane")) {
      map.createPane("kecamatanPane")
      // Set a lower z-index for the kecamatan pane (default overlayPane is 400)
      map.getPane("kecamatanPane")!.style.zIndex = "350"
    }

    // Add kecamatan polygons to map with lower z-index
    kecamatanData.forEach((kecamatan) => {
      const polygons = processPolygonGeometry(kecamatan.geom)

      if (kecamatan.geom.type === "Polygon") {
        const polygon = L.polygon(polygons as [number, number][][], {
          color: kecamatan.warna || "#6b7280",
          weight: 2,
          fillColor: kecamatan.warna || "#6b7280",
          fillOpacity: 0.1, // Reduced opacity to make it less prominent
          // Use the custom pane with lower z-index
          pane: "kecamatanPane",
          // Disable interaction when selecting location
          interactive: !isSelectingLocation,
          bubblingMouseEvents: isSelectingLocation,
        }).bindPopup(`
          <div class="p-1">
            <h3 class="font-bold text-base">Kecamatan ${kecamatan.nama}</h3>
            <div class="mt-2 text-xs grid grid-cols-2 gap-1">
              <p>
                <span class="font-semibold">Luas:</span> ${kecamatan.luas} km²
              </p>
              <p>
                <span class="font-semibold">Penduduk:</span> ${kecamatan.penduduk} jiwa
              </p>
              <p>
                <span class="font-semibold">Kepadatan:</span> ${kecamatan.kepadatan} jiwa/km²
              </p>
            </div>
          </div>
        `)

        polygon.addTo(map)
        polygonsRef.current.push(polygon)
      } else if (kecamatan.geom.type === "MultiPolygon") {
        ;(polygons as [number, number][][][]).forEach((polygon, index) => {
          const multiPolygon = L.polygon(polygon, {
            color: kecamatan.warna || "#6b7280",
            weight: 2,
            fillColor: kecamatan.warna || "#6b7280",
            fillOpacity: 0.1, // Reduced opacity to make it less prominent
            // Use the custom pane with lower z-index
            pane: "kecamatanPane",
            // Disable interaction when selecting location
            interactive: !isSelectingLocation,
            bubblingMouseEvents: isSelectingLocation,
          }).bindPopup(`
            <div class="p-1">
              <h3 class="font-bold text-base">Kecamatan ${kecamatan.nama}</h3>
              <div class="mt-2 text-xs grid grid-cols-2 gap-1">
                <p>
                  <span class="font-semibold">Luas:</span> ${kecamatan.luas} km²
                </p>
                <p>
                  <span class="font-semibold">Penduduk:</span> ${kecamatan.penduduk} jiwa
                </p>
                <p>
                  <span class="font-semibold">Kepadatan:</span> ${kecamatan.kepadatan} jiwa/km²
                </p>
              </div>
            </div>
          `)

          multiPolygon.addTo(map)
          polygonsRef.current.push(multiPolygon)
        })
      }
    })

    // Cleanup on unmount
    return () => {
      polygonsRef.current.forEach((polygon) => {
        if (map.hasLayer(polygon)) {
          map.removeLayer(polygon)
        }
      })
    }
  }, [kecamatanData, visible, map, isSelectingLocation])

  return null
}

interface StartLocationLayerProps {
  startLocation: [number, number] | null | undefined
}

export function StartLocationLayer({ startLocation }: StartLocationLayerProps) {
  const map = useMap()
  const markerRef = useRef<L.Marker | null>(null)

  useEffect(() => {
    // Remove existing marker
    if (markerRef.current) {
      map.removeLayer(markerRef.current)
      markerRef.current = null
    }

    if (!startLocation) return

    // Add new marker with high z-index
    markerRef.current = L.marker(startLocation, {
      icon: DefaultIcon,
      zIndexOffset: 1100, // Highest z-index to ensure it's above everything
    }).bindPopup(`
      <div class="p-1">
        <h3 class="font-bold text-base">Lokasi Awal</h3>
        <p class="text-sm text-gray-600">
          Lat: ${startLocation[0].toFixed(5)}, Lng: ${startLocation[1].toFixed(5)}
        </p>
      </div>
    `)

    markerRef.current.addTo(map)

    // Cleanup on unmount
    return () => {
      if (markerRef.current) {
        map.removeLayer(markerRef.current)
      }
    }
  }, [startLocation, map])

  return null
}