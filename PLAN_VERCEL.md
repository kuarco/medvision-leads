# Plan de despliegue — MedVision Cotizador en Vercel

## Diagnóstico del proyecto

| Aspecto | Estado |
|--------|--------|
| Tipo de app | HTML estático con JS vanilla |
| Backend requerido | ❌ No (todo corre en el navegador) |
| Webhook de envío | ⚠️ Pendiente — `submitQuote()` solo hace `console.log` |
| Dependencias externas | Ninguna (sin CDN, sin npm) |
| Listo para producción | Parcialmente — falta conectar el webhook |

---

## Fase 1 — Preparar el repositorio

### 1.1 Renombrar el archivo de entrada

Vercel sirve `index.html` automáticamente como raíz. Renombrar el archivo:

```bash
cd /Users/kuarcolabs/Documents/GitHub/medvision-leads
cp medvision-cotizador-final.html index.html
```

### 1.2 Agregar `vercel.json`

Crear un archivo `vercel.json` en la raíz para forzar que cualquier ruta sirva el HTML (necesario para el flujo de pasos sin recarga):

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### 1.3 Inicializar git y subir al repo

```bash
git init
git remote add origin git@github.com:kuarco/medvision-leads.git
git add index.html vercel.json
git commit -m "feat: cotizador medvision — deploy inicial"
git branch -M main
git push -u origin main
```

---

## Fase 2 — Conectar con Vercel

1. Ir a **[vercel.com](https://vercel.com)** → **Add New Project**
2. Importar el repo `kuarco/medvision-leads`
3. Configuración del proyecto:
   - **Framework Preset:** Other (ninguno)
   - **Root Directory:** `/` (raíz)
   - **Build Command:** dejar vacío
   - **Output Directory:** dejar vacío
4. Clic en **Deploy**

El cotizador quedará disponible en:
```
https://medvision-leads.vercel.app
```

---

## Fase 3 — Conectar el webhook de leads (obligatorio)

### El problema

En `index.html` línea ~1187, la función `submitQuote()` tiene el webhook comentado:

```js
// TODO: replace with your webhook endpoint
// fetch('https://your-endpoint.com/quote', { ... });
```

Hasta conectar un endpoint real, los leads **no llegan a ningún lado**.

### Opciones de integración

#### Opción A — Make / n8n (recomendado, sin código)

1. Crear un escenario en [make.com](https://make.com) con trigger **Webhook**
2. Copiar la URL generada (ej: `https://hook.eu1.make.com/xxxxx`)
3. Reemplazar en `index.html`:

```js
fetch('https://hook.eu1.make.com/TU_ID_AQUI', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
})
.then(() => { /* mostrar pantalla de éxito */ })
.catch(err => console.error(err));
```

4. En Make: conectar a Gmail / Slack / HubSpot / Google Sheets según necesites

---

#### Opción B — Supabase (leads en base de datos)

Insertar el lead directamente en una tabla `leads` de Supabase:

```js
fetch('https://TU_PROYECTO.supabase.co/rest/v1/leads', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apikey': 'TU_ANON_KEY',
    'Authorization': 'Bearer TU_ANON_KEY'
  },
  body: JSON.stringify(payload)
});
```

Requiere crear la tabla `leads` en Supabase con las columnas del payload.

---

#### Opción C — Vercel Serverless Function (máximo control)

Crear el archivo `/api/quote.js` en el repo:

```js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const payload = req.body;
  // Aquí: guardar en DB, enviar email, notificar Slack, etc.
  console.log('New lead:', payload);
  res.status(200).json({ ok: true });
}
```

Y en `index.html` apuntar a:

```js
fetch('/api/quote', { method: 'POST', ... })
```

Vercel detecta la carpeta `/api/` y despliega la función automáticamente.

---

## Fase 4 — Pantalla de confirmación mejorada

Actualmente la pantalla de "¡Cotización enviada!" se muestra **antes** de confirmar que el webhook respondió correctamente. Recomendado: mostrarla solo al recibir respuesta `200`:

```js
async function submitQuote() {
  // ... armar payload ...
  try {
    const res = await fetch('/api/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Error al enviar');
    // mostrar pantalla de éxito
    mostrarPantallaExito(totalMods, clinicData);
  } catch (err) {
    alert('Hubo un error al enviar tu cotización. Por favor intenta de nuevo.');
  }
}
```

---

## Resumen de entregables

| # | Acción | Archivos |
|---|--------|----------|
| 1 | Renombrar HTML → `index.html` | `index.html` |
| 2 | Crear configuración Vercel | `vercel.json` |
| 3 | Push al repo GitHub | `git push` |
| 4 | Importar proyecto en Vercel | — |
| 5 | Elegir e implementar webhook | `index.html` línea ~1187 |
| 6 | Probar flujo completo end-to-end | — |

---

## Decisión pendiente

Antes de implementar la Fase 3, confirmar:

- **¿Dónde quieres recibir los leads?** (email, Slack, CRM, base de datos)
- **¿Tienes cuenta en Make/n8n o prefieres Supabase?**

Con esa respuesta se puede implementar el webhook en menos de 30 minutos.
