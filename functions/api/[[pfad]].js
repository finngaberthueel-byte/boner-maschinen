/* =====================================================================
   boner maschinen — Backend (Cloudflare Pages Functions)
   Eine Datei für alle Endpunkte.

   Benötigt:
     KV-Namespace-Binding  DATEN
     Umgebungsvariable     ADMIN_PASSWORT  (als Secret)

   Endpunkte:
     GET    /api/angebote        Angebote lesen (öffentlich)
     PUT    /api/angebote        Angebote speichern (Sitzung nötig)
     POST   /api/login           Passwort prüfen, Sitzung starten
     POST   /api/bild            Bild hochladen (Sitzung nötig)
     GET    /api/bild/<id>       Bild ausliefern (öffentlich)
   ===================================================================== */

const SITZUNG_DAUER = 60 * 60 * 12; // 12 Stunden

const json = (daten, status = 200) =>
  new Response(JSON.stringify(daten), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store'
    }
  });

/* Zeitkonstanter Vergleich, damit das Passwort nicht über die
   Antwortdauer erraten werden kann. */
function gleich(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function sitzungGueltig(request, env) {
  const token = request.headers.get('x-sitzung');
  if (!token) return false;
  const treffer = await env.DATEN.get('sitzung:' + token);
  return treffer === '1';
}

export async function onRequest(context) {
  const { request, env, params } = context;
  const teile = (Array.isArray(params.pfad) ? params.pfad : [params.pfad]).filter(Boolean);
  const route = teile[0] || '';
  const methode = request.method;

  if (methode === 'OPTIONS') return new Response(null, { status: 204 });

  if (!env.DATEN) {
    return json({ fehler: 'KV-Namespace DATEN ist nicht verbunden. Bindings in den Cloudflare-Einstellungen prüfen.' }, 500);
  }

  /* ---------- Login ---------- */
  if (route === 'login' && methode === 'POST') {
    if (!env.ADMIN_PASSWORT) {
      return json({ fehler: 'ADMIN_PASSWORT ist nicht gesetzt.' }, 500);
    }
    let body = {};
    try { body = await request.json(); } catch (e) {}
    if (!gleich(String(body.passwort || ''), env.ADMIN_PASSWORT)) {
      await new Promise(r => setTimeout(r, 600)); // bremst Rateversuche
      return json({ fehler: 'Passwort stimmt nicht.' }, 401);
    }
    const token = crypto.randomUUID();
    await env.DATEN.put('sitzung:' + token, '1', { expirationTtl: SITZUNG_DAUER });
    return json({ token, gueltigBis: Date.now() + SITZUNG_DAUER * 1000 });
  }

  /* ---------- Angebote lesen ---------- */
  if (route === 'angebote' && methode === 'GET') {
    const roh = await env.DATEN.get('angebote');
    return new Response(roh || '[]', {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=30'
      }
    });
  }

  /* ---------- Angebote speichern ---------- */
  if (route === 'angebote' && (methode === 'PUT' || methode === 'POST')) {
    if (!await sitzungGueltig(request, env)) {
      return json({ fehler: 'Nicht angemeldet oder Sitzung abgelaufen.' }, 401);
    }
    let liste;
    try { liste = await request.json(); } catch (e) {
      return json({ fehler: 'Ungültige Daten.' }, 400);
    }
    if (!Array.isArray(liste)) return json({ fehler: 'Erwartet wird eine Liste.' }, 400);

    await env.DATEN.put('angebote', JSON.stringify(liste));
    return json({ ok: true, anzahl: liste.length });
  }

  /* ---------- Bild hochladen ---------- */
  if (route === 'bild' && methode === 'POST') {
    if (!await sitzungGueltig(request, env)) {
      return json({ fehler: 'Nicht angemeldet oder Sitzung abgelaufen.' }, 401);
    }
    const daten = await request.arrayBuffer();
    if (!daten.byteLength) return json({ fehler: 'Leere Datei.' }, 400);
    if (daten.byteLength > 20 * 1024 * 1024) return json({ fehler: 'Bild ist zu gross.' }, 413);

    const id = crypto.randomUUID().replace(/-/g, '').slice(0, 16);
    const typ = request.headers.get('content-type') || 'image/jpeg';
    await env.DATEN.put('bild:' + id, daten, { metadata: { typ } });
    return json({ url: '/api/bild/' + id });
  }

  /* ---------- Bild ausliefern ---------- */
  if (route === 'bild' && methode === 'GET' && teile[1]) {
    const { value, metadata } = await env.DATEN.getWithMetadata('bild:' + teile[1], { type: 'arrayBuffer' });
    if (!value) return new Response('Nicht gefunden', { status: 404 });
    return new Response(value, {
      headers: {
        'Content-Type': (metadata && metadata.typ) || 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  }

  return json({ fehler: 'Unbekannter Endpunkt.' }, 404);
}
