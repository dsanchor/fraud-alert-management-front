# Docker Deployment Guide

This guide explains how to build and run the Angular app as a Docker container with environment variables.

## Files Created

- `Dockerfile` - Multi-stage Docker build
- `docker-entrypoint.sh` - Script to inject environment variables at runtime
- `nginx.conf` - Nginx configuration for serving the Angular app
- `.dockerignore` - Files to exclude from Docker build
- `.env.example` - Example environment variables

## Build the Docker Image

```bash
docker build -t fraud-alert-management-front:latest .
```

## Run the Container

### Option 1: Using environment variables directly

```bash
docker run -d \
  -p 8080:80 \
  -e API_URL=https://your-api-url.com \
  -e API_KEY=your-api-key \
  --name fraud-alert-app \
  fraud-alert-management-front:latest
```

### Option 2: Using an .env file

Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

Edit `.env` with your values:
```
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

### Option 3: Using default values

If you don't provide environment variables, it will use the defaults:
```bash
docker run -d -p 8080:80 --name fraud-alert-app fraud-alert-management-front:latest
```

## Access the Application

Open your browser and navigate to:
```
http://localhost:8080
```

## Docker Commands

### View logs
```bash
docker logs fraud-alert-app
```

### Stop the container
```bash
docker stop fraud-alert-app
```

### Start the container
```bash
docker start fraud-alert-app
```

### Remove the container
```bash
docker rm -f fraud-alert-app
```

### View environment variables in running container
```bash
docker exec fraud-alert-app cat /usr/share/nginx/html/assets/env.js
```

## Docker Compose (Optional)

Create a `docker-compose.yml`:

```yaml
version: '3.8'

services:
  fraud-alert-app:
    build: .
    ports:
      - "8080:80"
    environment:
      - API_URL=${API_URL:-https://msagthack-apim-w67osrehnuiak.azure-api.net}
      - API_KEY=${API_KEY:-16f5ef0a9dfd46faa023f13e28cb123b}
    restart: unless-stopped
```

Run with Docker Compose:
```bash
docker-compose up -d
```

## How It Works

1. **Build Stage**: The Dockerfile uses Node.js to build the Angular app
2. **Runtime Stage**: The built app is served by Nginx
3. **Environment Injection**: The `docker-entrypoint.sh` script creates `/assets/env.js` with the environment variables at container startup
4. **Angular Usage**: The app reads `window.env.API_URL` and `window.env.API_KEY` from the injected script

## Security Notes

⚠️ **Important**: 
- Never commit `.env` file to git (it's in `.gitignore`)
- Keep your API keys secure
- Use Docker secrets or Azure Key Vault in production
- The entrypoint script only shows first 10 characters of API_KEY in logs

## Pushing to Container Registry

### Docker Hub
```bash
docker tag fraud-alert-management-front:latest yourusername/fraud-alert-management-front:latest
docker push yourusername/fraud-alert-management-front:latest
```

### Azure Container Registry
```bash
# Login to ACR
az acr login --name yourregistry

# Tag and push
docker tag fraud-alert-management-front:latest yourregistry.azurecr.io/fraud-alert-management-front:latest
docker push yourregistry.azurecr.io/fraud-alert-management-front:latest
```

## Troubleshooting

### Check if environment variables are injected
```bash
docker exec fraud-alert-app cat /usr/share/nginx/html/assets/env.js
```

### Check Nginx logs
```bash
docker logs fraud-alert-app
```

### Access container shell
```bash
docker exec -it fraud-alert-app sh
```

### Rebuild without cache
```bash
docker build --no-cache -t fraud-alert-management-front:latest .
```
