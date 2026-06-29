const MODULE_NAMES = {
  patients: 'Gestión de pacientes', appointments: 'Agenda de citas',
  medical_records: 'Historias clínicas', prescriptions: 'Recetas médicas',
  test_reports: 'Reportes de laboratorio', leads: 'Gestión de leads',
  telemedicine: 'Telemedicina', patient_followup: 'Seguimiento con IA',
  odontogram: 'Odontograma', aesthetic_simulator: 'Simulador estético',
  room_management: 'Gestión de salas', ai_assistant: 'Asistente IA',
  consultation_recorder: 'Grabador de consultas', medgemma: 'Diagnóstico con IA',
  billing: 'Facturación', accounting: 'Contabilidad', expenses: 'Gastos',
  commissions: 'Comisiones', payroll: 'Nómina', credit_notes: 'Notas de crédito',
  patient_wallet: 'Wallet del paciente', fixed_assets: 'Activos fijos',
  insurance_claims: 'Reclamos de seguro', electronic_invoice: 'Factura electrónica',
  staff: 'Personal', training: 'Capacitación', services: 'Catálogo de servicios',
  departments: 'Departamentos', lab_vendors: 'Proveedores de lab', tasks: 'Gestión de tareas',
  inventory: 'Inventario', suppliers: 'Proveedores', purchase_orders: 'Órdenes de compra',
  performance: 'Rendimiento', reports: 'Reportes', advanced_metrics: 'Métricas avanzadas',
  messaging: 'Email con IA', workflows: 'Workflows',
};

const CAT_LABELS = {
  patient_care: 'Atención al paciente', clinical: 'Clínico especializado',
  ai: 'Inteligencia artificial', finance: 'Finanzas', ops: 'Operaciones',
  inventory: 'Inventario y compras', analytics: 'Analítica',
  comms: 'Comunicaciones', automation: 'Automatización',
};

function buildHtml(p) {
  const c = p.clinic;

  const clinicRows = (p.clinics || []).map((cl, i) => `
    <tr>
      <td style="padding:6px 12px;color:#8A857F;border-bottom:1px solid #E5E4E3;">Sede ${i + 1}</td>
      <td style="padding:6px 12px;font-weight:600;border-bottom:1px solid #E5E4E3;">
        ${cl.name} — ${cl.doctors} médico${cl.doctors !== 1 ? 's' : ''}, ${cl.admin} admin
        <span style="color:#8A857F;">(${cl.total} total)</span>
      </td>
    </tr>`).join('');

  const moduleRows = Object.entries(p.modules || {})
    .filter(([, mods]) => mods.length > 0)
    .map(([cat, mods]) => `
      <tr>
        <td style="padding:6px 12px;color:#8A857F;border-bottom:1px solid #E5E4E3;vertical-align:top;">
          ${CAT_LABELS[cat] || cat}
        </td>
        <td style="padding:6px 12px;border-bottom:1px solid #E5E4E3;">
          ${mods.map(m => `<span style="display:inline-block;background:#F7F5F2;border:1px solid #CEC5B7;border-radius:99px;padding:2px 10px;font-size:12px;margin:2px;">${MODULE_NAMES[m] || m}</span>`).join(' ')}
        </td>
      </tr>`).join('');

  return `<!DOCTYPE html>
<html lang="es">
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#F2F2F2;margin:0;padding:32px 16px;">
  <div style="max-width:600px;margin:0 auto;">
    <div style="background:#54504C;border-radius:12px 12px 0 0;padding:20px 28px;display:flex;align-items:center;justify-content:space-between;">
      <span style="color:#F4E07A;font-size:20px;font-weight:800;letter-spacing:.04em;">MEDVISION AI</span>
      <span style="color:#CEC5B7;font-size:12px;">Nueva cotización</span>
    </div>

    <div style="background:#fff;border:1px solid #E5E4E3;border-top:none;border-radius:0 0 12px 12px;padding:28px 32px;">
      <p style="margin:0 0 20px;font-size:14px;color:#54504C;">
        Se ha recibido una nueva solicitud de cotización con
        <strong>${p.total_modules} módulos</strong> seleccionados.
      </p>

      <h3 style="font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#CEC5B7;margin:0 0 8px;">Datos del contacto</h3>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        <tr><td style="padding:6px 12px;color:#8A857F;border-bottom:1px solid #E5E4E3;">Nombre</td><td style="padding:6px 12px;font-weight:600;border-bottom:1px solid #E5E4E3;">${c.name}</td></tr>
        <tr><td style="padding:6px 12px;color:#8A857F;border-bottom:1px solid #E5E4E3;">Correo</td><td style="padding:6px 12px;border-bottom:1px solid #E5E4E3;"><a href="mailto:${c.email}" style="color:#54504C;">${c.email}</a></td></tr>
        <tr><td style="padding:6px 12px;color:#8A857F;border-bottom:1px solid #E5E4E3;">Teléfono</td><td style="padding:6px 12px;border-bottom:1px solid #E5E4E3;">${c.phone}</td></tr>
        <tr><td style="padding:6px 12px;color:#8A857F;border-bottom:1px solid #E5E4E3;">País</td><td style="padding:6px 12px;border-bottom:1px solid #E5E4E3;">${c.country}</td></tr>
        <tr><td style="padding:6px 12px;color:#8A857F;border-bottom:1px solid #E5E4E3;">Especialidad</td><td style="padding:6px 12px;border-bottom:1px solid #E5E4E3;">${c.specialty}</td></tr>
        <tr><td style="padding:6px 12px;color:#8A857F;">Colaboradores totales</td><td style="padding:6px 12px;font-weight:600;">${p.total_staff}</td></tr>
      </table>

      ${clinicRows ? `
      <h3 style="font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#CEC5B7;margin:0 0 8px;">Sedes</h3>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">${clinicRows}</table>` : ''}

      <h3 style="font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#CEC5B7;margin:0 0 8px;">Módulos seleccionados</h3>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">${moduleRows || '<tr><td style="padding:6px 12px;color:#8A857F;">Ninguno</td></tr>'}</table>

      <div style="background:#54504C;border-radius:8px;padding:14px 20px;display:flex;justify-content:space-between;align-items:center;">
        <span style="color:#CEC5B7;font-size:13px;">Total de módulos</span>
        <span style="color:#F4E07A;font-size:22px;font-weight:800;">${p.total_modules}</span>
      </div>
    </div>

    <p style="text-align:center;font-size:11px;color:#8A857F;margin-top:16px;">MedVision AI · medvision.pro</p>
  </div>
</body>
</html>`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const payload = req.body;
  console.log('New MedVision lead:', JSON.stringify(payload, null, 2));

  const emailRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'cotizador@medvision.pro',
      to: ['oliver@kuarco.com', 'juan@kuarco.com'],
      subject: `Nueva cotización — ${payload.clinic?.name} (${payload.total_modules} módulos)`,
      html: buildHtml(payload),
    }),
  });

  if (!emailRes.ok) {
    const err = await emailRes.text();
    console.error('Resend error:', err);
    return res.status(500).json({ error: 'Email delivery failed' });
  }

  return res.status(200).json({ ok: true });
}
