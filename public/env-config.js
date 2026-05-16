// =========================================================================
// env-config.js — Runtime configuration loader
// =========================================================================
// This script reads /config.json (mounted from K8s Secret's "api-key" key)
// at page load time and sets window.__ENV__ for the React app to consume.
// The secret value is the raw API key (not JSON).
// =========================================================================
(function () {
  window.__ENV__ = window.__ENV__ || {};

  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/config.json', false); // synchronous — runs before React loads
  try {
    xhr.send(null);
    if (xhr.status === 200) {
      // The secret value is the raw API key (plain text), not JSON
      var apiKey = xhr.responseText.trim();
      if (apiKey && apiKey !== 'REPLACE_WITH_YOUR_KEY') {
        window.__ENV__.REACT_APP_OPENWEATHER_API_KEY = apiKey;
      }
    }
  } catch (e) {
    // config.json not found — will fall back to build-time env var or placeholder
  }
})();
