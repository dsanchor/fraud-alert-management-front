export const environment = {
  production: true,
  apiUrl: (window as any)?.env?.API_URL || 'http://localhost:8080/v1',
  apiKey: (window as any)?.env?.API_KEY || ''
}