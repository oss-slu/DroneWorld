# DroneWorld Architecture

This document provides an overview of the DroneWorld system architecture, components, and design decisions.

## Table of Contents

- [System Overview](#system-overview)
- [Architecture Diagram](#architecture-diagram)
- [Core Components](#core-components)
- [Data Flow](#data-flow)
- [Technology Stack](#technology-stack)
- [Design Decisions](#design-decisions)
- [Extension Points](#extension-points)

## System Overview

DroneWorld is a three-tier architecture consisting of:

1. **Frontend (React)** - User interface for configuration and visualization
2. **Backend (Flask)** - API server and simulation controller
3. **Simulator (DRV-Unreal)** - Unreal Engine-based simulation engine

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   React     │◄───────►│   Flask     │◄───────►│ DRV-Unreal  │
│  Frontend   │  HTTP   │   Backend   │  TCP    │  Simulator  │
│  (Port 3000)│         │  (Port 5000)│         │  (Port 3001)│
└─────────────┘         └─────────────┘         └─────────────┘
                              │
                              ▼
                        ┌─────────────┐
                        │   Storage   │
                        │  (GCS/GDrive)│
                        └─────────────┘
```

## Core Components

### 1. Frontend (React Application)

**Location**: `frontend/src/`

**Key Technologies**:
- React 18.2
- Material-UI (MUI) 5.x
- Cesium (3D mapping)
- Redux (state management)
- React Router (routing)

**Main Components**:
- **Pages**: Landing, Home, Simulation Wizard, Dashboard, Report Dashboard
- **Configuration Components**: Environment, Drone, Mission, Monitor configuration
- **Cesium Integration**: 3D map visualization and waypoint selection

**Responsibilities**:
- User interface for simulation configuration
- Real-time visualization of simulation status
- Report viewing and analysis
- 3D map interaction for geographic missions

### 2. Backend (Flask API Server)

**Location**: `backend/PythonClient/server/`

**Key Technologies**:
- Flask 2.3.2
- Flask-CORS (cross-origin support)
- Flasgger (Swagger documentation)
- AirSim Python Client
- Threading (parallel execution)

**Main Components**:

#### SimulationTaskManager
**Location**: `backend/PythonClient/multirotor/control/simulation_task_manager.py`

The core orchestrator that:
- Manages a queue of simulation tasks
- Processes tasks sequentially
- Coordinates mission and monitor execution
- Handles AirSim settings configuration
- Manages streaming if enabled

**Key Methods**:
- `add_task()` - Add simulation to queue
- `__batch_exe_all()` - Execute missions and monitors in parallel
- `__update_settings()` - Configure AirSim environment

#### Mission System
**Location**: `backend/PythonClient/multirotor/mission/`

Abstract base class: `GenericMission` in `abstract/abstract_mission.py`

**Available Missions**:
- `FlyToPoints` - Waypoint navigation
- `FlyStraight` - Linear flight
- `FlyInCircle` - Circular patterns
- `FlyToPointsGeo` - Geographic coordinate waypoints
- `BlockSShape` - S-shaped patterns

**Mission Lifecycle**:
1. Initialization (connect to AirSim, arm drone)
2. Execution (fly mission)
3. Completion (save report, cleanup)

#### Monitor System
**Location**: `backend/PythonClient/multirotor/monitor/`

Two types of monitors:

**Single-Drone Monitors** (inherit from `SingleDroneMissionMonitor`):
- Monitor a specific drone during its mission
- Examples: CollisionMonitor, BatteryMonitor, DriftMonitor

**Global Monitors** (inherit from `GlobalMonitor`):
- Monitor across all drones
- Example: MinSepDistMonitor (minimum separation distance)

**Monitor Responsibilities**:
- Continuously check safety parameters
- Log PASS/FAIL/INFO events
- Generate reports
- Upload to storage service

#### Storage Service
**Location**: `backend/PythonClient/multirotor/storage/`

Abstract interface supporting multiple backends:
- **GCSStorageService** - Google Cloud Storage
- **GoogleDriveStorageService** - Google Drive

**Responsibilities**:
- Upload simulation reports
- List available reports
- Serve report files (HTML, images, logs)

### 3. Simulator (DRV-Unreal)

**Location**: External repository `UAVLab-SLU/DRV-Unreal`

**Technology**: Unreal Engine 5.5 with AirSim plugin

**Features**:
- Headless operation (`-nullrhi` flag)
- AirSim API on port 3000 (mapped to 3001)
- PixelStreaming support (port 8888)
- Realistic physics simulation
- Wind simulation
- Multiple drone support

**Communication**:
- TCP connection to backend via AirSim API
- WebSocket for PixelStreaming (optional)

## Data Flow

### 1. Configuration Flow

```
User (Frontend) → React UI → JSON Configuration
                                    ↓
                            POST /addTask
                                    ↓
                        SimulationTaskManager
                                    ↓
                    Parse & Validate Configuration
                                    ↓
                    Update AirSim settings.json
                                    ↓
                        Queue Task for Execution
```

### 2. Execution Flow

```
SimulationTaskManager
    ├─→ Update AirSim Settings
    ├─→ Reset Simulation
    ├─→ Spawn Drones
    │
    ├─→ Mission Threads (Parallel)
    │   ├─→ Mission 1 (Drone1)
    │   ├─→ Mission 2 (Drone2)
    │   └─→ ...
    │
    ├─→ Monitor Threads (Parallel)
    │   ├─→ CollisionMonitor (Drone1)
    │   ├─→ BatteryMonitor (Drone1)
    │   ├─→ MinSepDistMonitor (Global)
    │   └─→ ...
    │
    └─→ Wait for Completion
        ├─→ Collect Reports
        └─→ Upload to Storage
```

### 3. Data Collection Flow

```
Monitor Thread
    ├─→ Poll AirSim API (every N seconds)
    ├─→ Check Safety Parameters
    ├─→ Log Events (PASS/FAIL/INFO)
    └─→ Save Report on Completion
            ↓
    Storage Service
            ↓
    Cloud Storage (GCS/GDrive)
```

## Technology Stack

### Frontend
- **React 18.2** - UI framework
- **Material-UI 5.x** - Component library
- **Cesium 1.126** - 3D globe and maps
- **Redux 4.2** - State management
- **Axios 1.2** - HTTP client
- **Cypress** - E2E testing

### Backend
- **Python 3.10** - Runtime
- **Flask 2.3.2** - Web framework
- **AirSim Python Client** - Simulator communication
- **NumPy 1.25** - Numerical computing
- **Pandas 2.0** - Data analysis
- **Plotly 5.15** - Visualization
- **Google Cloud Storage** - Cloud storage client

### Infrastructure
- **Docker & Docker Compose** - Containerization
- **Fake GCS Server** - Local storage emulation
- **GitHub Actions** - CI/CD

## Design Decisions

### 1. Threading Model

**Decision**: Use Python threading for parallel mission/monitor execution

**Rationale**:
- AirSim API calls are I/O bound (network communication)
- Threading allows concurrent execution without GIL limitations
- Simpler than multiprocessing for this use case

**Trade-offs**:
- Limited by GIL for CPU-bound tasks
- Requires careful synchronization for shared state

### 2. Task Queue

**Decision**: Sequential task processing with queue

**Rationale**:
- Simulator can only run one simulation at a time
- Queue ensures orderly execution
- Prevents resource conflicts

### 3. Abstract Base Classes

**Decision**: Use abstract base classes for missions and monitors

**Rationale**:
- Enables extensibility (easy to add new missions/monitors)
- Consistent interface across implementations
- Dynamic loading via reflection

**Example**:
```python
class GenericMission(AirSimApplication):
    @abstractmethod
    def start(self):
        pass
```

### 4. Storage Abstraction

**Decision**: Abstract storage interface with multiple implementations

**Rationale**:
- Flexibility to switch storage backends
- Easy to add new storage providers
- Testable with local emulators

### 5. Headless Simulator

**Decision**: Run simulator in headless mode (`-nullrhi`)

**Rationale**:
- Enables server deployment without GPU
- Reduces resource consumption
- Works on cloud infrastructure

**Trade-offs**:
- No visual debugging
- PixelStreaming required for visualization

## Extension Points

### Adding a New Mission

1. Create new file in `backend/PythonClient/multirotor/mission/`
2. Inherit from `GenericMission`
3. Implement `start()` method
4. Use AirSim API to control drone
5. Log events using `append_info_to_log()`, etc.
6. Call `save_report()` on completion

**Example Structure**:
```python
class MyCustomMission(GenericMission):
    def __init__(self, target_drone, param1, param2):
        super().__init__(target_drone)
        self.param1 = param1
        self.param2 = param2
    
    def start(self):
        self.state = self.State.RUNNING
        # Mission logic here
        self.stop()
```

### Adding a New Monitor

1. Create new file in `backend/PythonClient/multirotor/monitor/`
2. Inherit from `SingleDroneMissionMonitor` or `GlobalMonitor`
3. Implement `start()` method
4. Poll AirSim API in loop
5. Check safety parameters
6. Log PASS/FAIL/INFO events
7. Call `save_report()` on completion

**Example Structure**:
```python
class MyCustomMonitor(SingleDroneMissionMonitor):
    def __init__(self, mission, threshold):
        super().__init__(mission)
        self.threshold = threshold
    
    def start(self):
        while self.mission.state != self.mission.State.END:
            # Check parameters
            if violation_detected:
                self.append_fail_to_log("Violation detected")
            sleep(1.0)
        self.save_report()
```

### Adding a New Storage Backend

1. Create new file in `backend/PythonClient/multirotor/storage/`
2. Inherit from `StorageService` (abstract base)
3. Implement required methods:
   - `upload_to_service()`
   - `list_reports()`
   - `list_folder_contents()`
   - `serve_html()`
4. Update `storage_config.py` to support new backend

## Configuration Files

### AirSim Settings
**Location**: `config/airsim/settings.json`

Controls:
- Drone configurations
- Sensor settings
- Wind parameters
- Time of day
- Geographic origin

### Cesium Settings
**Location**: `config/airsim/cesium.json`

Contains:
- Latitude/longitude origin
- Height/elevation

## Network Architecture

### Ports
- **3000**: Frontend (React dev server)
- **5000**: Backend (Flask API)
- **3001**: Simulator API (mapped from 3000)
- **8888**: PixelStreaming (WebSocket)
- **4443**: Fake GCS Server

### Communication Protocols
- **HTTP/REST**: Frontend ↔ Backend
- **TCP (msgpack-rpc)**: Backend ↔ Simulator (AirSim API)
- **WebSocket**: Frontend ↔ Simulator (PixelStreaming)
- **HTTP**: Backend ↔ Storage (GCS API)

## Security Considerations

1. **CORS**: Enabled for frontend-backend communication
2. **Environment Variables**: Sensitive data (tokens, keys) stored in `.env`
3. **GitHub Token**: Required for simulator build (private repo)
4. **Storage Credentials**: Service account keys for cloud storage

## Performance Considerations

1. **Threading**: Parallel execution of missions/monitors
2. **Queue**: Sequential task processing prevents conflicts
3. **Headless Mode**: Reduces GPU/memory requirements
4. **Storage**: Async uploads (future improvement)

## Future Architecture Improvements

1. **WebSocket API**: Real-time updates to frontend
2. **Database**: Store simulation history and metadata
3. **Authentication**: User management and access control
4. **Microservices**: Split backend into smaller services
5. **Message Queue**: Use Redis/RabbitMQ for task management
6. **Caching**: Cache frequently accessed data

---

For more details on specific components, see:
- [DEVELOPER_SETUP.md](DEVELOPER_SETUP.md) - Development environment
- [CODE_STYLE.md](CODE_STYLE.md) - Coding standards
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guidelines

