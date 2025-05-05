"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { KecamatanData, MapComponentProps, MapSidebarProps } from "@/components/map/types";
import dynamic from "next/dynamic";


// Pastikan path ke file benar dan gunakan default import
const MapSidebar = dynamic(() => import("@/components/map/map-sidebar").then((mod) => mod.default), {
  ssr: false,
  loading: () => <div className="p-4 text-center">Memuat sidebar...</div>,
}) as React.ComponentType<MapSidebarProps>;

const DynamicMap = dynamic(() => import("@/components/map/dynamic-map").then((mod) => mod.default), {
  ssr: false,
  loading: () => <div className="h-[600px] bg-gray-200 flex items-center justify-center">Memuat peta...</div>,
}) as React.ComponentType<MapComponentProps>;

export default function MapPage() {
  const [showCampuses, setShowCampuses] = useState(true);
  const [showStations, setShowStations] = useState(true);
  const [showRoutes, setShowRoutes] = useState(true);
  const [showFacilities, setShowFacilities] = useState(true);
  const [showKecamatan, setShowKecamatan] = useState(true);
  const [startLocation, setStartLocation] = useState<[number, number] | null>(null);
  const [selectedCampus, setSelectedCampus] = useState<number | null>(null);
  const [isSelectingLocation, setIsSelectingLocation] = useState(false);
  const [nearestCampus, setNearestCampus] = useState<any>(null);
  const [nearestStations, setNearestStations] = useState<any[]>([]);
  const [kecamatanData, setKecamatanData] = useState<KecamatanData[]>([]);
  const [kecamatanVisibility, setKecamatanVisibility] = useState<Record<number, boolean>>({});
  const [isClient, setIsClient] = useState(false); // Tambahkan untuk cek sisi klien

  useEffect(() => {
    setIsClient(true); // Set isClient ke true setelah komponen dimuat di klien
  }, []);

  useEffect(() => {
    const fetchKecamatanData = async () => {
      try {
        const response = await fetch("/api/kecamatan");
        const data = await response.json();
        if (response.ok) {
          setKecamatanData(data);
          const initialVisibility: Record<number, boolean> = {};
          data.forEach((kecamatan: KecamatanData) => {
            initialVisibility[kecamatan.id_kecamatan] = true;
          });
          setKecamatanVisibility(initialVisibility);
        } else if (isClient) {
          // Hanya panggil toast jika di sisi klien
          toast.error("Gagal memuat data kecamatan", {
            description: "Silakan coba lagi.",
          });
        }
      } catch (error) {
        console.error("Error fetching kecamatan data:", error);
        if (isClient) {
          // Hanya panggil toast jika di sisi klien
          toast.error("Gagal memuat data kecamatan", {
            description: "Terjadi kesalahan saat mengambil data.",
          });
        }
      }
    };

    fetchKecamatanData();
  }, [isClient]); // Tambahkan isClient sebagai dependensi

  const handleStartLocationSelection = () => {
    setIsSelectingLocation(true);
    if (isClient) {
      toast.info("Klik pada peta untuk memilih lokasi awal", {
        duration: 3000,
      });
    }
    setStartLocation(null);
  };

  const handleMapClick = (latlng: [number, number]) => {
    if (isSelectingLocation) {
      setStartLocation(latlng);
      setIsSelectingLocation(false);
      if (isClient) {
        toast.info("Lokasi awal telah dipilih", {
          duration: 3000,
        });
      }
    }
  };

  const resetRouteSelection = () => {
    setStartLocation(null);
    setSelectedCampus(null);
    setNearestCampus(null);
    setNearestStations([]);
  };

  const handleToggleKecamatanVisibility = (kecamatanId: number, show: boolean) => {
    setKecamatanVisibility((prev) => ({
      ...prev,
      [kecamatanId]: show,
    }));
  };

  const handleDeleteKecamatan = (kecamatanId: number) => {
    setKecamatanData((prev) => prev.filter((kecamatan) => kecamatan.id_kecamatan !== kecamatanId));
    setKecamatanVisibility((prev) => {
      const newVisibility = { ...prev };
      delete newVisibility[kecamatanId];
      return newVisibility;
    });
    if (isClient) {
      toast.success(`Kecamatan dengan ID ${kecamatanId} telah dihapus.`);
    }
  };

  const handleChangeKecamatanColor = (kecamatanId: number, newColor: string) => {
    setKecamatanData((prev) =>
      prev.map((kecamatan) =>
        kecamatan.id_kecamatan === kecamatanId ? { ...kecamatan, warna: newColor } : kecamatan
      )
    );
    if (isClient) {
      toast.success(`Warna kecamatan dengan ID ${kecamatanId} telah diganti menjadi ${newColor}.`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container py-6">
        <div className="flex items-center mb-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Kembali
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Peta TransKampus Medan</h1>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <MapSidebar
              onToggleCampuses={setShowCampuses}
              onToggleStations={setShowStations}
              onToggleRoutes={setShowRoutes}
              onToggleFacilities={setShowFacilities}
              onToggleKecamatan={setShowKecamatan}
              showCampuses={showCampuses}
              showStations={showStations}
              showRoutes={showRoutes}
              showFacilities={showFacilities}
              showKecamatan={showKecamatan}
              kecamatanVisibility={kecamatanVisibility}
              onToggleKecamatanVisibility={handleToggleKecamatanVisibility}
              startLocation={startLocation}
              onStartLocationSelection={handleStartLocationSelection}
              isSelectingLocation={isSelectingLocation}
              selectedCampus={selectedCampus}
              onCampusSelect={setSelectedCampus}
              onResetRoute={resetRouteSelection}
              kecamatanData={kecamatanData}
              onDeleteKecamatan={handleDeleteKecamatan}
              onChangeKecamatanColor={handleChangeKecamatanColor}
            />
          </div>

          <div className="md:col-span-3" style={{ position: "relative" }}>
            {isSelectingLocation && (
              <div className="absolute top-4 left-4 right-4 z-[2000] bg-emerald-100 text-emerald-800 p-3 rounded-md shadow-md border border-emerald-200">
                <p className="text-sm font-medium">Klik pada peta untuk memilih lokasi awal</p>
              </div>
            )}
            <DynamicMap
              height="600px"
              showCampuses={showCampuses}
              showStations={showStations}
              showRoutes={showRoutes}
              showFacilities={showFacilities}
              showKecamatan={showKecamatan}
              onMapClick={handleMapClick}
              isSelectingLocation={isSelectingLocation}
              startLocation={startLocation}
              nearestCampus={nearestCampus}
              nearestStations={nearestStations}
              kecamatanVisibility={kecamatanVisibility}
              kecamatanData={kecamatanData}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}