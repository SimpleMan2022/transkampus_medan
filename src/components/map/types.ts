import { CompleteRoute } from "./routing-service"

// Define types for data structures
export interface CampusData {
  id_kampus: number
  nama: string
  alamat: string
  website: string
  jumlah_fakultas: number
  jumlah_mahasiswa: number
  geom: {
    type: string
    coordinates: [number, number]
  }
}

export interface FacilityData {
  id_fasilitas: number
  id_kampus: number
  nama: string
  jenis: string
  geom: {
    type: string
    coordinates: [number, number]
  }
}

export interface StationData {
  id_stasiun: number
  nama: string
  tipe: string
  geom: {
    type: string
    coordinates: [number, number]
  }
}

export interface RouteData {
  id_rute: number
  nama: string
  jenis: string
  nomor_angkot: string
  warna: string
  geom: {
    type: string
    coordinates: [number, number][] | [number, number][][]
  }
}

// Type for Kecamatan data
export interface KecamatanData {
  id_kecamatan: number
  nama: string
  luas: number // in km²
  penduduk: number
  kepadatan: number // people per km²
  warna: string
  geom: {
    type: string
    coordinates: [number, number][][] | [number, number][][][]
  }
}

// Type for search results
export type SearchResult =
  | (CampusData & { type: "campus" })
  | (StationData & { type: "station" })
  | (FacilityData & { type: "facility" })
  | (RouteData & { type: "route" })
  | (KecamatanData & { type: "kecamatan" })

export interface MapData {
  campusData: CampusData[]
  facilityData: FacilityData[]
  stationData: StationData[]
  routeData: RouteData[]
  kecamatanData: KecamatanData[]
}

export interface MapSidebarProps {
  onToggleCampuses: (show: boolean) => void;
  onToggleStations: (show: boolean) => void;
  onToggleRoutes: (show: boolean) => void;
  onToggleFacilities: (show: boolean) => void;
  onToggleKecamatan: (show: boolean) => void;
  showCampuses: boolean;
  showStations: boolean;
  showRoutes: boolean;
  showFacilities: boolean;
  showKecamatan: boolean;
  kecamatanVisibility: Record<number, boolean>; // Track visibility for each kecamatan by ID
  onToggleKecamatanVisibility: (kecamatanId: number, show: boolean) => void; // Callback to toggle visibility
  startLocation?: [number, number] | null;
  onStartLocationSelection?: () => void;
  isSelectingLocation?: boolean;
  selectedCampus?: number | null;
  onCampusSelect?: (campusId: number | null) => void;
  onResetRoute?: () => void;
  kecamatanData?: KecamatanData[]; // Tambahkan kecamatanData
  onDeleteKecamatan?: (kecamatanId: number) => void; // Tambahkan untuk hapus
  onChangeKecamatanColor?: (kecamatanId: number, newColor: string) => void;
  onFindRoute?: () => void
  calculatedRoute?: CompleteRoute | null
  onFindNearestRoutes?: (campusId: number) => void
  nearestRoutes?: NearestRouteData[] | null
}

export interface MapComponentProps {
  height?: string;
  width?: string;
  showCampuses?: boolean;
  showFacilities?: boolean;
  showStations?: boolean;
  showRoutes?: boolean;
  showKecamatan?: boolean;
  initialCenter?: [number, number];
  initialZoom?: number;
  onMapClick?: (latlng: [number, number]) => void;
  startLocation?: [number, number] | null;
  isSelectingLocation?: boolean;
  kecamatanVisibility?: Record<number, boolean>; // Add this
  onToggleKecamatanVisibility?: (kecamatanId: number, show: boolean) => void; // Add this
  kecamatanData?: KecamatanData[];
  nearestCampus: any[]; // Ganti 'any' dengan tipe yang lebih spesifik jika memungkinkan
  nearestStations: any[];
  nearestRoutes?: NearestRouteData[] | null
  selectedCampusId?: number | null
  calculatedRoute?: CompleteRoute | null
}

export interface NearestRouteData {
  id_rute: number
  nama: string
  kode: string
  jenis: string
  nomor_angkot: string
  warna: string
  jarak_terbaca: string
  titik_terdekat: string
}