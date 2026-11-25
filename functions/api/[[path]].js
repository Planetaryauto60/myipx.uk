function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store, private',
      'Access-Control-Allow-Origin': '*',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

export async function onRequest({ request }) {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return json({ error: 'Method not allowed' }, 405);
  }

  const rawAddress = request.headers.get('CF-Connecting-IP');
  const cf = request.cf || {};
  if (!rawAddress) {
    return json({ ip: null, ipv4: null, ipv6: null, version: null, location: null, network: null });
  }

  // Cloudflare supplies the address of the client connection reaching this Worker.
  const version = rawAddress.includes(':') ? 6 : 4;

  return json({
    ip: rawAddress,
    ipv4: version === 4 ? rawAddress : null,
    ipv6: version === 6 ? rawAddress : null,
    version,
    location: {
      city: cf.city ?? null,
      region: cf.region ?? null,
      country: cf.country ?? null,
      countryName: cf.countryName ?? null,
      latitude: cf.latitude ?? null,
      longitude: cf.longitude ?? null,
      timezone: cf.timezone ?? null,
    },
    network: {
      asn: cf.asn ?? null,
      organization: cf.asOrganization ?? null,
      dataCenter: cf.colo ?? null,
    },
  });
}
