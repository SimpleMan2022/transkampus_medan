import { NextResponse } from "next/server"
import pool from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lat = searchParams.get("lat")
  const lng = searchParams.get("lng")
  const limit = searchParams.get("limit") || "1" // Default limit to 1 if not provided

  if (!lat || !lng) {
    return NextResponse.json(
      { error: "Latitude and longitude are required" },
      { status: 400 }
    )
  }

  try {
    const query = `
      SELECT nama, alamat,
        ST_DistanceSphere(geom, ST_SetSRID(ST_MakePoint($1, $2), 4326)) / 1000 AS jarak
      FROM kampus
      ORDER BY jarak ASC
      LIMIT $3;
    `
    const values = [parseFloat(lng), parseFloat(lat), parseInt(limit, 10)]

    const result = await pool.query(query, values)

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "No campuses found" },
        { status: 404 }
      )
    }

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Error querying nearest campus:", error)
    return NextResponse.json(
      { error: "Failed to find nearest campus" },
      { status: 500 }
    )
  }
}
