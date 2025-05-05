import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT id_fasilitas, id_kampus, nama, jenis,
             ST_AsGeoJSON(geom) AS geom
      FROM fasilitas_kampus
    `);

    const data = result.rows.map(row => ({
      ...row,
      geom: JSON.parse(row.geom),
    }));

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    client.release();
  }
}
