import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [html, script, api] = await Promise.all([
  readFile(new URL('../index.html', import.meta.url), 'utf8'),
  readFile(new URL('../script.js', import.meta.url), 'utf8'),
  readFile(new URL('../functions/api/[[path]].js', import.meta.url), 'utf8'),
]);

test('page contains the live IP, family label, copy control, and API link', () => {
  assert.match(html, /id="ip"/);
  assert.match(html, /id="family"/);
  assert.match(html, /id="copy-btn"/);
  assert.match(html, /href="\/api"/);
});

test('page uses a dark theme and contains no promotional sections', async () => {
  const css = await readFile(new URL('../style.css', import.meta.url), 'utf8');
  assert.match(html, /theme-color" content="#111315"/);
  assert.match(css, /color-scheme:dark/);
  assert.doesNotMatch(html, /FOR THE TERMINAL|A little clarity|Small, useful/i);
});

test('page assets are local and do not load third-party resources', () => {
  assert.doesNotMatch(html, /<(?:script|link)[^>]+https?:\/\//i);
  assert.doesNotMatch(script, /fetch\(['"]https?:\/\//i);
});

test('API response does not expose location, user-agent, or request-time data', () => {
  assert.doesNotMatch(api, /userAgent|timestamp|latitude|longitude|country|city/i);
});
