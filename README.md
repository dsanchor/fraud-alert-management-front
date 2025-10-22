# Fraud Alert Management Frontend

An Angular web application for managing fraud alerts in financial systems. This frontend provides a comprehensive interface for viewing, filtering, and managing fraud alerts through an intuitive dashboard and detailed alert management interface.

## Features

- **Dashboard with Pipeline Overview**: Visual representation of the fraud alert pipeline with key metrics
- **Alert Management**: List, filter, search, and bulk operations on fraud alerts
- **Alert Details**: Comprehensive view of individual alerts with customer, transaction, and risk information
- **Responsive Design**: Mobile-friendly interface built with Angular Material
- **Real-time Updates**: Integration with fraud alert management API

## Getting Started

### Prerequisites

- Node.js (version 22 or higher)
- npm (comes with Node.js)
- Docker (optional, for containerized deployment)

## Running Locally

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

3. Configure environment variables (optional):

Create a `.env` file in the root directory (copy from `.env.example`):
```bash
cp .env.example .env
```

Edit `.env` with your values:
```env
API_URL=https://your-api-url.com
API_KEY=your-api-key
```

4. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:4200`.

### Available Scripts

- `npm start`: Start development server
- `npm run build`: Build for production
- `npm run build:dev`: Build for development
- `npm test`: Run unit tests

## Running with Docker

### Build the Docker Image

```bash
docker build -t fraud-alert-management-front:latest .
```

### Run the Container

#### Option 1: Using environment variables directly

```bash
docker run -d \
  -p 8080:80 \
  -e API_URL=https://your-api-url.com \
  -e API_KEY=your-api-key \
  --name fraud-alert-app \
  fraud-alert-management-front:latest
```

#### Option 2: Using an .env file

Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

Edit `.env` with your values:
```env
API_URL=https://your-api-url.com
API_KEY=your-api-key
```

Run with the .env file:
```bash
docker run -d \
  -p 8080:80 \
  --env-file .env \
  --name fraud-alert-app \
  fraud-alert-management-front:latest
```

#### Option 3: Using Docker Compose

Create a `docker-compose.yml`:

```yaml
version: '3.8'

services:
  fraud-alert-app:
    build: .
    ports:
      - "8080:80"
    env_file:
      - .env
    restart: unless-stopped
```

Run with Docker Compose:
```bash
docker-compose up -d
```

### Access the Application

Open your browser and navigate to:
```
http://localhost:8080
```

### Docker Commands

#### View logs
```bash
docker logs fraud-alert-app
```

#### Stop the container
```bash
docker stop fraud-alert-app
```

#### Start the container
```bash
docker start fraud-alert-app
```

#### Remove the container
```bash
docker rm -f fraud-alert-app
```

#### View environment variables in running container
```bash
docker exec fraud-alert-app cat /usr/share/nginx/html/assets/env.js
```

## Configuration

### Environment Variables

The application supports runtime configuration through environment variables:

- `API_URL`: Backend API endpoint URL (default: `http://localhost:8080/v1`)
- `API_KEY`: API subscription key for authentication

### How Environment Variables Work

1. **Build Stage**: The Dockerfile uses Node.js to build the Angular app
2. **Runtime Stage**: The built app is served by Nginx
3. **Environment Injection**: The `docker-entrypoint.sh` script creates `/assets/env.js` with the environment variables at container startup
4. **Angular Usage**: The app reads `window.env.API_URL` and `window.env.API_KEY` from the injected script

## API Integration

The application integrates with the Fraud Alert Management API and supports all operations defined in the OpenAPI specification.

**API Source Code**: [fraud-alert-management-api](https://github.com/dsanchor/fraud-alert-management-api)

### Supported Operations

- **GET /alerts**: List and filter alerts
- **GET /alerts/{id}**: Get alert details
- **PATCH /alerts/{id}**: Update alert status and notes
- **PATCH /alerts/bulk**: Bulk update alerts
- **GET /alerts/stats**: Get alert statistics
- **GET /customers/{id}/alerts**: Get customer alert history
- **POST /alerts/{id}/notes**: Add notes to alerts

## Project Structure

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

### CI/CD with GitHub Actions

The project includes a GitHub Actions workflow that automatically builds and pushes Docker images to GitHub Container Registry (ghcr.io) on every push to the main branch.

#### What the Workflow Does

- Builds the Docker image on push to `main` branch or when a version tag is created
- Pushes the image to GitHub Container Registry (ghcr.io)
- Creates multiple tags:
  - `latest` for main branch
  - `v1.0.0`, `v1.0`, `v1` for version tags
  - `main-<sha>` for specific commits
- Supports multi-platform builds (amd64, arm64)
- Caches layers for faster builds

#### Using the Pre-built Image

Pull and run the latest image from GitHub Container Registry:

```bash
# Pull the image
docker pull ghcr.io/dsanchor/fraud-alert-management-front:latest

# Run the container
docker run -d \
  -p 8080:80 \
  -e API_URL=https://your-api-url.com \
  -e API_KEY=your-api-key \
  --name fraud-alert-app \
  ghcr.io/dsanchor/fraud-alert-management-front:latest
```

Or use a specific version:
```bash
docker pull ghcr.io/dsanchor/fraud-alert-management-front:v1.0.0
```

#### Creating a Release

To trigger a versioned build:

```bash
# Create and push a tag
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

This will create images with tags: `v1.0.0`, `v1.0`, `v1`, and `latest`

### Manual Container Registry Push

#### GitHub Container Registry

```bash
# Login to GitHub Container Registry
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# Tag and push
docker tag fraud-alert-management-front:latest ghcr.io/dsanchor/fraud-alert-management-front:latest
docker push ghcr.io/dsanchor/fraud-alert-management-front:latest
```

#### Docker Hub
```bash
docker tag fraud-alert-management-front:latest yourusername/fraud-alert-management-front:latest
docker push yourusername/fraud-alert-management-front:latest
```

#### Azure Container Registry
```bash
# Login to ACR
az acr login --name yourregistry

# Tag and push
docker tag fraud-alert-management-front:latest yourregistry.azurecr.io/fraud-alert-management-front:latest
docker push yourregistry.azurecr.io/fraud-alert-management-front:latest
```

## Troubleshooting

### Docker Issues

#### Check if environment variables are injected
```bash
docker exec fraud-alert-app cat /usr/share/nginx/html/assets/env.js
```

#### Check Nginx logs
```bash
docker logs fraud-alert-app
```

#### Access container shell
```bash
docker exec -it fraud-alert-app sh
```

#### Rebuild without cache
```bash
docker build --no-cache -t fraud-alert-management-front:latest .
```

## Security Notes

⚠️ **Important**: 
- Never commit `.env` file to git (it's in `.gitignore`)
- Keep your API keys secure
- Use Docker secrets or Azure Key Vault in production
- The entrypoint script only shows first 10 characters of API_KEY in logs

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
