// Service to handle spatial queries

export async function findNearestCampus(lat: number, lng: number, limit = 3) {
  try {
    const response = await fetch(`/api/nearest-campus?lat=${lat}&lng=${lng}&limit=${limit}`)
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error("Failed to find nearest campus:", error)
    throw error
  }
}

export async function findNearestStations(lat: number, lng: number, limit = 3) {
  try {
    const response = await fetch(`/api/nearest-station?lat=${lat}&lng=${lng}&limit=${limit}`)
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error("Failed to find nearest stations:", error)
    throw error
  }
}

export async function getStationsByKecamatan(kecamatanId: number) {
  try {
    const response = await fetch(`/api/stations-by-kecamatan?id=${kecamatanId}`)
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error("Failed to get stations by kecamatan:", error)
    throw error
  }
}

export async function getKecamatanByRoute(routeId: number) {
  try {
    const response = await fetch(`/api/kecamatan-by-route?id=${routeId}`)
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error("Failed to get kecamatan by route:", error)
    throw error
  }
}

export async function findNearestRoutesToCampus(campusId: number, limit = 3) {
  try {
    const response = await fetch(`/api/nearest-routes-to-campus?id=${campusId}&limit=${limit}`)
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error("Failed to find nearest routes to campus:", error)
    throw error
  }
}