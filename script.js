const ipOutput = document.querySelector('#ip');
const familyLabel = document.querySelector('#family');
const hint = document.querySelector('#hint');
const copyButton = document.querySelector('#copy-btn');
let address = '';

async function loadAddress() {
  try {
    const response = await fetch('/api', { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error('Request failed');
    const data = await response.json();
    address = data.ip || '';
    ipOutput.textContent = address || 'Unavailable';
    familyLabel.textContent = data.version ? `IPv${data.version}` : 'Address unavailable';
    hint.textContent = data.version
      ? `This is the address used for your current ${data.version === 4 ? 'IPv4' : 'IPv6'} connection.`
      : 'No client IP address was available.';
    copyButton.disabled = !address;
  } catch {
    ipOutput.textContent = 'Unavailable';
    familyLabel.textContent = 'Connection error';
    hint.textContent = 'Could not retrieve your IP address. Refresh to try again.';
  }
}

copyButton.addEventListener('click', async () => {
  if (!address) return;
  try {
    await navigator.clipboard.writeText(address);
    copyButton.textContent = 'Copied';
    window.setTimeout(() => { copyButton.textContent = 'Copy'; }, 1300);
  } catch {
    copyButton.textContent = 'Copy failed';
    window.setTimeout(() => { copyButton.textContent = 'Copy'; }, 1300);
  }
});

loadAddress();
