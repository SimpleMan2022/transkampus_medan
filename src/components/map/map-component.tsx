"use client"

import { useEffect, useState, useRef } from "react"
import { MapContainer, TileLayer, ZoomControl, LayersControl } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import type { MapComponentProps, MapData } from "./types"
import { DefaultIcon } from "./map-icons"
import { addMapStyles, fetchMapData } from "./map-utils"
import { MapClickHandler, MapEventHandler } from "./map-handlers"
import { SearchControl } from "./search-control"
import { CampusLayer, FacilityLayer, StationLayer, RouteLayer, StartLocationLayer, KecamatanLayer } from "./map-layers"
import { RouteDisplay } from "./route-display" // Import the RouteDisplay component
import { NearestRoutesDisplay } from "./nearest-route-display"

// Generate large mock facility data for testing
function generateMockFacilityData(count: number) {
  const facilityTypes = ["Perpustakaan", "Kantin", "Laboratorium", "Auditorium", "Gedung Olahraga", "Masjid", "Klinik"]
  const operationalHours = ["08:00 - 16:00", "07:00 - 17:00", "08:00 - 20:00", "24 Jam"]

  return Array.from({ length: count }).map((_, index) => ({
    id_fasilitas: index + 1,
    id_kampus: Math.floor(index / 50) + 1, // Distribute facilities among campuses
    nama: `Fasilitas ${index + 1}`,
    jenis: facilityTypes[index % facilityTypes.length],
    jam_operasional: operationalHours[index % operationalHours.length],
    geom: {
      type: "Point",
      coordinates: [
        98.6559 + (Math.random() * 0.1 - 0.05), // Random coordinates around Medan
        3.5616 + (Math.random() * 0.1 - 0.05),
      ],
    },
  }))
}

export default function MapComponent({
  height = "600px",
  width = "100%",
  showCampuses = true,
  showFacilities = true,
  showStations = true,
  showRoutes = true,
  showKecamatan = true,
  initialCenter = [3.57, 98.67],
  initialZoom = 13,
  onMapClick,
  startLocation,
  isSelectingLocation = false,
  kecamatanVisibility = {},
  kecamatanData = [],
  calculatedRoute = null,
  nearestRoutes = null,
  selectedCampusId = null,
}: MapComponentProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [mapData, setMapData] = useState<MapData>({
    campusData: [],
    facilityData: [],
    stationData: [],
    routeData: [],
    kecamatanData: [],
  })

  useEffect(() => {
    const loadMapData = async () => {
      try {
        setLoading(true)
        const data = await fetchMapData()
        setMapData({
          campusData: data.campusData,
          facilityData: data.facilityData,
          stationData: data.stationData,
          routeData: data.routeData,
          kecamatanData: kecamatanData,
        })
      } catch (err) {
        console.error("Failed to fetch data:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch map data")
      } finally {
        setLoading(false)
      }
    }

    loadMapData()
  }, [kecamatanData])

  useEffect(() => {
    L.Marker.prototype.options.icon = DefaultIcon
  }, [])

  useEffect(() => {
    return addMapStyles()
  }, [])

  // Function to create custom panes with proper z-index ordering
  const setupMapPanes = (map: L.Map) => {
    // Create custom panes with specific z-indices
    if (!map.getPane("kecamatanPane")) {
      map.createPane("kecamatanPane")
      map.getPane("kecamatanPane")!.style.zIndex = "350" // Lower than default overlayPane (400)
    }

    // Create a pane for the calculated route with higher z-index
    if (!map.getPane("routingPane")) {
      map.createPane("routingPane")
      map.getPane("routingPane")!.style.zIndex = "450" // Higher than default overlayPane (400)
    }
  }

  return (
    <div ref={mapContainerRef} className="relative" style={{ height, width }}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
          <div className="text-lg font-medium text-gray-700">Loading map data...</div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
          <div className="text-lg font-medium text-red-600">Error: {error}</div>
        </div>
      )}

      <MapContainer
        center={initialCenter}
        zoom={initialZoom}
        style={{ height: "100%", width: "100%" }}
        className="rounded-lg border shadow-md z-0"
        zoomControl={false}
        id="map"
      >
        <LayersControl position="bottomleft">
          <LayersControl.BaseLayer checked name="OpenStreetMap">
            <TileLayer
              attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="Google Maps (Road)">
            <TileLayer attribution="Map data © Google" url="http://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}" />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="Google Maps (Satellite)">
            <TileLayer attribution="Map data © Google" url="http://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}" />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="Terrain (Stamen)">
            <TileLayer
              attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> — Map data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.png"
              maxZoom={18}
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        <ZoomControl position="bottomright" />
        <SearchControl data={mapData} />
        <MapEventHandler />
        <MapClickHandler onMapClick={onMapClick} isSelectingLocation={isSelectingLocation} />

        <RouteLayer routeData={mapData.routeData} visible={showRoutes} />
        <StationLayer stationData={mapData.stationData} visible={showStations} />
        <FacilityLayer facilityData={mapData.facilityData} visible={showFacilities} />
        <CampusLayer campusData={mapData.campusData} visible={showCampuses} />
        <StartLocationLayer startLocation={startLocation} />
        <KecamatanLayer
          kecamatanData={kecamatanData}
          visible={showKecamatan}
          isSelectingLocation={isSelectingLocation}
        />

        {/* Add the RouteDisplay component */}
        <RouteDisplay route={calculatedRoute} />

        {/* Add the NearestRoutesDisplay component */}
        <NearestRoutesDisplay routes={nearestRoutes} campusId={selectedCampusId} />
      </MapContainer>
    </div>
  )
}
