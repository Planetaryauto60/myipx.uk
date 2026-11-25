const ip = document.querySelector('#ip');
const family = document.querySelector('#family');
const hint = document.querySelector('#hint');
const copyButton = document.querySelector('#copy-btn');
const exampleJson = document.querySelector('#example-json');

async function loadAddress() {
  try {
    const response = await fetch('/api', { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error('Request failed');
    const data = await response.json();
    ip.textContent = data.ip || 'Unavailable';
    family.textContent = data.version ? `IPv${data.version} · this connection` : 'Address unavailable';
    hint.textContent = data.ip
      ? 'Only the address family used for this connection is available here. The other family cannot be discovered from this request.'
      : 'No client IP address was available for this request.';
    copyButton.disabled = !data.ip;
    exampleJson.textContent = JSON.stringify(data, null, 2);
    copyButton.addEventListener('click', () => copy(data.ip, copyButton, 'Copy'));
  } catch {
    ip.textContent = 'Unable to load';
    family.textContent = 'Connection unavailable';
    hint.textContent = 'Please refresh to try again.';
  }
}

async function copy(value, button, label) {
  try {
    await navigator.clipboard.writeText(value);
    button.textContent = 'Copied';
    window.setTimeout(() => { button.textContent = label; }, 1400);
  } catch {
    button.textContent = 'Copy failed';
    window.setTimeout(() => { button.textContent = label; }, 1400);
  }
}

document.querySelector('#copy-command').addEventListener('click', (event) => {
  copy('curl https://myipx.uk/api', event.currentTarget, 'Copy');
});

loadAddress();
