// Launch-time server function for The Salon Sanctuary's on-site booking.
// NOT DEPLOYED AND NOT TESTED: written against Square's documented Bookings
// API, to be finished and tested against the salon's own Square account.
//
// Needs (set on the host, never in the repo):
//   SQUARE_ACCESS_TOKEN   the salon's Square access token
//   SQUARE_LOCATION_ID    their Square location
// and SERVICE_MAP below filled in: menu id -> Square service variation id
// (+ version), and STAFF_MAP: stylist name -> Square team member id.
//
// Checked against Square's Bookings API docs (Nov 2026): the availability
// window must be 24 hours to 31 days, and the customer must have a phone number.
// Square endpoints used:
//   POST /v2/bookings/availability/search   free start times
//   POST /v2/customers/search, /v2/customers  find or create the client
//   POST /v2/bookings                        create the booking
//
// Shape: a standard fetch handler (Cloudflare Workers / Netlify / Vercel edge).

const API = 'https://connect.squareup.com/v2';
const SERVICE_MAP = { /* 's:19928311': { id: 'SQUARE_VARIATION_ID', version: 1 }, ... */ };
const STAFF_MAP = { /* Ashley: 'TEAM_MEMBER_ID', Macie: 'TEAM_MEMBER_ID' */ };
const TZ = 'Europe/London';

async function square(env, path, body) {
  const res = await fetch(`${API}${path}`, {
    method: 'POST',
    // Add a 'Square-Version' header pinned to the current version in Square's docs before launch.
    headers: { Authorization: `Bearer ${env.SQUARE_ACCESS_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.errors?.[0]?.detail || 'Square error');
  return json;
}

// Europe/London wall-clock date + time to an RFC 3339 instant (handles BST).
function londonInstant(date, time) {
  const guess = new Date(`${date}T${time}:00Z`);
  const shown = new Date(guess.toLocaleString('en-US', { timeZone: TZ }));
  return new Date(guess.getTime() - (shown.getTime() - guess.getTime())).toISOString();
}

// Square needs a search window of 24 hours to 31 days, so search the whole
// London day (midnight to midnight) and keep that day's slots.
async function dayAvailability(env, date, svc, staff) {
  const from = londonInstant(date, '00:00');
  const to = new Date(Date.parse(from) + 24 * 3600 * 1000).toISOString();
  const out = await square(env, '/bookings/availability/search', {
    query: { filter: { location_id: env.SQUARE_LOCATION_ID, start_at_range: { start_at: from, end_at: to }, segment_filters: [{ service_variation_id: svc.id, ...staff }] } },
  });
  return out.availabilities || [];
}

export default {
  async fetch(request, env) {
    const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { 'content-type': 'application/json' } });
    if (request.method !== 'POST') return json({ error: 'POST only' }, 405);
    const path = new URL(request.url).pathname.split('/').pop();
    const r = await request.json();
    const svc = SERVICE_MAP[r.serviceId];
    if (!svc) return json({ error: 'This service can only be booked by phone' }, 400);
    const staff = r.staff && STAFF_MAP[r.staff] ? { team_member_id_filter: { any: [STAFF_MAP[r.staff]] } } : {};
    try {
      if (path === 'availability') {
        const day = await dayAvailability(env, r.date, svc, staff);
        const times = day.map((a) => new Date(a.start_at).toLocaleTimeString('en-GB', { timeZone: TZ, hour: '2-digit', minute: '2-digit' }));
        return json({ times: [...new Set(times)] });
      }
      if (path === 'book') {
        const c = r.customer;
        const found = await square(env, '/customers/search', { query: { filter: { email_address: { exact: c.email } } } });
        let customerId = found.customers?.[0]?.id;
        if (!customerId) {
          const [given, ...rest] = c.name.trim().split(/\s+/);
          customerId = (await square(env, '/customers', { given_name: given, family_name: rest.join(' '), email_address: c.email, phone_number: c.phone, idempotency_key: crypto.randomUUID() })).customer.id;
        }
        const start = londonInstant(r.date, r.time);
        // pick the team member Square offered for this slot
        const slot = (await dayAvailability(env, r.date, svc, staff)).find((a) => Date.parse(a.start_at) === Date.parse(start));
        const seg = slot?.appointment_segments?.[0];
        if (!seg) return json({ error: 'That time has just gone. Please pick another.' }, 409);
        const out = await square(env, '/bookings', {
          idempotency_key: crypto.randomUUID(),
          booking: {
            location_id: env.SQUARE_LOCATION_ID, start_at: start, customer_id: customerId, customer_note: c.note || undefined,
            appointment_segments: [{ service_variation_id: svc.id, service_variation_version: svc.version, team_member_id: seg.team_member_id, duration_minutes: seg.duration_minutes }],
          },
        });
        return json({ ref: out.booking.id });
      }
      return json({ error: 'Not found' }, 404);
    } catch (e) {
      return json({ error: e.message }, 502);
    }
  },
};
