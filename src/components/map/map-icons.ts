import L from "leaflet"

// Define custom icons (without shadow)
export const CampusIcon = L.icon({
  iconUrl: "/images/icon/school.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
})

export const FacilityIcon = L.icon({
  iconUrl: "/images/icon/facility.png",
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -28],
})

export const AngkotIcon = L.icon({
  iconUrl: "/images/icon/angkot.png",
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -28],
})

export const HalteIcon = L.icon({
  iconUrl: "/images/icon/bus-stop.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
})

export const TrainIcon = L.icon({
  iconUrl: "/images/icon/train.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
})

// Fallback default icon (without shadow)
export const DefaultIcon = L.icon({
  iconUrl: "/images/icon/marker.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

// Helper function to get station icon based on type
export const getStationIcon = (type: string) => {
  const typeLower = type.toLowerCase()
  if (typeLower === "halte") return HalteIcon
  if (typeLower === "stasiun") return TrainIcon
  if (typeLower === "terminal") return AngkotIcon
  return DefaultIcon // Fallback for any other type
}
