import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [html, script, api] = await Promise.all([
  readFile(new URL('../index.html', import.meta.url), 'utf8'),
  readFile(new URL('../script.js', import.meta.url), 'utf8'),
  readFile(new URL('../functions/api/[[path]].js', import.meta.url), 'utf8'),
]);

test('page contains separate IPv4 and IPv6 results with copy controls and API link', () => {
  assert.match(html, /id="ipv4"/);
  assert.match(html, /id="ipv6"/);
  assert.match(html, /data-address="ipv4"/);
  assert.match(html, /data-address="ipv6"/);
  assert.match(html, /href="\/api"/);
});

test('page uses a dark theme and contains no promotional sections', async () => {
  const css = await readFile(new URL('../style.css', import.meta.url), 'utf8');
  assert.match(html, /theme-color" content="#111315"/);
  assert.match(css, /color-scheme:dark/);
  assert.doesNotMatch(html, /FOR THE TERMINAL|A little clarity|Small, useful/i);
});

test('page assets are local and external IP checks use only ipify', () => {
  assert.doesNotMatch(html, /<(?:script|link)[^>]+https?:\/\//i);
  assert.match(script, /https:\/\/api\.ipify\.org\?format=json/);
  assert.match(script, /https:\/\/api6\.ipify\.org\?format=json/);
  assert.equal((script.match(/https?:\/\//g) || []).length, 2);
});

test('API response does not expose user-agent or request-time data', () => {
  assert.doesNotMatch(api, /userAgent|timestamp/i);
});
