async function getIPInfo() {
    try {
      const res = await fetch('https://www.cloudflare.com/cdn-cgi/trace');
      const text = await res.text();
      const data = Object.fromEntries(
        text.trim().split('\n').map(line => line.split('='))
      );
  
      const ip = data.ip;
      const loc = data.loc || ""; // location like "latitude,longitude"
      const city = data.city || "Unknown";
      const country = data.country || "Unknown";
  
      document.getElementById('ip').textContent = ip;
      document.getElementById('city').textContent = city;
      document.getElementById('country').textContent = country;
  
      if (loc) {
        const [lat, lon] = loc.split(',');
        initMap(lat, lon);
      } else {
        document.getElementById('map').innerHTML = "<p style='margin-top:20px;'>Location not available.</p>";
      }
    } catch (error) {
      console.error("Error fetching IP info:", error);
    }
  }
  
  function initMap(lat, lon) {
    const map = L.map('map').setView([lat, lon], 10);
  
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);
  
    L.marker([lat, lon]).addTo(map)
      .bindPopup('You are approximately here.')
      .openPopup();
  }
  
  getIPInfo();
  