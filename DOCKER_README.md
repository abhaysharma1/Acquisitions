# Acquisitions App - Docker Setup with Neon Database

This project provides a complete Docker setup for the Acquisitions application with different configurations for development and production environments using Neon Database.

## 🏗️ Architecture Overview

- **Development**: Uses Neon Local proxy for ephemeral database branches
- **Production**: Connects directly to Neon Cloud Database
- **Application**: Node.js Express app with Drizzle ORM

## 📋 Prerequisites

1. **Docker & Docker Compose** installed
2. **Neon Account** with:
   - API Key
   - Project ID
   - Branch ID (for production) or Parent Branch ID (for dev)

## 🔧 Environment Setup

### 1. Configure Neon Credentials

Update your environment files with actual Neon credentials:

#### `.env.development`
```bash
# Neon Local Configuration
NEON_API_KEY=your_actual_neon_api_key
NEON_PROJECT_ID=your_actual_neon_project_id
PARENT_BRANCH_ID=your_parent_branch_id

# Other configs remain the same
JWT_SECRET=your_jwt_secret
ARCJET_KEY=your_arcjet_key
```

#### `.env.production`
```bash
# Use your actual Neon Cloud Database URL
DATABASE_URL=postgresql://username:password@ep-xxx-pooler.region.aws.neon.tech/database?sslmode=require

# Production secrets
JWT_SECRET=your_production_jwt_secret
ARCJET_KEY=your_production_arcjet_key
```

### 2. Get Neon Credentials

1. **API Key**: Go to [Neon Console](https://console.neon.tech) → Account Settings → API Keys
2. **Project ID**: Found in Project Settings → General
3. **Branch ID**: Found in your project's Branches tab

## 🚀 Development Environment

### Quick Start
```bash
# Start development environment with Neon Local
npm run docker:dev
```

### What happens:
- ✅ Spins up Neon Local proxy container
- ✅ Creates ephemeral database branch
- ✅ Builds and starts your app
- ✅ App connects to local Postgres endpoint
- ✅ Hot reload enabled for development

### Manual Commands
```bash
# Start with build
docker-compose -f docker-compose.dev.yml --env-file .env.development up --build

# Start without rebuild
docker-compose -f docker-compose.dev.yml --env-file .env.development up

# View logs
npm run docker:logs:dev

# Stop and cleanup
npm run docker:dev:down
```

### Development Features
- **Ephemeral Branches**: Fresh database for each container start
- **Auto-cleanup**: Database branch deleted when container stops
- **Hot Reload**: Code changes reflected without restart
- **Debug Logging**: Enhanced logging for development

## 🏭 Production Environment

### Quick Start
```bash
# Deploy to production
npm run docker:prod
```

### What happens:
- ✅ Builds optimized production image
- ✅ Connects directly to Neon Cloud
- ✅ Runs with production configurations
- ✅ Includes health checks and resource limits

### Manual Commands
```bash
# Production deployment
docker-compose -f docker-compose.prod.yml --env-file .env.production up --build -d

# View logs
npm run docker:logs:prod

# Stop production
npm run docker:prod:down
```

### Production Features
- **Multi-stage Build**: Optimized Docker image
- **Health Checks**: Automatic container health monitoring
- **Resource Limits**: CPU and memory constraints
- **Security**: Non-root user execution
- **Auto-restart**: Container restarts on failure

## 🛠️ Available Scripts

| Script | Description |
|--------|-------------|
| `npm run docker:dev` | Start development environment |
| `npm run docker:dev:down` | Stop development and cleanup volumes |
| `npm run docker:prod` | Start production environment |
| `npm run docker:prod:down` | Stop production environment |
| `npm run docker:build` | Build Docker image manually |
| `npm run docker:logs:dev` | Follow development logs |
| `npm run docker:logs:prod` | Follow production logs |

## 🔍 Troubleshooting

### Development Issues

**Neon Local not connecting:**
```bash
# Check if Neon Local is healthy
docker-compose -f docker-compose.dev.yml ps

# View Neon Local logs
docker-compose -f docker-compose.dev.yml logs neon-local

# Verify environment variables
docker-compose -f docker-compose.dev.yml config
```

**Database connection issues:**
- Verify your `NEON_API_KEY`, `NEON_PROJECT_ID`, and `PARENT_BRANCH_ID`
- Check if your API key has sufficient permissions
- Ensure the parent branch exists

### Production Issues

**App won't start:**
```bash
# Check container status
docker-compose -f docker-compose.prod.yml ps

# View detailed logs
docker-compose -f docker-compose.prod.yml logs app

# Check environment variables
docker-compose -f docker-compose.prod.yml config
```

**Database connection fails:**
- Verify your production `DATABASE_URL` is correct
- Check Neon Cloud database is accessible
- Ensure network connectivity from your deployment environment

## 📊 Monitoring & Health Checks

### Development
- Neon Local health check on PostgreSQL port 5432
- App runs on port 3000 with development logging

### Production
- HTTP health check endpoint `/health` (you may need to implement this)
- Resource monitoring with limits
- Automatic restart policies

## 🔐 Security Considerations

### Environment Variables
- Never commit actual secrets to version control
- Use environment-specific files (`.env.development`, `.env.production`)
- In production, use secure secret management (Docker Secrets, Kubernetes Secrets, etc.)

### Network Security
- Development: Containers communicate via internal Docker network
- Production: Consider using reverse proxy (nginx) for SSL termination

## 🚢 Deployment Options

### Docker Swarm
```bash
# Deploy as a stack
docker stack deploy -c docker-compose.prod.yml acquisitions-stack
```

### Kubernetes
Convert Docker Compose to Kubernetes manifests:
```bash
# Using kompose
kompose convert -f docker-compose.prod.yml
```

### Cloud Platforms
- **AWS**: Use ECS with the production compose file
- **Google Cloud**: Deploy to Cloud Run
- **Azure**: Use Container Instances

## 📝 Database Operations

### Development (Neon Local)
```bash
# Generate migrations
npm run db:generate

# Run migrations against Neon Local
npm run db:migrate

# Access database studio
npm run db:studio
```

### Production
```bash
# Connect to production container
docker-compose -f docker-compose.prod.yml exec app sh

# Run migrations in production container
npm run db:migrate
```

## 🔄 Environment Switching

The application automatically uses the correct database based on the compose file:

- **Development**: `docker-compose.dev.yml` → Neon Local (`neon-local:5432`)
- **Production**: `docker-compose.prod.yml` → Neon Cloud (from `DATABASE_URL`)

## 📈 Scaling

### Horizontal Scaling
```bash
# Scale app service (production)
docker-compose -f docker-compose.prod.yml up --scale app=3
```

### Load Balancing
Add a reverse proxy service to your production compose file for load balancing multiple app instances.

---

## 🆘 Support

For issues related to:
- **Neon Database**: [Neon Documentation](https://neon.com/docs)
- **Docker**: [Docker Documentation](https://docs.docker.com)
- **Application**: Check the main project README.md

---

**Happy Dockerizing! 🐳**