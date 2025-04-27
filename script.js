async function getIPInfo() {
    try {
      const res = await fetch('https://ipapi.co/json/');
      const data = await res.json();
  
      const ip = data.ip || "Unavailable";
      const city = data.city || "Unavailable";
      const country = data.country_name || "Unknown";
      const lat = data.latitude;
      const lon = data.longitude;
  
      document.getElementById('ip').textContent = ip;
      document.getElementById('city').textContent = city;
      document.getElementById('country').textContent = country;
  
      if (lat && lon) {
        initMap(lat, lon);
      } else {
        document.getElementById('map').innerHTML = "<p style='margin-top:20px;'>Location not available.</p>";
      }
    } catch (error) {
      console.error("Error fetching IP info:", error);
      document.getElementById('ip').textContent = "Error";
      document.getElementById('city').textContent = "Error";
      document.getElementById('country').textContent = "Error";
      document.getElementById('map').innerHTML = "<p style='margin-top:20px;'>Unable to load map.</p>";
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
  