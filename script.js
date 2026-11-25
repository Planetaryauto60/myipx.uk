const ipFields = {
  ipv4: { output: document.querySelector('#ipv4'), state: document.querySelector('#ipv4-state') },
  ipv6: { output: document.querySelector('#ipv6'), state: document.querySelector('#ipv6-state') },
};

function showAddress(version, value, state) {
  const field = ipFields[version];
  field.output.textContent = value || 'Unavailable';
  field.state.textContent = state;
  document.querySelector(`[data-address="${version}"]`).disabled = !value;
  field.value = value || '';
}

async function checkFamily(version) {
  const endpoint = version === 'ipv4' ? 'https://api.ipify.org?format=json' : 'https://api6.ipify.org?format=json';
  try {
    const response = await fetch(endpoint, { cache: 'no-store' });
    if (!response.ok) throw new Error('Address family is unavailable');
    const data = await response.json();
    if (!data.ip) throw new Error('No address returned');
    showAddress(version, data.ip, 'Available');
  } catch {
    showAddress(version, '', 'Not available');
  }
}

async function loadDetails() {
  const values = {
    country: 'country',
    region: 'region',
    city: 'city',
    network: 'organization',
    asn: 'asn',
    colo: 'dataCenter',
    timezone: 'timezone',
  };
  try {
    const response = await fetch('/api', { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error('Request failed');
    const data = await response.json();
    const location = data.location || {};
    const network = data.network || {};
    const countryName = location.country && typeof Intl.DisplayNames === 'function'
      ? new Intl.DisplayNames(['en'], { type: 'region' }).of(location.country)
      : location.country;
    document.querySelector('#country').textContent = location.countryName || countryName || 'Unavailable';
    document.querySelector('#country-code').textContent = location.country || '';
    for (const [elementId, key] of Object.entries(values)) {
      const value = elementId === 'asn' && network.asn ? `AS${network.asn}` : (elementId === 'network' || elementId === 'colo' ? network[key] : location[key]);
      document.querySelector(`#${elementId}`).textContent = value || 'Unavailable';
    }
  } catch {
    for (const id of ['country', 'region', 'city', 'network', 'asn', 'colo', 'timezone']) {
      document.querySelector(`#${id}`).textContent = 'Unavailable';
    }
  }
}

document.querySelectorAll('.copy-btn').forEach((button) => {
  button.addEventListener('click', async () => {
    const value = ipFields[button.dataset.address].value;
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      button.textContent = 'Copied';
    } catch {
      button.textContent = 'Failed';
    }
    window.setTimeout(() => { button.textContent = 'Copy'; }, 1300);
  });
});

loadDetails();
checkFamily('ipv4');
checkFamily('ipv6');
