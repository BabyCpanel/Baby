// /api/add.js
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const DB_PATH = join('/tmp', 'targets.json');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  const { number } = req.body;

  if (!number || typeof number !== 'string' || !number.startsWith('62')) {
    return res.status(400).json({ ok: false, error: 'Nomor tidak valid' });
  }

  let list = [];
  if (existsSync(DB_PATH)) {
    list = JSON.parse(readFileSync(DB_PATH));
  }

  if (!list.includes(number)) {
    list.push(number);
    writeFileSync(DB_PATH, JSON.stringify(list));
  }

  return res.status(200).json({ ok: true, total: list.length });
}
