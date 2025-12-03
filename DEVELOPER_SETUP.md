# Developer Setup Guide

This guide provides detailed instructions for setting up a local development environment for DroneWorld.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start (Docker)](#quick-start-docker)
- [Local Development Setup](#local-development-setup)
- [IDE Configuration](#ide-configuration)
- [Environment Variables](#environment-variables)
- [Common Issues](#common-issues)
- [Debugging Tips](#debugging-tips)

## Prerequisites

### Required Software

- **Git** - Version control
- **Docker Desktop** (recommended) or:
  - **Python 3.10** - Backend development
  - **Node.js 20** - Frontend development
- **GitHub Personal Access Token** - For simulator build (if needed)

### System Requirements

- **RAM**: 8GB+ recommended
- **Disk Space**: 20GB+ available
- **OS**: Windows 10/11, macOS, or Linux

## Quick Start (Docker)

The easiest way to get started is using Docker.

### 1. Clone the Repository

```bash
git clone https://github.com/oss-slu/DroneWorld.git
cd DroneWorld
```

### 2. Set Up GitHub Token (for Simulator)

If you need the simulator:

```bash
# Linux/macOS
./dev.sh token

# Windows (PowerShell)
.\dev.ps1 token
```

Enter your GitHub Personal Access Token when prompted. See [Troubleshooting](#github-token-setup) for creating a token.

### 3. Start Development Environment

**Option A: Frontend + Backend Only** (Recommended for development)

```bash
# Linux/macOS
./dev.sh dev

# Windows
.\dev.ps1 dev
```

**Option B: Full Stack** (Includes simulator)

```bash
# Linux/macOS
./dev.sh full

# Windows
.\dev.ps1 full
```

### 4. Access Services

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Docs: http://localhost:5000/api/docs
- Simulator API: http://localhost:3001 (if running)

### 5. View Logs

```bash
# Linux/macOS
./dev.sh logs

# Windows
.\dev.ps1 logs
```

## Local Development Setup

If you prefer to run services locally without Docker:

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create virtual environment**:
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # Linux/macOS
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install --upgrade pip
   pip install -r requirements.txt
   ```

4. **Set up environment variables**:
   Create `backend/.env`:
   ```env
   STORAGE_TYPE=gcs
   GCS_BUCKET_NAME=droneworld
   GCS_CREDENTIALS_PATH=./credentials/gcs-key.json
   STORAGE_EMULATOR_HOST=localhost:4443
   DRV_UNREAL_HOST=localhost
   DRV_UNREAL_API_PORT=3001
   ```

5. **Set up AirSim configuration**:
   ```bash
   # Create config directory
   mkdir -p ~/Documents/AirSim  # Linux/macOS
   # or
   mkdir -p C:\Users\%USERNAME%\Documents\AirSim  # Windows

   # Copy example configs
   cp config/airsim/settings.json ~/Documents/AirSim/
   cp config/airsim/cesium.json ~/Documents/AirSim/
   ```

6. **Run backend**:
   ```bash
   flask --app PythonClient.server.simulation_server run --host=0.0.0.0 --port=5000 --debug
   ```

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create `frontend/.env`:
   ```env
   REACT_APP_BACKEND_URL=http://localhost:5000
   REACT_APP_CESIUM_ION_ACCESS_TOKEN=your_token_here
   ```

4. **Run frontend**:
   ```bash
   npm start
   ```

   Frontend will open at http://localhost:3000

### Simulator Setup

The simulator (DRV-Unreal) requires building from source or using Docker. For local development, it's recommended to use Docker or work with frontend/backend only.

## IDE Configuration

### VS Code

**Recommended Extensions**:
- Python
- ESLint
- Prettier
- Docker
- GitLens

**Settings** (`.vscode/settings.json`):
```json
{
  "python.defaultInterpreterPath": "${workspaceFolder}/backend/venv/bin/python",
  "python.linting.enabled": true,
  "python.linting.flake8Enabled": true,
  "python.formatting.provider": "black",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### PyCharm

1. Open project root
2. Configure Python interpreter: `backend/venv/bin/python`
3. Enable Black formatter
4. Configure ESLint for frontend

## Environment Variables

### Backend (.env)

```env
# Storage Configuration
STORAGE_TYPE=gcs  # or 'gdrive'
GCS_BUCKET_NAME=droneworld
GDRIVE_FOLDER_ID=your_folder_id

# Credentials Paths
GCS_CREDENTIALS_PATH=/app/credentials/gcs-key.json
GDRIVE_CREDENTIALS_PATH=/app/credentials/gdrive-key.json

# External APIs
GOOGLE_MAPS_API_KEY=your_api_key

# Wind Service (optional)
WIND_SERVICE_HOST=hostname.or.ip.address
WIND_SERVICE_PORT=5001

# Storage Emulator (for local development)
STORAGE_EMULATOR_HOST=localhost:4443

# Simulator Connection
DRV_UNREAL_HOST=localhost
DRV_UNREAL_API_PORT=3001
DRV_PIXELSTREAM_PORT=8888
```

### Frontend (.env)

```env
REACT_APP_BACKEND_URL=http://localhost:5000
REACT_APP_CESIUM_ION_ACCESS_TOKEN=your_cesium_token
REACT_APP_DEMO_USER_EMAIL=name@domain.tld
```

### Root (.env)

```env
GITHUB_TOKEN=ghp_xxxxxxx  # For simulator build
```

## Common Issues

### Port Already in Use

**Error**: `Address already in use` or `Port 3000/5000 is already in use`

**Solution**:
```bash
# Find process using port
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/macOS
lsof -ti:5000 | xargs kill -9
```

Or change ports in `docker-compose.yaml`.

### Docker Build Fails

**Error**: `Failed to build simulator`

**Solution**:
- Ensure GitHub token is set: `./dev.sh token`
- Check token has `repo` scope
- Verify network connection

### Module Not Found (Python)

**Error**: `ModuleNotFoundError: No module named 'PythonClient'`

**Solution**:
```bash
cd backend
export PYTHONPATH="${PYTHONPATH}:$(pwd)"
# or
set PYTHONPATH=%PYTHONPATH%;%CD%  # Windows
```

### Frontend Build Errors

**Error**: Cesium or other build errors

**Solution**:
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Simulator Not Connecting

**Error**: `TransportError` or connection refused

**Solution**:
1. Verify simulator is running: `docker ps`
2. Check simulator logs: `docker logs drv-unreal-1`
3. Verify port mapping: `docker-compose ps`
4. Test connection: `curl http://localhost:3001`

## Debugging Tips

### Backend Debugging

1. **Enable Flask debug mode** (already enabled in dev):
   ```python
   app.run(debug=True)
   ```

2. **View detailed logs**:
   ```bash
   docker-compose logs -f backend
   ```

3. **Use Python debugger**:
   ```python
   import pdb; pdb.set_trace()
   ```

4. **Test API endpoints**:
   ```bash
   curl http://localhost:5000/api/health
   ```

### Frontend Debugging

1. **React DevTools**: Install browser extension
2. **Console logs**: Check browser console
3. **Network tab**: Inspect API calls
4. **Redux DevTools**: For state debugging

### Simulator Debugging

1. **Check logs**:
   ```bash
   docker logs drv-unreal-1
   ```

2. **Verify AirSim connection**:
   ```python
   from PythonClient import airsim
   client = airsim.MultirotorClient()
   client.confirmConnection()
   ```

3. **Test API**:
   ```bash
   curl http://localhost:3001
   ```

### Docker Debugging

1. **Enter container**:
   ```bash
   docker-compose exec backend bash
   docker-compose exec frontend sh
   ```

2. **View container status**:
   ```bash
   docker-compose ps
   ```

3. **Rebuild containers**:
   ```bash
   docker-compose build --no-cache
   ```

## GitHub Token Setup

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Name: "DroneWorld Simulator"
4. Select scope: `repo` (Full control of private repositories)
5. Generate and copy token
6. Run `./dev.sh token` and paste token

## Testing

### Run Backend Tests

```bash
cd backend
python -m pytest tests/  # If tests exist
flake8 . --max-line-length 160
black .
```

### Run Frontend Tests

```bash
cd frontend
npm test
npm run lint
npm run build
```

### Run E2E Tests

```bash
cd frontend
npm run cypress:open
# or
npm run cypress:run
```

## Hot Reload

Both frontend and backend support hot reload in Docker:

- **Frontend**: Changes in `frontend/src/` trigger automatic recompilation
- **Backend**: Changes to Python files automatically restart Flask server

Verify in logs:
```bash
docker-compose logs -f frontend backend
```

## Next Steps

- Read [ARCHITECTURE.md](ARCHITECTURE.md) for system design
- Review [CODE_STYLE.md](CODE_STYLE.md) for coding standards
- Check [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines
- Explore the codebase starting with [README.md](README.md)

---

**Need Help?** Open an issue or check the [Wiki](https://github.com/oss-slu/DroneWorld/wiki).

