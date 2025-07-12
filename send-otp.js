export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method not allowed");

  const token = process.env.WA_TOKEN;
  const phoneId = process.env.WA_PHONE_ID;
  const { nomor } = req.body;

  if (!nomor || !/^62[0-9]{9,15}$/.test(nomor)) {
    return res.status(400).json({ ok: false, error: "Nomor tidak valid" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const body = {
    messaging_product: "whatsapp",
    to: nomor,
    type: "text",
    text: {
      body: `Kode OTP Anda adalah: *${otp}*\n\nDari sistem verifikasi ZIONIXHARD.`
    }
  };

  const kirim = await fetch(`https://graph.facebook.com/v19.0/${phoneId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  const result = await kirim.json();

  if (kirim.ok) {
    return res.status(200).json({ ok: true });
  } else {
    return res.status(500).json({ ok: false, error: result.error?.message || "Gagal kirim OTP" });
  }
}
