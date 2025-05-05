// Helper function to get coordinates from GeoJSON geometry
export function getLatLngFromGeoJSON(geom: any): [number, number] {
  return [geom.coordinates[1], geom.coordinates[0]]
}

// Helper function to process LineString or MultiLineString geometries
export function processRouteGeometry(geom: any): [number, number][][] {
  if (!geom) return []

  if (geom.type === "LineString") {
    return [geom.coordinates.map((coord: [number, number]) => [coord[1], coord[0]])]
  } else if (geom.type === "MultiLineString") {
    return geom.coordinates.map((line: [number, number][]) =>
      line.map((coord: [number, number]) => [coord[1], coord[0]]),
    )
  }

  return []
}

// Helper function to process Polygon or MultiPolygon geometries
export function processPolygonGeometry(geom: any): [number, number][][] | [number, number][][][] {
  if (!geom) return []

  if (geom.type === "Polygon") {
    return geom.coordinates.map((ring: [number, number][]) =>
      ring.map((coord: [number, number]) => [coord[1], coord[0]]),
    )
  } else if (geom.type === "MultiPolygon") {
    return geom.coordinates.map((polygon: [number, number][][]) =>
      polygon.map((ring: [number, number][]) => ring.map((coord: [number, number]) => [coord[1], coord[0]])),
    )
  }

  return []
}

// Add map styles
export function addMapStyles() {
  const styleElement = document.createElement("style")
  styleElement.textContent = `
    .leaflet-container:fullscreen {
      width: 100% !important;
      height: 100% !important;
    }
    
    /* Fix for fullscreen z-index issues */
    .leaflet-container:fullscreen .leaflet-control-container .leaflet-top,
    .leaflet-container:fullscreen .leaflet-control-container .leaflet-bottom {
      z-index: 1001 !important;
    }
    
    /* Cursor style for location selection */
    .selecting-location {
      cursor: crosshair !important;
    }
    .selecting-location .leaflet-interactive {
      cursor: crosshair !important;
    }
  `
  document.head.appendChild(styleElement)
  return () => {
    document.head.removeChild(styleElement)
  }
}

// Fetch map data from API
export async function fetchMapData() {
  const promises = [
    fetch("/api/kampus").then((res) => {
      if (!res.ok) throw new Error(`Error fetching campus data: ${res.status}`)
      return res.json()
    }),
    fetch("/api/fasilitas-kampus").then((res) => {
      if (!res.ok) throw new Error(`Error fetching facility data: ${res.status}`)
      return res.json()
    }),
    fetch("/api/stasiun-halte").then((res) => {
      if (!res.ok) throw new Error(`Error fetching station data: ${res.status}`)
      return res.json()
    }),
    fetch("/api/rute").then((res) => {
      if (!res.ok) throw new Error(`Error fetching route data: ${res.status}`)
      return res.json()
    }),
    fetch("/api/kecamatan").then((res) => {
      if (!res.ok) throw new Error(`Error fetching kecamatan data: ${res.status}`)
      return res.json()
    }),
  ]

  const [campusData, facilityData, stationData, routeData, kecamatanData] = await Promise.all(promises)

  return {
    campusData,
    facilityData,
    stationData,
    routeData,
    kecamatanData,
  }
}
