export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const payload = req.body;

  // Log the lead (visible in Vercel Function logs)
  console.log('New MedVision lead:', JSON.stringify(payload, null, 2));

  // TODO: add your notification channel here
  // Option A — Send email via Resend:
  // await fetch('https://api.resend.com/emails', {
  //   method: 'POST',
  //   headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     from: 'cotizador@medvision.pro',
  //     to: 'ventas@medvision.pro',
  //     subject: `Nueva cotización — ${payload.clinic?.name}`,
  //     text: JSON.stringify(payload, null, 2),
  //   }),
  // });

  // Option B — Forward to Make/n8n webhook:
  // await fetch(process.env.WEBHOOK_URL, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(payload),
  // });

  return res.status(200).json({ ok: true });
}
