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

1. **DRV-Unreal** - Unreal Engine 5.5 simulation environment with AirSim plugin (headless mode)
2. **Python Backend** - Flask server-based simulation controller and monitoring service
3. **React Frontend** - React web-based user interface for configuration and visualization

## Quick Start (Docker)

### Prerequisites

Ensure Docker and Docker Compose are installed on your system.

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
# Unreal simulation only
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
- **Simulation Server API**: http://localhost:3001
- **Simulation PixelStream**: http://localhost:8888 

## Architecture Notes

### Headless Simulation

The Unreal Engine simulation runs in **headless mode** using the `-nullrhi` flag, which:

- Bypasses GPU rendering requirements
- Enables deployment on servers without graphics hardware
- Works on Apple Silicon Macs via QEMU emulation
- Reduces resource consumption while maintaining physics simulation

### Network Communication

- The Simulation server exposes AirSim's API on port 3000
- Backend communicates with Simulation via this TCP connection
- Frontend communicates with backend via REST API

## Development

### Building Custom Images

```bash
# Build Unreal simulation image
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

### Port Already in Use
If you see errors about ports 3000, 3001, or 8000 already being in use:
```bash
# Stop conflicting services or change ports in docker-compose.yml
docker-compose down
```

### Simulation Server Not Responding

Check logs for initialization:

```bash
docker logs drv-unreal-1 | grep -E "LogNet|LogWorld|Server"
```

Look for messages like:

- `LogWorld: Bringing World ... up for play`
- Server initialization complete

### Memory Issues

If the Simulation container crashes with memory errors, increase Docker's memory limit:

- **Docker Desktop**: Settings → Resources → Memory (set to 8GB+)
- **Linux**: No limit by default, but ensure system has sufficient RAM

## Contributing

Contributions to this project are welcome! For details on how to contribute, please follow our [Contributing Guide](https://github.com/oss-slu/DroneWorld/wiki/Contributing-Guide).

## License
This project is licensed under the MIT license. See the LICENSE file for more information.