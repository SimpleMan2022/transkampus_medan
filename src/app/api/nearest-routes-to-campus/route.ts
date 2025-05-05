import { NextResponse } from "next/server";
import pool from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const campusId = searchParams.get("id");
  const limit = searchParams.get("limit") || "3";

  if (!campusId) {
    return NextResponse.json({ error: "Campus ID is required" }, { status: 400 });
  }

  try {
    // Query the database
    const query = `
      SELECT 
        r.id_rute,
        r.nama,
        r.jenis,
        r.nomor_angkot,
        r.warna,
        CASE 
          WHEN ST_DistanceSphere(r.geom, k.geom) < 1000 
            THEN ROUND(ST_DistanceSphere(r.geom, k.geom)) || ' m'
          ELSE 
            ROUND((ST_DistanceSphere(r.geom, k.geom) / 1000)::numeric, 2) || ' km'
        END AS jarak_terbaca,
        ST_AsText(ST_ClosestPoint(r.geom, k.geom)) AS titik_terdekat
      FROM rute r
      JOIN kampus k ON k.id_kampus = $1
      ORDER BY ST_DistanceSphere(r.geom, k.geom) ASC
      LIMIT $2;
    `;

    const values = [campusId, limit];
    const result = await pool.query(query, values);

    return NextResponse.json({
      campusId: campusId,
      routes: result.rows,
    });
  } catch (error) {
    console.error("Error querying nearest routes:", error);
    return NextResponse.json({ error: "Failed to find nearest routes" }, { status: 500 });
  }
}
