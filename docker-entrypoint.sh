#!/bin/sh

# Create env.js file with environment variables
mkdir -p /usr/share/nginx/html/assets
cat <<EOF > /usr/share/nginx/html/assets/env.js
(function (window) {
  window.env = window.env || {};
  window.env.API_URL = '${API_URL:-http://localhost:8080}';
  window.env.API_KEY = '${API_KEY:-apikey}';
}(this));
EOF

echo "Environment variables injected into env.js"
echo "API_URL: ${API_URL:-http://localhost:8080}"
echo "API_KEY: ${API_KEY:0:10}..." # Only show first 10 chars for security

# Execute the CMD
exec "$@"
