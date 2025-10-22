# Fraud Alert Management Frontend

An Angular web application for managing fraud alerts in financial systems. This frontend provides a comprehensive interface for viewing, filtering, and managing fraud alerts through an intuitive dashboard and detailed alert management interface.

## Features

- **Dashboard with Pipeline Overview**: Visual representation of the fraud alert pipeline with key metrics
- **Alert Management**: List, filter, search, and bulk operations on fraud alerts
- **Alert Details**: Comprehensive view of individual alerts with customer, transaction, and risk information
- **Responsive Design**: Mobile-friendly interface built with Angular Material
- **Real-time Updates**: Integration with fraud alert management API

## Screenshots

### Dashboard
![Dashboard](https://github.com/user-attachments/assets/eaba7eff-85a2-40a3-af35-fcaaef6365ba)

### Alert List
![Alert List](https://github.com/user-attachments/assets/a548115c-b4de-43d1-ab2b-175bc478d226)

### Alert Details
![Alert Details](https://github.com/user-attachments/assets/c2b6ff2c-6cc2-4c92-a4c4-27eab1f046db)

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd fraud-alert-management-front
```

2. Install dependencies:
```bash
npm install
```

3. Configure the backend API endpoint (optional):
```bash
# Set the API URL environment variable
export API_URL=https://your-api-endpoint.com/v1
```

4. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:4200`.

## Configuration

### Environment Variables

The application supports runtime configuration through environment variables:

- `API_URL`: Backend API endpoint URL (default: `http://localhost:8080/v1`)

### Setting Environment Variables

#### Development
```bash
# For development
export API_URL=http://localhost:8080/v1
npm start
```

#### Production
For production deployments, you can set environment variables through your deployment platform or by modifying the `window.env` object in the browser.

## API Integration

The application integrates with the Fraud Alert Management API and supports all operations defined in the OpenAPI specification:

- **GET /alerts**: List and filter alerts
- **GET /alerts/{id}**: Get alert details
- **PATCH /alerts/{id}**: Update alert status and notes
- **PATCH /alerts/bulk**: Bulk update alerts
- **GET /alerts/stats**: Get alert statistics
- **GET /customers/{id}/alerts**: Get customer alert history
- **POST /alerts/{id}/notes**: Add notes to alerts

## Development

### Available Scripts

- `npm start`: Start development server
- `npm run build`: Build for production
- `npm run build:dev`: Build for development
- `npm test`: Run unit tests

### Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── dashboard/          # Main dashboard component
│   │   ├── alert-list/         # Alert listing and filtering
│   │   └── alert-detail/       # Individual alert details
│   ├── models/                 # TypeScript models
│   ├── services/               # API services
│   └── environments/           # Environment configurations
├── assets/                     # Static assets
└── styles.scss                # Global styles
```

### Component Overview

#### Dashboard Component
- Displays fraud pipeline overview cards
- Shows transaction summary table
- Displays alert statistics
- Responsive design matching the provided design

#### Alert List Component
- Paginated list of alerts
- Advanced filtering options (status, severity, customer, assignee)
- Bulk operations for alert management
- Sortable columns

#### Alert Detail Component
- Comprehensive alert information
- Customer and transaction details
- Risk factors and decision information
- Notes management
- Edit functionality

## Deployment

### Production Build

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Docker Deployment

```dockerfile
FROM nginx:alpine
COPY dist/fraud-alert-app /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
