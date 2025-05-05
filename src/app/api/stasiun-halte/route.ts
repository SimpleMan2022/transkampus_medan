import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT id_stasiun, nama, tipe,
             ST_AsGeoJSON(geom) AS geom
      FROM stasiun_halte
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
