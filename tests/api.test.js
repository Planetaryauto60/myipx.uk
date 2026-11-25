import test from 'node:test';
import assert from 'node:assert/strict';
import { onRequest } from '../functions/api/[[path]].js';

function context({ method = 'GET', ip } = {}) {
  const headers = new Headers();
  if (ip !== undefined) headers.set('CF-Connecting-IP', ip);
  return { request: new Request('https://myipx.uk/api', { method, headers }) };
}

test('returns the connecting IPv4 address and only the matching family field', async () => {
  const response = await onRequest(context({ ip: '203.0.113.42' }));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    ip: '203.0.113.42', ipv4: '203.0.113.42', ipv6: null, version: 4,
  });
});

test('returns the connecting IPv6 address and only the matching family field', async () => {
  const address = '2001:db8:abcd::1';
  const response = await onRequest(context({ ip: address }));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    ip: address, ipv4: null, ipv6: address, version: 6,
  });
});

test('returns null fields when the client address header is missing', async () => {
  const response = await onRequest(context());
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    ip: null, ipv4: null, ipv6: null, version: null,
  });
});

test('sets JSON, no-store, and cross-origin API headers', async () => {
  const response = await onRequest(context({ ip: '203.0.113.42' }));
  assert.match(response.headers.get('Content-Type'), /application\/json/i);
  assert.match(response.headers.get('Cache-Control'), /no-store/i);
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), '*');
  assert.equal(response.headers.get('X-Content-Type-Options'), 'nosniff');
});

test('rejects methods other than GET and HEAD', async () => {
  const response = await onRequest(context({ method: 'POST', ip: '203.0.113.42' }));
  assert.equal(response.status, 405);
  assert.deepEqual(await response.json(), { error: 'Method not allowed' });
});
