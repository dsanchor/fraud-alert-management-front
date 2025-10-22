// This script allows runtime configuration of environment variables
// Set window.env before loading the Angular application
window.env = window.env || {};

// For production mode, leave API_URL empty to use the production environment default
// For development, you can set it to override the default
// window.env.API_URL = 'https://your-custom-api-url.com/v1';

// Debug logging
console.log('env.js loaded, window.env.API_URL:', window.env.API_URL);