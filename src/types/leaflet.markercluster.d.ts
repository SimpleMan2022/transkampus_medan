// Type definitions for Leaflet.markercluster
import * as L from "leaflet"

declare module "leaflet" {
  interface MarkerClusterGroupOptions {
    showCoverageOnHover?: boolean
    zoomToBoundsOnClick?: boolean
    spiderfyOnMaxZoom?: boolean
    removeOutsideVisibleBounds?: boolean
    animate?: boolean
    animateAddingMarkers?: boolean
    disableClusteringAtZoom?: number
    maxClusterRadius?: number
    polygonOptions?: L.PolylineOptions
    singleMarkerMode?: boolean
    spiderLegPolylineOptions?: L.PolylineOptions
    spiderfyDistanceMultiplier?: number
    iconCreateFunction?: (cluster: MarkerCluster) => L.Icon | L.DivIcon
    chunkedLoading?: boolean
    chunkDelay?: number
    chunkInterval?: number
    chunkProgress?: (processedMarkers: number, totalMarkers: number, elapsedTime: number) => void
  }

  interface MarkerCluster extends L.Marker {
    getChildCount(): number
    getAllChildMarkers(storageArray?: L.Marker[]): L.Marker[]
    spiderfy(): void
    unspiderfy(): void
  }

  class MarkerClusterGroup extends L.FeatureGroup {
    constructor(options?: MarkerClusterGroupOptions)
    addLayer(layer: L.Layer): this
    addLayers(layers: L.Layer[], skipLayerAddEvent?: boolean): this
    removeLayers(layers: L.Layer[]): this
    clearLayers(): this
    refreshClusters(layers?: L.Layer | L.Layer[] | L.LayerGroup): this
    hasLayer(layer: L.Layer): boolean
    zoomToShowLayer(layer: L.Layer, callback?: () => void): void
    getVisibleParent(marker: L.Marker): L.Marker
    spiderfyLayer(layer: L.Marker): void
    unspiderfyLayer(layer: L.Marker): void
  }

  function markerClusterGroup(options?: MarkerClusterGroupOptions): MarkerClusterGroup
}
