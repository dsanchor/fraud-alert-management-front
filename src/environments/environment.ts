export const environment = {
  production: false,
  apiUrl: (window as any)?.env?.API_URL || 'http://localhost:8080/v1',
  apiKey: (window as any)?.env?.API_KEY || ''
};