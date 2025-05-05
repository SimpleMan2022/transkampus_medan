import { NextResponse } from "next/server"
import pool from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lat = searchParams.get("lat")
  const lng = searchParams.get("lng")
  const limit = searchParams.get("limit") || "1"

  if (!lat || !lng) {
    return NextResponse.json({ error: "Latitude and longitude are required" }, { status: 400 })
  }

  try {
    const limitNum = Number.parseInt(limit)

    // Query the database for the nearest stations
    const query = `
      SELECT nama, tipe,  ST_DistanceSphere(geom, ST_SetSRID(ST_MakePoint($1, $2), 4326)) / 1000 AS jarak
      FROM stasiun_halte
      ORDER BY jarak ASC
      LIMIT $3;
    `
    const values = [Number.parseFloat(lng), Number.parseFloat(lat), limitNum]
    const result = await pool.query(query, values)

    // Return the nearest station(s)
    return NextResponse.json(limitNum === 1 ? result.rows[0] : result.rows)
  } catch (error) {
    console.error("Error finding nearest station:", error)
    return NextResponse.json({ error: "Failed to find nearest station" }, { status: 500 })
  }
}
