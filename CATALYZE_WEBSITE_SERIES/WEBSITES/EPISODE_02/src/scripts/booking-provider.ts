// Where bookings go. The site's booking panel talks only to this interface,
// so the salon's booking system can change without touching the page.
//
// "demo"   : the concept. Sample times are worked out from the salon's real
//            opening hours and the service length. Nothing is sent anywhere
//            and no appointment is made. The panel says so.
// "square" : launch. Calls the salon's own server function
//            (server/square-booking.mjs), which holds the Square access token
//            and talks to Square's Bookings API. Never call Square from the
//            browser: the token must stay on the server.

export type Day = { day: string; open?: string; close?: string; closed?: boolean };
export type Req = { serviceId: string; mins: number; date: string; staff: string | null; noSaturday?: boolean };
export type Customer = { name: string; phone: string; email: string; note: string };
export type Booked = { ref: string };
export interface Provider {
  demo: boolean;
  times(r: Req): Promise<string[]>;
  book(r: Req & { time: string; customer: Customer }): Promise<Booked>;
}

const toMin = (t: string) => +t.slice(0, 2) * 60 + +t.slice(3, 5);
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

export function londonToday(tz: string) {
  const p = new Intl.DateTimeFormat('en-GB', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
  const g = (t: string) => p.find((x) => x.type === t)!.value;
  return { date: `${g('year')}-${g('month')}-${g('day')}`, mins: (+g('hour') % 24) * 60 + +g('minute') };
}
// Europe/London wall-clock date + time to a UTC Date (handles BST).
export function londonToUtc(date: string, time: string, tz = 'Europe/London') {
  const guess = new Date(`${date}T${time}:00Z`);
  const shown = new Date(guess.toLocaleString('en-US', { timeZone: tz }));
  return new Date(guess.getTime() - (shown.getTime() - guess.getTime()));
}
export const weekday = (date: string) => new Date(`${date}T12:00:00Z`).toLocaleDateString('en-GB', { weekday: 'long', timeZone: 'UTC' });

export function demoProvider(week: Day[], tz: string): Provider {
  return {
    demo: true,
    async times(r) {
      const d = week.find((x) => x.day === weekday(r.date));
      if (!d || d.closed) return [];
      if (r.noSaturday && d.day === 'Saturday') return [];
      const open = toMin(d.open!), close = toMin(d.close!);
      const now = londonToday(tz);
      const earliest = r.date === now.date ? now.mins + 60 : 0;
      const out: string[] = [];
      for (let m = open; m + r.mins <= close; m += 30) if (m >= earliest) out.push(hm(m));
      return out;
    },
    async book() {
      await new Promise((res) => setTimeout(res, 700));
      return { ref: 'DEMO' };
    },
  };
}

export function squareProvider(endpoint: string): Provider {
  const post = async (path: string, body: unknown) => {
    const res = await fetch(`${endpoint}/${path}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
    if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Booking service unavailable');
    return res.json();
  };
  return {
    demo: false,
    async times(r) { return (await post('availability', r)).times as string[]; },
    async book(r) { return (await post('book', r)) as Booked; },
  };
}
