export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const { number, list, message } = req.body;
  const targetList = list || (number ? [number] : []);

  if (!Array.isArray(targetList) || targetList.length === 0) {
    return res.status(400).json({ ok: false, error: 'Nomor tidak valid' });
  }

  // Simulasi pengiriman (testing dummy dulu)
  console.log('Mengirim bug:', message);
  console.log('Ke nomor:', targetList);

  // Kirim JSON response sukses
  return res.status(200).json({ ok: true, sent: targetList.length });
}
