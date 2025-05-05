"use client"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Navigation, Bus, School, Building } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface MapControlsProps {
  onToggleCampuses: (show: boolean) => void
  onToggleStations: (show: boolean) => void
  onToggleRoutes: (show: boolean) => void
  onToggleFacilities?: (show: boolean) => void
  showCampuses: boolean
  showStations: boolean
  showRoutes: boolean
  showFacilities?: boolean
}

export function MapControls({
  onToggleCampuses,
  onToggleStations,
  onToggleRoutes,
  onToggleFacilities,
  showCampuses,
  showStations,
  showRoutes,
  showFacilities = true,
}: MapControlsProps) {
  return (
    <Card className="shadow-md">
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

          {onToggleFacilities && (
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
          )}

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
        </div>
      </CardContent>
    </Card>
  )
}
