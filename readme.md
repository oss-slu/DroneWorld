# DroneWorld

## Overview

**Drone World**, a key component of DRV, is an advanced simulation platform for testing small unmanned aerial systems (sUAS). It enables users to configure detailed test scenarios by specifying:

- **Environmental Conditions:** Weather, terrain, and other environmental factors.
- **sUAS Capabilities:** Sensors, hardware configurations, and other drone specifications.
- **Mission Objectives:** Specific goals and tasks for each simulation.

The platform generates a realistic 3D simulation environment, monitors data to ensure safety, detects issues, and produces comprehensive test reports with detailed analysis. By automating and streamlining the testing process, Drone World enhances safety, reliability, and efficiency for drone developers. It allows for comprehensive pre-flight testing in ultra-realistic environments, helping developers refine their systems and iterate more rapidly on complex missions. Our team at OSS is dedicated to continuously enhancing Drone World's capabilities, including refining environmental settings, drone configurations, and integrating new features.

### Wiki

Check out our [Wiki](https://github.com/oss-slu/DroneWorld/wiki) for detailed and important information. It's constantly being updated to provide you with the latest resources and insights.

## DroneReqValidator

**DroneReqValidator (DRV)** is a comprehensive drone simulation ecosystem that automatically creates realistic environments, monitors drone activity against predefined safety parameters, and produces detailed acceptance test reports for efficient debugging and analysis of drone software applications. Check out a [demo video](https://www.youtube.com/watch?v=Fd9ft55gbO8) showcasing DRV in action.

## System Requirements

### Docker Deployment (Recommended)

- **Docker** and **Docker Compose**
- **macOS** (Apple Silicon or Intel) / **Linux** / **Windows with WSL2**
- 8GB+ RAM recommended
- 20GB+ available disk space

### Traditional Deployment

- Windows 10/11
- Python 3.10
- Node.js

## Architecture

DroneReqValidator has 3 main components:

1. **DRV-Unreal** - Unreal-based simulation engine (headless mode)
2. **Flask Backend** - Python-based simulation controller and monitoring service
3. **React Frontend** - JavaScript-based user interface for configuration and visualization

### API Error Handling

All backend endpoints return a standardized error envelope with `code`, `message`, `details`, `timestamp`, and `request_id` (also echoed in the `X-Request-ID` header). Standard codes are documented in `backend/ERRORS.md` alongside example responses for common endpoints.

## Quick Start (Docker)

### Prerequisites

Ensure Docker and Docker Compose are installed on your system.

### GitHub Token (Required for Simulator)

The simulator (`drv-unreal`) requires a GitHub Personal Access Token to build. If you're only working on frontend/backend, you can skip this step. See setup instructions in [Troubleshooting](#set-up-github-token).

### Using Helper Scripts (Recommended)

**Linux/macOS:**

```bash
# First time: Set GitHub token (only needed for simulator)
./dev.sh token

# Development mode (frontend + backend only)
./dev.sh dev

# Full stack (includes simulator)
./dev.sh full

# View logs
./dev.sh logs

# Stop services
./dev.sh stop
```

**Windows (PowerShell):**

```powershell
# First time: Set GitHub token (only needed for simulator)
.\dev.ps1 token

# Development mode (frontend + backend only)
.\dev.ps1 dev

# Full stack (includes simulator)
.\dev.ps1 full

# View logs
.\dev.ps1 logs

# Stop services
.\dev.ps1 stop
```

Run `./dev.sh help` or `.\dev.ps1 help` to see all available commands.

### Option 1: Full Stack (Recommended for Testing)

Run all services including the simulation engine:

```bash
./dev.sh full           # Linux/macOS
.\dev.ps1 full          # Windows

# Or directly:
docker-compose up
```

**Services started:**

- Frontend UI (http://localhost:3000)
- Backend API (http://localhost:5000)
- Simulation Engine (http://localhost:3001)
- Storage services

### Option 2: Frontend/Backend Only (Recommended for Development)

Run without the simulation engine for faster development:

```bash
./dev.sh dev            # Linux/macOS
.\dev.ps1 dev           # Windows

# Or directly:
docker-compose -f docker-compose.dev.yml up
```

**Services started:**

- Frontend UI (http://localhost:3000)
- Backend API (http://localhost:5000)
- Storage services

**Use this when:**

- Working on frontend UI/UX
- Developing backend API endpoints
- Testing frontend ↔ backend integration
- You don't have access to build the simulator
- You want faster startup times

### Start Individual Services

```bash
./dev.sh frontend       # Frontend only
./dev.sh backend        # Backend only
./dev.sh simulator      # Simulator only

# Or directly:
docker-compose up frontend
docker-compose up backend
docker-compose up drv-unreal
```

### Viewing Logs

**Using helper scripts:**

```bash
./dev.sh logs           # Linux/macOS
.\dev.ps1 logs          # Windows
```

**Using docker-compose directly:**

```bash
docker-compose -f docker-compose.dev.yml logs -f frontend backend
```

### Stopping Development Services

**Using helper scripts:**

```bash
./dev.sh stop-dev       # Linux/macOS
.\dev.ps1 stop-dev      # Windows
```

**Using docker-compose directly:**

```bash
docker-compose -f docker-compose.dev.yml down
```

### Configuration

1. Configure AirSim settings in `config/airsim/`:
   - `settings.json` - Drone and simulation configuration
   - `cesium.json` - Geographic coordinates for terrain generation

Example `settings.json`:

```json
{
    "SettingsVersion": 1.2,
    "SimMode": "Multirotor",
    "Vehicles": {
        "Drone1": {
            "FlightController": "SimpleFlight",
            "X": 0,
            "Y": 0,
            "Z": 0
        }
    }
}
```

Example `cesium.json`:

```json
{
    "latitude": 38.63657,
    "longitude": -90.236895,
    "height": 163.622131
}
```

## Deployment

### Start All Services

```bash
docker-compose up
```

### Start Individual Services

```bash
# Simulation engine only
docker-compose up drv-unreal

# Backend only
docker-compose up backend

# Frontend only
docker-compose up frontend
```

### Access the Application

- **Frontend UI**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Backend Health Check**: http://localhost:5000/api/health
- **Simulation Engine API**: http://localhost:3001
- **Simulation Engine PixelStream**: http://localhost:8888 

## Architecture Notes

### Headless Simulation

The DRV-Unreal simulation engine runs in **headless mode** using the `-nullrhi` flag, which:

- Bypasses GPU rendering requirements
- Enables deployment on servers without graphics hardware
- Works on Apple Silicon Macs via QEMU emulation
- Reduces resource consumption while maintaining physics simulation

### Network Communication

- The simulation engine exposes AirSim's API on port 3001
- Backend communicates with the simulation engine via this TCP connection
- Frontend communicates with backend via REST API

## Development

### Building Custom Images

```bash
# Build DRV-Unreal simulation engine image
docker-compose build drv-unreal

# Build backend image
docker-compose build backend

# Build frontend image
docker-compose build frontend
```

### Viewing Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f drv-unreal
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Stopping Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```
### Hot Reload

Both frontend and backend support automatic hot reload during development:

- **Frontend**: Changes to files in `frontend/src/` trigger automatic recompilation
- **Backend**: Changes to Python files automatically restart the Flask server

Verify hot reload is working:
```bash
# Watch logs for recompilation/restart messages
docker-compose logs -f frontend backend
```

For detailed development workflows and contribution guidelines, see our [Contributing Guide](https://github.com/oss-slu/DroneWorld/wiki/Contributing-Guide).

## Traditional Usage (Non-Docker)

To begin using DroneReqValidator with traditional installation, refer to our [Getting Started](https://github.com/oss-slu/DroneWorld/wiki/Getting-Started) guide.

## Troubleshooting

### Sample `.env` Files

The contents of `.env` might include the following variables:

```sh
GITHUB_TOKEN=ghp_xxxxxxx
```

The contents of `./sim/.env` might include the following variables:

```sh
GITHUB_TOKEN=ghp_xxxxxxx
```

The contents of `./backend/.env` should include the following variables:

```sh
# Storage Configuration
STORAGE_TYPE=gcs
GCS_BUCKET_NAME=droneworld
GDRIVE_FOLDER_ID=your_folder_id_here

# Credentials
GCS_CREDENTIALS_PATH=/app/credentials/gcs-key.json
GDRIVE_CREDENTIALS_PATH=/app/credentials/gdrive-key.json

# External APIs
GOOGLE_MAPS_API_KEY=your_api_key_here

# Wind Service Configuration
WIND_SERVICE_HOST=hostname.or.ip.address
WIND_SERVICE_PORT=5001

# Storage Emulator Host
STORAGE_EMULATOR_HOST=localhost:4443

```

The contents of `./frontend/.env` should include the following variables:

```sh
REACT_APP_DEMO_USER_EMAIL='name@domain.tld'
REACT_APP_CESIUM_ION_ACCESS_TOKEN='yaddayaddayadda'
```

### Set Up GitHub Token

**Linux/macOS:**
```bash
./dev.sh token
# Enter your token when prompted
# Token is automatically saved and loaded for future sessions
```

**Windows (PowerShell):**
```powershell
.\dev.ps1 token
# Enter your token when prompted
# Token is automatically saved and loaded for future sessions
```

**Creating a GitHub Personal Access Token:**
1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a descriptive name (e.g., "DroneWorld Simulator")
4. Select scopes: `repo` (Full control of private repositories)
5. Click "Generate token"
6. Copy the token and use it with the `token` command above

**Note:** Once saved, the token is automatically loaded from `.env` when you run `./dev.sh full` or `./dev.sh simulator`.

### Port Already in Use
If you see errors about ports 3000, 3001, or 5000 already being in use:
```bash
# Stop conflicting services or change ports in docker-compose.yml
docker-compose down
```

### Simulation Engine Not Responding

Check logs for initialization:

```bash
docker logs drv-unreal-1 | grep -E "LogNet|LogWorld|Server"
```

Look for messages like:

- `LogWorld: Bringing World ... up for play`
- Server initialization complete

### Memory Issues

If the simulation engine container crashes with memory errors, increase Docker's memory limit:

- **Docker Desktop**: Settings → Resources → Memory (set to 8GB+)
- **Linux**: No limit by default, but ensure system has sufficient RAM

## Contributing

Contributions to this project are welcome! For details on how to contribute, please follow our [Contributing Guide](https://github.com/oss-slu/DroneWorld/wiki/Contributing-Guide).

## License
This project is licensed under the MIT license. See the LICENSE file for more information.
