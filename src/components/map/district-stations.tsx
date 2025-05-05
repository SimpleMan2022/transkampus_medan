"use client"

import { useState } from "react"
import { Bus, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { getStationsInDistrict } from "./spatial-query-service"
import {toast} from "sonner"
import type { KecamatanData } from "./types"

interface DistrictStationsFeatureProps {
  kecamatanData: KecamatanData[]
}

export function DistrictStationsFeature({ kecamatanData }: DistrictStationsFeatureProps) {
  const [selectedDistrict, setSelectedDistrict] = useState<number | "">("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [stations, setStations] = useState<any[]>([])

  const handleDistrictChange = async (districtId: number | "") => {
    setSelectedDistrict(districtId)

    if (districtId === "") {
      setStations([])
      return
    }

    setIsLoading(true)
    try {
      const result = await getStationsInDistrict(districtId as number)
      setStations(result)

      if (result.length === 0) {
        toast.error("Tidak ada stasiun/halte ditemukan", {
          description: "Silakan pilih kecamatan lain.",
        })
      } else {
        toast.success("Stasiun/halte ditemukan", {
          description: `${result.length} stasiun/halte ditemukan di kecamatan ini.`,
        })
      }
    } catch (error) {
      toast.error("Gagal memuat stasiun/halte", {
        description: "Silakan coba lagi.",
      })
      // setStations([])

      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-medium mb-1">Pilih Kecamatan:</p>
        <select
          className="w-full p-2 border rounded-md text-sm"
          value={selectedDistrict}
          onChange={(e) => handleDistrictChange(e.target.value ? Number(e.target.value) : "")}
          disabled={isLoading}
        >
          <option value="">Pilih kecamatan...</option>
          {kecamatanData.map((kecamatan) => (
            <option key={kecamatan.id_kecamatan} value={kecamatan.id_kecamatan}>
              {kecamatan.nama}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
        </div>
      ) : (
        <>
          {stations.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Ditemukan {stations.length} stasiun/halte di kecamatan ini:</p>
              <div className="max-h-60 overflow-y-auto pr-1">
                {stations.map((station, index) => (
                  <Card key={index} className="mb-2">
                    <CardContent className="p-3">
                      <div className="flex items-start gap-2">
                        <Bus className="h-5 w-5 text-amber-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium">{station.nama}</h4>
                          <p className="text-xs text-muted-foreground">{station.tipe}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
