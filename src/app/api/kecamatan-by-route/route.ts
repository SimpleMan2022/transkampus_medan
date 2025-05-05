import { NextResponse } from "next/server"

// Mock data for routes
const mockRouteData = [
  {
    id_rute: 1,
    nama: "Rute USU - UNIMED",
    kode: "R1",
    jenis: "Bus Kampus",
    nomor_angkot: "",
    frekuensi: "15 menit",
    jam_operasi: "07:00 - 18:00",
    tarif: "Rp 5.000",
    kapasitas: "40 orang",
    warna: "#10b981",
    kecamatan_ids: [1, 2], // Kecamatan IDs that this route passes through
  },
  {
    id_rute: 2,
    nama: "Rute USU - Medan Kota",
    kode: "R2",
    jenis: "Angkot",
    nomor_angkot: "64",
    frekuensi: "10 menit",
    jam_operasi: "06:00 - 19:00",
    tarif: "Rp 4.000",
    kapasitas: "12 orang",
    warna: "#3b82f6",
    kecamatan_ids: [1, 3], // Kecamatan IDs that this route passes through
  },
]

// Mock data for kecamatan
const mockKecamatanData = [
  {
    id_kecamatan: 1,
    nama: "Medan Baru",
    luas: 5.41,
    penduduk: 40000,
    kepadatan: 7394,
  },
  {
    id_kecamatan: 2,
    nama: "Medan Selayang",
    luas: 12.81,
    penduduk: 107000,
    kepadatan: 8353,
  },
  {
    id_kecamatan: 3,
    nama: "Medan Kota",
    luas: 5.27,
    penduduk: 74000,
    kepadatan: 14042,
  },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const routeId = searchParams.get("id")

  if (!routeId) {
    return NextResponse.json({ error: "Route ID is required" }, { status: 400 })
  }

  try {
    // In a real implementation, you would execute the SQL query:
    // SELECT k.nama FROM kecamatan k
    // JOIN rute r ON ST_Intersects(r.geom, k.geom)
    // WHERE r.id_rute = <id_rute>;

    // For now, we'll use our mock data
    const routeIdNum = Number.parseInt(routeId)

    // Find the route
    const route = mockRouteData.find((r) => r.id_rute === routeIdNum)
    if (!route) {
      return NextResponse.json({ error: "Route not found" }, { status: 404 })
    }

    // Find kecamatan that this route passes through
    const kecamatanList = mockKecamatanData.filter((k) => route.kecamatan_ids.includes(k.id_kecamatan))

    return NextResponse.json({
      route,
      kecamatan: kecamatanList,
    })
  } catch (error) {
    console.error("Error finding kecamatan for route:", error)
    return NextResponse.json({ error: "Failed to find kecamatan for route" }, { status: 500 })
  }
}
