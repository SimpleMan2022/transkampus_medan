import L from "leaflet"
import "leaflet.markercluster"
import "leaflet.markercluster/dist/MarkerCluster.css"
import "leaflet.markercluster/dist/MarkerCluster.Default.css"

// Create custom cluster icons with different colors based on marker type
export function createClusterIcon(type: string) {
  return (cluster: any) => {
    const count = cluster.getChildCount()

    // Determine size based on count
    let size = "small"
    if (count > 100) size = "large"
    else if (count > 10) size = "medium"

    // Determine color based on type
    let color = ""
    switch (type) {
      case "campus":
        color = "emerald"
        break
      case "facility":
        color = "purple"
        break
      case "station":
        color = "amber"
        break
      default:
        color = "blue"
    }

    // Create the icon
    return L.divIcon({
      className: `marker-cluster marker-cluster-${size} bg-${color}-100`,
      iconSize: L.point(40, 40),
      html: `<div class="flex items-center justify-center w-full h-full rounded-full bg-${color}-500 text-white font-bold text-sm">${count}</div>`,
    })
  }
}

// Create cluster groups for different marker types
export function createClusterGroups() {
  return {
    campusCluster: L.markerClusterGroup({
      chunkedLoading: true,
      maxClusterRadius: 50,
      iconCreateFunction: createClusterIcon("campus"),
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
    }),

    facilityCluster: L.markerClusterGroup({
      chunkedLoading: true,
      maxClusterRadius: 40,
      iconCreateFunction: createClusterIcon("facility"),
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
    }),

    stationCluster: L.markerClusterGroup({
      chunkedLoading: true,
      maxClusterRadius: 60,
      iconCreateFunction: createClusterIcon("station"),
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
    }),
  }
}
