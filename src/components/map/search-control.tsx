"use client"

import { useState, useCallback, useEffect } from "react"
import { useMap } from "react-leaflet"
import L from "leaflet"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import type { MapData, SearchResult } from "./types"
import { highlightPoint, highlightPolyline, highlightPolygon, clearHighlights } from "./highlight-utils"
import { processRouteGeometry, processPolygonGeometry } from "./map-utils"

interface SearchControlProps {
  data: MapData
}

export function SearchControl({ data }: SearchControlProps) {
  const { campusData, stationData, facilityData, routeData, kecamatanData } = data
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState<boolean>(false)
  const map = useMap()

  // Clear highlights when component unmounts
  useEffect(() => {
    return () => {
      clearHighlights()
    }
  }, [])

  const handleSearch = useCallback(() => {
    if (!searchTerm.trim()) {
      setSearchResults([])
      return
    }

    const term = searchTerm.toLowerCase()

    // Combined search across all data types
    const results: SearchResult[] = [
      ...campusData
        .filter((campus) => campus.nama.toLowerCase().includes(term) || campus.alamat.toLowerCase().includes(term))
        .map((item) => ({ ...item, type: "campus" as const })),

      ...stationData
        .filter((station) => station.nama.toLowerCase().includes(term) || station.tipe.toLowerCase().includes(term))
        .map((item) => ({ ...item, type: "station" as const })),

      ...facilityData
        .filter((facility) => facility.nama.toLowerCase().includes(term) || facility.jenis.toLowerCase().includes(term))
        .map((item) => ({ ...item, type: "facility" as const })),

      ...routeData
        .filter(
          (route) =>
            route.nama.toLowerCase().includes(term) ||
            route.jenis.toLowerCase().includes(term),
        )
        .map((item) => ({ ...item, type: "route" as const })),

      ...kecamatanData
        .filter((kecamatan) => kecamatan.nama.toLowerCase().includes(term))
        .map((item) => ({ ...item, type: "kecamatan" as const })),
    ]

    setSearchResults(results)
    setIsSearching(true)
  }, [searchTerm, campusData, stationData, facilityData, routeData, kecamatanData])

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      handleSearch()
    }, 100) // misal 500ms debounce

    return () => clearTimeout(delayDebounce)
  }, [searchTerm, handleSearch])

  const goToLocation = useCallback(
    (item: SearchResult) => {
      // Clear any existing highlights
      clearHighlights()

      if (item.type === "campus" || item.type === "station" || item.type === "facility") {
        const coordinates = item.geom.coordinates as [number, number]
        const position: [number, number] = [coordinates[1], coordinates[0]]

        // Zoom to the point with animation
        map.flyTo(position, 17, {
          animate: true,
          duration: 1.5,
        })

        // Add highlight effect
        setTimeout(() => {
          const color =
            item.type === "campus"
              ? "#10b981" // emerald
              : item.type === "facility"
                ? "#8b5cf6" // purple
                : "#f59e0b" // amber

          highlightPoint(map, position, color)
        }, 1000) // Delay highlight until zoom is complete
      } else if (item.type === "route") {
        const routePaths = processRouteGeometry(item.geom)

        if (routePaths.length > 0) {
          // Create bounds from all points in the route
          const bounds = L.latLngBounds(routePaths.flat().map((coord) => L.latLng(coord[0], coord[1])))

          // Zoom to the route with animation
          map.flyToBounds(bounds, {
            padding: [50, 50],
            animate: true,
            duration: 1.5,
          })

          // Add highlight effect
          setTimeout(() => {
            routePaths.forEach((path) => {
              highlightPolyline(
                map,
                path.map((coord) => L.latLng(coord[0], coord[1])),
                item.warna || "#3b82f6",
              )
            })
          }, 1000) // Delay highlight until zoom is complete
        }
      } else if (item.type === "kecamatan") {
        const polygons = processPolygonGeometry(item.geom)

        if (item.geom.type === "Polygon" && polygons.length > 0) {
          // Create bounds from all points in the polygon
          const bounds = L.latLngBounds(
            (polygons as [number, number][][]).flat().map((coord) => L.latLng(coord[0], coord[1])),
          )

          // Zoom to the polygon with animation
          map.flyToBounds(bounds, {
            padding: [50, 50],
            animate: true,
            duration: 1.5,
          })

          // Add highlight effect
          setTimeout(() => {
            highlightPolygon(map, polygons as [number, number][][], item.warna || "#6b7280")
          }, 1000) // Delay highlight until zoom is complete
        } else if (item.geom.type === "MultiPolygon") {
          // Create bounds from all points in all polygons
          const allPoints = (polygons as [number, number][][][]).flat().flat()
          const bounds = L.latLngBounds(allPoints.map((coord) => L.latLng(coord[0], coord[1])))

          // Zoom to the multipolygon with animation
          map.flyToBounds(bounds, {
            padding: [50, 50],
            animate: true,
            duration: 1.5,
          })

          // Add highlight effect
          setTimeout(() => {
            ;(polygons as [number, number][][][]).forEach((polygon) => {
              highlightPolygon(map, polygon, item.warna || "#6b7280")
            })
          }, 1000) // Delay highlight until zoom is complete
        }
      }

      setIsSearching(false)
      setSearchResults([])
    },
    [map],
  )

  return (
    <div className="absolute top-4 left-4 z-[1000] w-64">
      <div className="relative">
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Cari lokasi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white shadow-md"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch()
              }
            }}
          />
          <Button variant="default" size="icon" onClick={handleSearch}>
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {isSearching && searchResults.length > 0 && (
          <Card className="absolute top-full left-0 right-0 mt-2 max-h-64 overflow-y-auto z-50">
            <CardContent className="p-2">
              <ul className="space-y-1">
                {searchResults.map((item) => {
                  const getIdField = () => {
                    switch (item.type) {
                      case "campus":
                        return item.id_kampus
                      case "station":
                        return item.id_stasiun
                      case "facility":
                        return item.id_fasilitas
                      case "route":
                        return item.id_rute
                      case "kecamatan":
                        return item.id_kecamatan
                    }
                  }

                  const getSubtitle = () => {
                    switch (item.type) {
                      case "campus":
                        return item.alamat
                      case "station":
                        return item.tipe
                      case "facility":
                        return item.jenis
                      case "route":
                        return `${item.jenis}`
                      case "kecamatan":
                        return `Kecamatan - ${item.penduduk.toLocaleString()} jiwa`
                    }
                  }

                  const getTypeIcon = () => {
                    switch (item.type) {
                      case "campus":
                        return <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                      case "station":
                        return <span className="w-2 h-2 rounded-full bg-amber-500 mr-2"></span>
                      case "facility":
                        return <span className="w-2 h-2 rounded-full bg-purple-500 mr-2"></span>
                      case "route":
                        return <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                      case "kecamatan":
                        return <span className="w-2 h-2 rounded-full bg-gray-500 mr-2"></span>
                    }
                  }

                  return (
                    <li
                      key={`${item.type}-${getIdField()}`}
                      className="p-2 hover:bg-slate-100 cursor-pointer rounded-md text-sm"
                      onClick={() => goToLocation(item)}
                    >
                      <div className="flex items-center">
                        {getTypeIcon()}
                        <div>
                          <p className="font-medium">{item.nama}</p>
                          <p className="text-xs text-gray-500">{getSubtitle()}</p>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
