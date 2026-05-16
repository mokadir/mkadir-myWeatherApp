// =========================================================================
// env-config.js — Runtime configuration loader
// =========================================================================
// This script reads /config.json (mounted from K8s Secret/ConfigMap)
// at page load time and sets window.__ENV__ for the React app to consume.
// This avoids baking secrets into the Docker image.
// =========================================================================
(function () {
  window.__ENV__ = window.__ENV__ || {};

  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/config.json', false); // synchronous — runs before React loads
  try {
    xhr.send(null);
    if (xhr.status === 200) {
      var config = JSON.parse(xhr.responseText);
      if (config.REACT_APP_OPENWEATHER_API_KEY) {
        window.__ENV__.REACT_APP_OPENWEATHER_API_KEY = config.REACT_APP_OPENWEATHER_API_KEY;
      }
    }
  } catch (e) {
    // config.json not found — will fall back to build-time env var or placeholder
  }
})();
