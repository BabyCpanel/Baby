// /api/send.js
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const DB_PATH = join('/tmp', 'targets.json');

// Fungsi Kirim Simulasi (bisa diganti dengan Baileys atau lainnya)
async function kirimPesan(nomor, pesan) {
  console.log(`📤 Kirim ke: ${nomor}`);
  console.log(pesan.slice(0, 50) + '...');
}

export default async function handler(req, res) {
  // Buat cek jumlah dari tombol "Cek Target"
  if (req.method === 'OPTIONS') {
    if (!existsSync(DB_PATH)) {
      return res.json({ ok: true, total: 0 });
    }
    const list = JSON.parse(readFileSync(DB_PATH));
    return res.json({ ok: true, total: list.length });
  }

  // Untuk POST kirim pesan
  if (req.method !== 'POST') {
    return res.status(405).json
