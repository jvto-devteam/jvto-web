export function parseNL(q: string) {
  const s = q.toLowerCase();
  const origin = /(from|start(ing)? in) (surabaya|bali|yogyakarta)/.exec(s)?.[3];
  const end = /(to|end|finish) (surabaya|bali|yogyakarta)/.exec(s)?.[2];
  const dur = /(\b(\d)\s*(d|day(s)?))|(\b(\d)D(\d)N)/.exec(s);
  const durationDays = dur ? (dur[2] ? Number(dur[2]) : Number(dur[6])) : undefined;
  const physicality = /(easy|moderate|challenging)/.exec(s)?.[1];
  const privateTour = /(private|own car|dedicated)/.test(s) || true; // default true
  const pax = /(for|\b)(\d{1,2})\s*(people|pax)/.exec(s)?.[2];
  const destinations = ["bromo","ijen","tumpak sewu","madakaripura", "papuma"].filter(d => s.includes(d.replace(' ', '')));
  return { origin, end, durationDays, physicality, private: privateTour, pax: pax ? Number(pax) : undefined, destinations };
}
