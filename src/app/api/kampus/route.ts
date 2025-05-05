import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT id_kampus, nama, alamat, website, jumlah_fakultas,
             ST_AsGeoJSON(geom) AS geom
      FROM kampus
    `);

    const data = result.rows.map(row => ({
      ...row,
      geom: JSON.parse(row.geom), // konversi GeoJSON ke JS object
    }));

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    client.release();
  }
}
