import { NextResponse } from "next/server";
import pool from '@/lib/db';


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const kecamatanId = searchParams.get("id");

  if (!kecamatanId) {
    return NextResponse.json({ error: "Kecamatan ID is required" }, { status: 400 });
  }

  try {
    const kecamatanIdNum = Number.parseInt(kecamatanId);

    // Query to get kecamatan details
    const kecamatanQuery = `
      SELECT id_kecamatan, nama, luas, penduduk, kepadatan
      FROM kecamatan
      WHERE id_kecamatan = $1
    `;
    const kecamatanResult = await pool.query(kecamatanQuery, [kecamatanIdNum]);

    if (kecamatanResult.rows.length === 0) {
      return NextResponse.json({ error: "Kecamatan not found" }, { status: 404 });
    }

    const kecamatan = kecamatanResult.rows[0];

    // Query to get stations in the kecamatan
    const stationsQuery = `
      SELECT sh.id_stasiun, sh.nama, sh.tipe, sh.geom
        FROM stasiun_halte sh
        JOIN kecamatan k ON ST_Within(sh.geom, k.geom)
        WHERE k.id_kecamatan = $1;
    `;
    const stationsResult = await pool.query(stationsQuery, [kecamatanIdNum]);

    return NextResponse.json({
      kecamatan,
      stations: stationsResult.rows,
    });
  } catch (error) {
    console.error("Error querying the database:", error);
    return NextResponse.json({ error: "Failed to retrieve data from the database" }, { status: 500 });
  }
}
