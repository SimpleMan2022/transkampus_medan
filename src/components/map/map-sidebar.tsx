"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Navigation, Bus, School, Building, MapPin, Route, Map, Compass, MapPinned, RotateCcw } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { toast } from "sonner"
import {
  findNearestCampus,
  findNearestStations,
  getStationsByKecamatan,
  getKecamatanByRoute,
  findNearestRoutesToCampus,
} from "./spatial-query-service"
import type { MapSidebarProps } from "./types"

// Custom hook untuk debouncing
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Sample campus data for the dropdown
const campuses = [
  { id: 1, name: "Universitas Sumatera Utara" },
  { id: 2, name: "Universitas Negeri Medan" },
  { id: 3, name: "Universitas Medan Area" },
  { id: 4, name: "Politeknik Negeri Medan" },
  { id: 5, name: "Universitas HKBP Nommensen" },
  { id: 6, name: "Universitas Muhammadiyah Sumatera Utara" },
]

export default function MapSidebar({
  onToggleCampuses,
  onToggleStations,
  onToggleRoutes,
  onToggleFacilities,
  onToggleKecamatan,
  showCampuses,
  showStations,
  showRoutes,
  showFacilities,
  showKecamatan,
  startLocation,
  onStartLocationSelection,
  isSelectingLocation,
  kecamatanVisibility,
  onToggleKecamatanVisibility,
  kecamatanData = [],
  onDeleteKecamatan,
  onChangeKecamatanColor,
  onResetRoute,
  selectedCampus,
  onCampusSelect,
  onFindRoute,
  calculatedRoute,
  onFindNearestRoutes,
  nearestRoutes,
}: MapSidebarProps) {
  // Existing state variables
  const [loadingNearestRoutes, setLoadingNearestRoutes] = useState(false)
  const [selectedCampusForRoutes, setSelectedCampusForRoutes] = useState<number | "">("")
  const [activeTab, setActiveTab] = useState("features")
  const [loadingNearby, setLoadingNearby] = useState(false)
  const [nearestCampuses, setNearestCampuses] = useState<any[]>([])
  const [nearestStations, setNearestStations] = useState<any[]>([])
  const [selectedKecamatan, setSelectedKecamatan] = useState<number | "">("")
  const [kecamatanStations, setKecamatanStations] = useState<any[]>([])
  const [selectedRoute, setSelectedRoute] = useState<number | "">("")
  const [routeKecamatan, setRouteKecamatan] = useState<any[]>([])
  const [loadingKecamatanStations, setLoadingKecamatanStations] = useState(false)
  const [loadingRouteKecamatan, setLoadingRouteKecamatan] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [colorValues, setColorValues] = useState<Record<number, string>>({})
  const [loadingRoute, setLoadingRoute] = useState(false)

  // New state for campus routes feature
  const [campusForRoutes, setCampusForRoutes] = useState<number | "">("")
  const [loadingCampusRoutes, setLoadingCampusRoutes] = useState(false)
  const [nearestRoutesCampus, setNearestRoutes] = useState<any[]>([])

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Inisialisasi colorValues berdasarkan kecamatanData
  useEffect(() => {
    const initialColors: Record<number, string> = {}
    kecamatanData.forEach((kecamatan) => {
      initialColors[kecamatan.id_kecamatan] = kecamatan.warna || "#6b7280"
    })
    setColorValues(initialColors)
  }, [kecamatanData])

  // Debounce nilai warna selama 2 detik (2000 ms)
  const debouncedColorValues = useDebounce(colorValues, 2000)

  // Panggil onChangeKecamatanColor hanya setelah debouncing selesai
  useEffect(() => {
    Object.entries(debouncedColorValues).forEach(([kecamatanId, color]) => {
      const id = Number(kecamatanId)
      const kecamatan = kecamatanData.find((k) => k.id_kecamatan === id)
      if (kecamatan && kecamatan.warna !== color) {
        onChangeKecamatanColor?.(id, color)
      }
    })
  }, [debouncedColorValues, kecamatanData, onChangeKecamatanColor])

  // Handler untuk memperbarui warna sementara
  const handleColorChange = (kecamatanId: number, newColor: string) => {
    setColorValues((prev) => ({
      ...prev,
      [kecamatanId]: newColor,
    }))
  }

  const findNearbyLocations = async () => {
    if (!isClient) return
    if (!startLocation) {
      toast.info("Silakan pilih lokasi di peta terlebih dahulu.", {
        description: "Klik pada peta untuk memilih lokasi awal.",
      })
      return
    }

    try {
      setLoadingNearby(true)
      // Ambil 3 kampus terdekat
      const campuses = await findNearestCampus(startLocation[0], startLocation[1])
      setNearestCampuses(Array.isArray(campuses) ? campuses : [campuses])
      const stations = await findNearestStations(startLocation[0], startLocation[1], 3)
      setNearestStations(Array.isArray(stations) ? stations : [stations])

      if (campuses.length > 0) {
        toast.info("Kampus terdekat ditemukan", {
          description: `Ditemukan ${campuses.length} kampus terdekat.`,
        })
      } else {
        toast.error("Tidak ada kampus terdekat ditemukan.")
      }

      if (stations.length > 0) {
        toast.info("Stasiun/halte terdekat ditemukan", {
          description: `Ditemukan ${stations.length} stasiun/halte terdekat.`,
        })
      } else {
        toast.error("Tidak ada stasiun/halte terdekat ditemukan.")
      }
    } catch (error) {
      console.error("Error finding nearby locations:", error)
      toast.error("Gagal menemukan lokasi terdekat", {
        description: "Silakan coba lagi.",
      })
    } finally {
      setLoadingNearby(false)
    }
  }

  // Handler untuk reset lokasi dan hasil pencarian
  const handleResetLocation = () => {
    onResetRoute?.()
    setNearestCampuses([])
    setNearestStations([])
    toast.info("Lokasi dan hasil pencarian telah direset.")
  }

  const handleKecamatanSelect = async (id: number | "") => {
    if (!isClient) return
    setSelectedKecamatan(id)
    if (id === "") {
      setKecamatanStations([])
      return
    }

    try {
      setLoadingKecamatanStations(true)
      const data = await getStationsByKecamatan(id as number)
      setKecamatanStations(data.stations || [])

      toast.info(`Stasiun di Kecamatan ${data.kecamatan.nama}`, {
        description: `Ditemukan ${data.stations.length} stasiun/halte di kecamatan ini.`,
      })
    } catch (error) {
      console.error("Error getting stations by kecamatan:", error)
      toast.error("Gagal mendapatkan data stasiun", {
        description: "Terjadi kesalahan saat mengambil data stasiun.",
      })
      setKecamatanStations([])
    } finally {
      setLoadingKecamatanStations(false)
    }
  }

  const handleRouteSelect = async (id: number | "") => {
    if (!isClient) return
    setSelectedRoute(id)
    if (id === "") {
      setRouteKecamatan([])
      return
    }

    try {
      setLoadingRouteKecamatan(true)
      const data = await getKecamatanByRoute(id as number)
      setRouteKecamatan(data.kecamatan || [])

      toast.info(`Kecamatan di Rute ${data.route.name}`, {
        description: `Ditemukan ${data.kecamatan.length} kecamatan yang dilewati oleh rute ini.`,
      })
    } catch (error) {
      console.error("Error getting kecamatan by route:", error)
      toast.info("Gagal mendapatkan data kecamatan", {
        description: "Terjadi kesalahan saat mengambil data kecamatan.",
      })
      setRouteKecamatan([])
    } finally {
      setLoadingRouteKecamatan(false)
    }
  }

  // New handler for finding routes near a campus
  const handleFindCampusRoutes = async () => {
    if (!isClient) return
    if (campusForRoutes === "") {
      toast.info("Silakan pilih kampus terlebih dahulu.")
      return
    }

    try {
      setLoadingCampusRoutes(true)
      const data = await findNearestRoutesToCampus(campusForRoutes as number)
      setNearestRoutes(data.routes || [])

      if (data.routes.length > 0) {
        toast.success(`Rute Terdekat dari ${data.campus.nama}`, {
          description: `Ditemukan ${data.routes.length} rute terdekat dari kampus ini.`,
        })
      } else {
        toast.error("Tidak ada rute terdekat ditemukan.")
      }
    } catch (error) {
      console.error("Error finding nearest routes to campus:", error)
      toast.error("Gagal menemukan rute terdekat", {
        description: "Terjadi kesalahan saat mengambil data rute.",
      })
      setNearestRoutes([])
    } finally {
      setLoadingCampusRoutes(false)
    }
  }

  const handleFindRoute = () => {
    if (!startLocation || !selectedCampus) {
      toast.error("Data Tidak Lengkap", {
        description: "Silakan pilih lokasi awal dan kampus tujuan.",
      })
      return
    }

    setLoadingRoute(true)

    // Call the parent component's onFindRoute function
    if (onFindRoute) {
      onFindRoute()
    }

    setLoadingRoute(false)
  }

  const handleFindNearestRoutes = async () => {
    if (!isClient || selectedCampusForRoutes === "") {
      toast.info("Silakan pilih kampus terlebih dahulu.", {
        description: "Pilih kampus untuk mencari rute terdekat.",
      })
      return
    }

    try {
      setLoadingNearestRoutes(true)

      // Call the parent component's onFindNearestRoutes function if provided
      if (onFindNearestRoutes) {
        onFindNearestRoutes(selectedCampusForRoutes as number)
      }

      toast.info("Pencarian Rute Terdekat", {
        description: "Mencari rute terdekat dari kampus yang dipilih.",
      })
    } catch (error) {
      console.error("Error finding nearest routes:", error)
      toast.error("Gagal menemukan rute terdekat", {
        description: "Silakan coba lagi.",
      })
    } finally {
      setLoadingNearestRoutes(false)
    }
  }

  if (!isClient) {
    return (
      <Card className="h-full">
        <CardContent className="p-4">
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">Memuat...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="layers">Layers</TabsTrigger>
          <TabsTrigger value="features">Fitur</TabsTrigger>
          <TabsTrigger value="legend">Legenda</TabsTrigger>
        </TabsList>

        <TabsContent value="layers" className="p-0">
          <CardContent className="p-4">
            <h3 className="font-medium mb-3">Tampilkan di Peta</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="show-campuses"
                  checked={showCampuses}
                  onCheckedChange={(checked) => onToggleCampuses(checked as boolean)}
                />
                <Label htmlFor="show-campuses" className="flex items-center cursor-pointer">
                  <School className="h-4 w-4 mr-2 text-emerald-600" />
                  Kampus
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="show-facilities"
                  checked={showFacilities}
                  onCheckedChange={(checked) => onToggleFacilities(checked as boolean)}
                />
                <Label htmlFor="show-facilities" className="flex items-center cursor-pointer">
                  <Building className="h-4 w-4 mr-2 text-purple-500" />
                  Fasilitas Kampus
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="show-stations"
                  checked={showStations}
                  onCheckedChange={(checked) => onToggleStations(checked as boolean)}
                />
                <Label htmlFor="show-stations" className="flex items-center cursor-pointer">
                  <Bus className="h-4 w-4 mr-2 text-amber-500" />
                  Stasiun & Halte
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="show-routes"
                  checked={showRoutes}
                  onCheckedChange={(checked) => onToggleRoutes(checked as boolean)}
                />
                <Label htmlFor="show-routes" className="flex items-center cursor-pointer">
                  <Navigation className="h-4 w-4 mr-2 text-blue-500" />
                  Rute
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="show-kecamatan"
                  checked={showKecamatan}
                  onCheckedChange={(checked) => onToggleKecamatan(checked as boolean)}
                />
                <Label htmlFor="show-kecamatan" className="flex items-center cursor-pointer">
                  <Map className="h-4 w-4 mr-2 text-green-600" />
                  Kecamatan
                </Label>
              </div>

              {showKecamatan && (
                <>
                  {kecamatanData.length > 0 ? (
                    <div className="ml-6 space-y-2">
                      {kecamatanData.map((kecamatan) => (
                        <div key={kecamatan.id_kecamatan} className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={colorValues[kecamatan.id_kecamatan] || kecamatan.warna || "#6b7280"}
                            onChange={(e) => handleColorChange(kecamatan.id_kecamatan, e.target.value)}
                            className="w-6 h-6 rounded"
                            title={`Ganti warna ${kecamatan.nama}`}
                          />
                          <Checkbox
                            id={`kecamatan-${kecamatan.id_kecamatan}`}
                            checked={kecamatanVisibility[kecamatan.id_kecamatan] ?? true}
                            onCheckedChange={(checked) =>
                              onToggleKecamatanVisibility?.(kecamatan.id_kecamatan, checked as boolean)
                            }
                          />
                          <Label htmlFor={`kecamatan-${kecamatan.id_kecamatan}`} className="text-sm cursor-pointer">
                            {kecamatan.nama}
                          </Label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="ml-6 text-sm text-muted-foreground">Tidak ada data kecamatan.</div>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </TabsContent>

        <TabsContent value="features" className="p-0">
          <CardContent className="p-4">
            <Accordion type="single" collapsible defaultValue="route-finder">
              <AccordionItem value="route-finder">
                <AccordionTrigger className="flex items-center">
                  <div className="flex items-center">
                    <Route className="h-4 w-4 mr-2" />
                    <span>Pencarian Rute</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 mt-2">
                    <div>
                      <p className="text-sm font-medium mb-1">Lokasi Awal:</p>
                      {startLocation ? (
                        <div className="flex items-center justify-between">
                          <span className="text-sm">
                            {startLocation[0].toFixed(5)}, {startLocation[1].toFixed(5)}
                          </span>
                          <Button variant="ghost" size="sm" onClick={handleResetLocation} className="h-7 px-2">
                            Reset
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={onStartLocationSelection}
                          disabled={isSelectingLocation}
                        >
                          <MapPin className="h-4 w-4 mr-2" />
                          {isSelectingLocation ? "Klik pada peta..." : "Pilih di peta"}
                        </Button>
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-1">Kampus Tujuan:</p>
                      <select
                        className="w-full p-2 border rounded-md text-sm"
                        value={selectedCampus || ""}
                        onChange={(e) => onCampusSelect && onCampusSelect(Number(e.target.value) || null)}
                      >
                        <option value="">Pilih kampus...</option>
                        {campuses.map((campus) => (
                          <option key={campus.id} value={campus.id}>
                            {campus.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1" onClick={handleResetLocation}>
                        Reset
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                        disabled={!startLocation || !selectedCampus || loadingRoute}
                        onClick={handleFindRoute}
                      >
                        {loadingRoute ? "Mencari..." : "Cari Rute"}
                      </Button>
                    </div>

                    {calculatedRoute && (
                      <div className="mt-4 pt-4 border-t">
                        <h4 className="text-sm font-medium mb-2">Rute Ditemukan:</h4>
                        <div className="bg-emerald-50 p-3 rounded-md">
                          <p className="font-medium text-sm">Menuju {calculatedRoute.campusName}</p>
                          <div className="mt-2 space-y-2">
                            {calculatedRoute.segments.map((segment, idx) => (
                              <div key={idx} className="text-xs bg-white p-2 rounded border border-emerald-100">
                                <div className="flex items-center">
                                  <div
                                    className="w-3 h-3 rounded-full mr-2"
                                    style={{ backgroundColor: segment.color }}
                                  ></div>
                                  <p className="font-medium">{segment.name}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-1 mt-1">
                                  <p>Jarak: {segment.distance.toFixed(2)} km</p>
                                  <p>Waktu: {Math.round(segment.duration)} menit</p>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="mt-3 text-xs font-medium">
                            <p>Total Jarak: {calculatedRoute.totalDistance.toFixed(2)} km</p>
                            <p>Estimasi Waktu: {Math.round(calculatedRoute.totalDuration)} menit</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Add new accordion item for campus routes */}
              <AccordionItem value="campus-routes">
                <AccordionTrigger className="flex items-center">
                  <div className="flex items-center">
                    <Navigation className="h-4 w-4 mr-2" />
                    <span>Rute Terdekat dari Kampus</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 mt-2">
                    <p className="text-sm text-muted-foreground">
                      Temukan rute transportasi terdekat dari kampus yang Anda pilih.
                    </p>

                    <div>
                      <p className="text-sm font-medium mb-1">Pilih Kampus:</p>
                      <select
                        className="w-full p-2 border rounded-md text-sm"
                        value={campusForRoutes}
                        onChange={(e) => setCampusForRoutes(e.target.value ? Number(e.target.value) : "")}
                      >
                        <option value="">Pilih kampus...</option>
                        {campuses.map((campus) => (
                          <option key={campus.id} value={campus.id}>
                            {campus.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <Button
                      variant="default"
                      size="sm"
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                      disabled={campusForRoutes === "" || loadingCampusRoutes}
                      onClick={handleFindCampusRoutes}
                    >
                      {loadingCampusRoutes ? "Mencari..." : "Temukan Rute Terdekat"}
                    </Button>

                    {nearestRoutesCampus.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Rute Terdekat:</h4>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {nearestRoutesCampus.map((route, index) => (
                            <div key={index} className="bg-slate-50 p-3 rounded-md text-sm">
                              <div className="flex items-center">
                                <div
                                  className="w-3 h-3 rounded-full mr-2"
                                  style={{ backgroundColor: route.warna }}
                                ></div>
                                <p className="font-medium">{route.nama}</p>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {route.jenis} {route.nomor_angkot && `- No. ${route.nomor_angkot}`}
                              </p>
                              <p className="text-xs mt-1">
                                <span className="font-medium">Jarak:</span> {route.jarak_terbaca}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="nearby-locations">
                <AccordionTrigger className="flex items-center">
                  <div className="flex items-center">
                    <Compass className="h-4 w-4 mr-2" />
                    <span>Lokasi Terdekat</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 mt-2">
                    <p className="text-sm text-muted-foreground">
                      Temukan kampus dan halte terdekat dari lokasi yang Anda pilih.
                    </p>

                    {!startLocation ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={onStartLocationSelection}
                        disabled={isSelectingLocation}
                      >
                        <MapPin className="h-4 w-4 mr-2" />
                        {isSelectingLocation ? "Klik pada peta..." : "Pilih Lokasi di Peta"}
                      </Button>
                    ) : (
                      <div className="space-y-2">
                        <Button
                          variant="default"
                          size="sm"
                          className="w-full bg-emerald-600 hover:bg-emerald-700"
                          onClick={findNearbyLocations}
                          disabled={loadingNearby}
                        >
                          {loadingNearby ? "Mencari..." : "Temukan Lokasi Terdekat"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-red-600 hover:text-red-700"
                          onClick={handleResetLocation}
                        >
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Reset Lokasi
                        </Button>
                      </div>
                    )}

                    {nearestCampuses.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Kampus Terdekat:</h4>
                        <div className="space-y-2">
                          {nearestCampuses.map((campus, index) => (
                            <div key={index} className="bg-slate-50 p-3 rounded-md text-sm">
                              <p className="font-medium">{campus.nama}</p>
                              <p className="text-xs text-muted-foreground">{campus.alamat}</p>
                              <p className="text-xs mt-1">
                                <span className="font-medium">Jarak:</span> {campus.jarak.toFixed(2)} km
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {nearestStations.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Stasiun/Halte Terdekat:</h4>
                        <div className="space-y-2">
                          {nearestStations.map((station, index) => (
                            <div key={index} className="bg-slate-50 p-3 rounded-md text-sm">
                              <p className="font-medium">{station.nama}</p>
                              <p className="text-xs text-muted-foreground">{station.tipe}</p>
                              <p className="text-xs mt-1">
                                <span className="font-medium">Jarak:</span> {station.jarak.toFixed(2)} km
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="kecamatan-stations">
                <AccordionTrigger className="flex items-center">
                  <div className="flex items-center">
                    <MapPinned className="h-4 w-4 mr-2" />
                    <span>Stasiun per Kecamatan</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 mt-2">
                    <p className="text-sm text-muted-foreground">
                      Lihat semua stasiun dan halte di kecamatan tertentu.
                    </p>

                    <div>
                      <p className="text-sm font-medium mb-1">Pilih Kecamatan:</p>
                      <select
                        className="w-full p-2 border rounded-md text-sm"
                        value={selectedKecamatan}
                        onChange={(e) => handleKecamatanSelect(e.target.value ? Number(e.target.value) : "")}
                        disabled={loadingKecamatanStations}
                      >
                        <option value="">Pilih kecamatan...</option>
                        {kecamatanData.map((kecamatan) => (
                          <option key={kecamatan.id_kecamatan} value={kecamatan.id_kecamatan}>
                            {kecamatan.nama}
                          </option>
                        ))}
                      </select>
                    </div>

                    {loadingKecamatanStations && (
                      <div className="text-center py-2">
                        <p className="text-sm text-muted-foreground">Memuat data...</p>
                      </div>
                    )}

                    {kecamatanStations.length > 0 && (
                      <div className="mt-2">
                        <h4 className="text-sm font-medium mb-2">Stasiun/Halte di Kecamatan:</h4>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {kecamatanStations.map((station, index) => (
                            <div key={index} className="bg-slate-50 p-3 rounded-md text-sm">
                              <p className="font-medium">{station.nama}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedKecamatan && kecamatanStations.length === 0 && !loadingKecamatanStations && (
                      <div className="text-center py-2">
                        <p className="text-sm text-muted-foreground">Tidak ada stasiun/halte di kecamatan ini.</p>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="route-kecamatan">
                <AccordionTrigger className="flex items-center">
                  <div className="flex items-center">
                    <Navigation className="h-4 w-4 mr-2" />
                    <span>Kecamatan per Rute</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 mt-2">
                    <p className="text-sm text-muted-foreground">
                      Lihat semua kecamatan yang dilewati oleh rute tertentu.
                    </p>

                    {loadingRouteKecamatan && (
                      <div className="text-center py-2">
                        <p className="text-sm text-muted-foreground">Memuat data...</p>
                      </div>
                    )}

                    {routeKecamatan.length > 0 && (
                      <div className="mt-2">
                        <h4 className="text-sm font-medium mb-2">Kecamatan yang Dilewati:</h4>
                        <div className="space-y-2">
                          {routeKecamatan.map((kecamatan, index) => (
                            <div key={index} className="bg-slate-50 p-3 rounded-md text-sm">
                              <p className="font-medium">Kecamatan {kecamatan.nama}</p>
                              <div className="grid grid-cols-2 gap-1 text-xs mt-1">
                                <p>
                                  <span className="font-medium">Luas:</span> {kecamatan.luas} km²
                                </p>
                                <p>
                                  <span className="font-medium">Penduduk:</span> {kecamatan.penduduk.toLocaleString()}{" "}
                                  jiwa
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedRoute && routeKecamatan.length === 0 && !loadingRouteKecamatan && (
                      <div className="text-center py-2">
                        <p className="text-sm text-muted-foreground">Tidak ada data kecamatan untuk rute ini.</p>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </TabsContent>

        <TabsContent value="legend" className="p-0">
          <CardContent className="p-4">
            <h3 className="font-medium mb-3">Legenda</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-5 h-5 mr-2 flex items-center justify-center">
                  <Map className="h-4 w-4 text-green-600" />
                </div>
                <span>Kecamatan</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 mr-2 flex items-center justify-center">
                  <School className="h-4 w-4 text-emerald-600" />
                </div>
                <span>Kampus</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 mr-2 flex items-center justify-center">
                  <Building className="h-4 w-4 text-purple-500" />
                </div>
                <span>Fasilitas Kampus</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 mr-2 flex items-center justify-center">
                  <Bus className="h-4 w-4 text-amber-500" />
                </div>
                <span>Halte Bus</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-1 bg-emerald-600 mr-2"></div>
                <span>Rute Bus Kampus</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-1 bg-blue-500 mr-2"></div>
                <span>Rute Angkot</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 mr-2 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-emerald-600"></div>
                </div>
                <span>Rute Terpilih</span>
              </div>
            </div>
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
