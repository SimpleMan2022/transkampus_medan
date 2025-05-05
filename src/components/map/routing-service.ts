import type { RouteData } from "./types"

// Interface for route segments
export interface RouteSegment {
  id: number
  name: string
  color: string
  type: string
  path: [number, number][]
  distance: number // in km
  duration: number // in minutes
}

// Interface for complete route
export interface CompleteRoute {
  segments: RouteSegment[]
  totalDistance: number
  totalDuration: number
  startLocation: [number, number]
  endLocation: [number, number]
  campusId: number
  campusName: string
}

// Find the nearest point on any route to the given location
function findNearestRoutePoint(
  location: [number, number],
  routes: RouteData[],
): { routeId: number; point: [number, number]; distance: number; index: number } | null {
  let nearestPoint: [number, number] | null = null
  let minDistance = Number.POSITIVE_INFINITY
  let nearestRouteId = -1
  let nearestPointIndex = -1

  routes.forEach((route) => {
    if (route.geom.type !== "LineString") return

    const coordinates = route.geom.coordinates as [number, number][]

    coordinates.forEach((coord, index) => {
      // Convert to [lat, lng] format
      const point: [number, number] = [coord[1], coord[0]]
      const distance = calculateDistance(location[0], location[1], point[0], point[1])

      if (distance < minDistance) {
        minDistance = distance
        nearestPoint = point
        nearestRouteId = route.id_rute
        nearestPointIndex = index
      }
    })
  })

  if (nearestPoint) {
    return {
      routeId: nearestRouteId,
      point: nearestPoint,
      distance: minDistance,
      index: nearestPointIndex,
    }
  }

  return null
}

// Find a route from start to end using existing route data
export function findRoute(
  startLocation: [number, number],
  campusId: number,
  routes: RouteData[],
  campuses: any[],
): CompleteRoute | null {
  // Find the campus coordinates
  const campus = campuses.find((c) => c.id === campusId)
  if (!campus) return null

  const campusLocation: [number, number] = [campus.geom.coordinates[1], campus.geom.coordinates[0]]

  // Find nearest points on routes for both start and end locations
  const nearestToStart = findNearestRoutePoint(startLocation, routes)
  const nearestToCampus = findNearestRoutePoint(campusLocation, routes)

  if (!nearestToStart || !nearestToCampus) return null

  // For simplicity in this demo, we'll just use the route that contains both points
  // In a real implementation, you would need to find a path that might involve multiple routes

  if (nearestToStart.routeId === nearestToCampus.routeId) {
    const route = routes.find((r) => r.id_rute === nearestToStart.routeId)
    if (!route) return null

    // Extract the segment of the route between the two points
    const coordinates = route.geom.coordinates as [number, number][]

    // Determine the direction (which point comes first in the route)
    const startIndex = Math.min(nearestToStart.index, nearestToCampus.index)
    const endIndex = Math.max(nearestToStart.index, nearestToCampus.index)

    // Extract the path segment
    const pathSegment = coordinates
      .slice(startIndex, endIndex + 1)
      .map((coord) => [coord[1], coord[0]] as [number, number])

    // Calculate distance and duration
    let segmentDistance = 0
    for (let i = 0; i < pathSegment.length - 1; i++) {
      segmentDistance += calculateDistance(
        pathSegment[i][0],
        pathSegment[i][1],
        pathSegment[i + 1][0],
        pathSegment[i + 1][1],
      )
    }

    // Estimate duration (assuming average speed of 30 km/h)
    const segmentDuration = (segmentDistance / 30) * 60

    const segment: RouteSegment = {
      id: route.id_rute,
      name: route.nama,
      color: route.warna || "#3b82f6",
      type: route.jenis,
      path: pathSegment,
      distance: segmentDistance,
      duration: segmentDuration,
    }

    return {
      segments: [segment],
      totalDistance: segmentDistance,
      totalDuration: segmentDuration,
      startLocation,
      endLocation: campusLocation,
      campusId,
      campusName: campus.nama,
    }
  }

  // For demo purposes, if no direct route is found, return null
  // In a real implementation, you would implement a graph-based routing algorithm
  // to find a path that might involve multiple routes
  return null
}

// Haversine formula to calculate distance between two points on Earth
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1)
  const dLon = deg2rad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c // Distance in km
  return distance
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180)
}
