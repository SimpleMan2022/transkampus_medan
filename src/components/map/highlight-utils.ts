import L from "leaflet"

// Store references to highlighted objects for cleanup
let highlightedMarker: L.Marker | null = null
let highlightedPolyline: L.Polyline | null = null
let highlightedPolygon: L.Polygon | null = null
let pulseTimer: NodeJS.Timeout | null = null

// Clear any existing highlights
export function clearHighlights() {
  if (highlightedMarker) {
    highlightedMarker.remove()
    highlightedMarker = null
  }

  if (highlightedPolyline) {
    highlightedPolyline.remove()
    highlightedPolyline = null
  }

  if (highlightedPolygon) {
    highlightedPolygon.remove()
    highlightedPolygon = null
  }

  if (pulseTimer) {
    clearTimeout(pulseTimer)
    pulseTimer = null
  }
}

// Highlight a point (campus, facility, station)
export function highlightPoint(map: L.Map, position: L.LatLngExpression, color = "#10b981") {
  clearHighlights()

  // Create pulsing circle marker
  const pulseIcon = L.divIcon({
    className: "highlight-marker",
    html: `
      <div class="relative">
        <div class="absolute inset-0 animate-ping rounded-full bg-${color.replace("#", "")} opacity-75" style="background-color: ${color}"></div>
        <div class="relative rounded-full h-6 w-6 bg-${color.replace("#", "")} opacity-50" style="background-color: ${color}"></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  })

  highlightedMarker = L.marker(position, { icon: pulseIcon, zIndexOffset: 1000 }).addTo(map)

  // Auto-remove highlight after 5 seconds
  pulseTimer = setTimeout(() => {
    clearHighlights()
  }, 5000)
}

// Highlight a polyline (route)
export function highlightPolyline(map: L.Map, positions: L.LatLngExpression[], color = "#3b82f6") {
  clearHighlights()

  // Create highlighted polyline with animation
  highlightedPolyline = L.polyline(positions, {
    color: color,
    weight: 6,
    opacity: 0.8,
    dashArray: "10, 10",
    lineCap: "round",
    className: "animated-dash",
  }).addTo(map)

  // Auto-remove highlight after 5 seconds
  pulseTimer = setTimeout(() => {
    clearHighlights()
  }, 5000)
}

// Highlight a polygon (kecamatan)
export function highlightPolygon(map: L.Map, positions: L.LatLngExpression[][], color = "#6b7280") {
  clearHighlights()

  // Create highlighted polygon with animation
  highlightedPolygon = L.polygon(positions, {
    color: color,
    weight: 3,
    opacity: 0.8,
    fillColor: color,
    fillOpacity: 0.2,
    className: "animated-fill",
  }).addTo(map)

  // Auto-remove highlight after 5 seconds
  pulseTimer = setTimeout(() => {
    clearHighlights()
  }, 5000)
}
