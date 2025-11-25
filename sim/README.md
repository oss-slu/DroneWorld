# DRV-Unreal Docker Setup

This setup containerizes the DRV-Unreal v2.0.0 Linux binary from GitHub releases for local development using a multi-stage build for optimal image size.

## Prerequisites

- Docker
- Docker Compose
- (Optional) NVIDIA GPU with nvidia-docker2 for GPU acceleration

## Architecture

This setup uses a **multi-stage Docker build**:

1. **Stage 1 (downloader)**: Downloads and extracts the 1.27 GB `Linux.zip`
2. **Stage 2 (runtime)**: Clean Ubuntu environment with only runtime dependencies
   - Vulkan drivers (mesa-vulkan-drivers, libvulkan1, vulkan-tools)
   - Graphics libraries (libgl1, libglu1-mesa)
   - X11 libraries (libxrandr2, libxinerama1, libxcursor1, libxi6)

This approach keeps the final image clean without build tools like wget and unzip.

## What's Included

This setup downloads and runs the DRV-Unreal v2.0.0 Linux build which includes:

- Aurelia drone model with React-G GPS receiver
- Unreal Engine 5.5
- Raytracing and DLSS support
- PixelStreaming capability
- Vulkan driver support

## Quick Start

### 1. Build and Run

```bash
# Build the image (downloads ~1.27 GB Linux.zip)
docker-compose build

# Start the service
docker-compose up -d

# View logs
docker-compose logs -f drv-unreal

# Stop the service
docker-compose down
```

### 2. Access the Application

The DRV ecosystem UI should be available at <http://localhost:3000>

## Configuration Options

### GPU Support (Recommended for Unreal Engine)

If you have an NVIDIA GPU, uncomment the GPU section in `docker-compose.yml`:

```yaml
deploy:
  resources:
    reservations:
      devices:
        - driver: nvidia
          count: 1
          capabilities: [gpu]
```

Then ensure you have nvidia-docker2 installed:

```bash
# Install nvidia-docker2
distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | sudo apt-key add -
curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | \
  sudo tee /etc/apt/sources.list.d/nvidia-docker.list
sudo apt-get update && sudo apt-get install -y nvidia-docker2
sudo systemctl restart docker
```

### PixelStreaming (Optional)

To enable PixelStreaming for remote rendering:

1. You'll need the PixelStreamingInfrastructure.zip from the release
2. Run the signaling server separately
3. Modify the CMD in Dockerfile to include PixelStreaming args:

   ```dockerfile
   CMD ["./Blocks.sh", "-AudioMixer", "-PixelStreamingIP=localhost", "-PixelStreamingPort=8888"]
   ```

### Custom Arguments

To run with different arguments, override the command:

```bash
docker-compose run drv-unreal ./Blocks.sh -graphicsadapter=0
```

Or modify the `command` in docker-compose.yml:
```yaml
command: ["./Blocks.sh", "-graphicsadapter=1", "-YourCustomArg"]
```

## Troubleshooting

### Verify Vulkan Installation

The Dockerfile includes a Vulkan verification step during build. To manually verify:

```bash
# Check if Vulkan is available in the container
docker-compose exec drv-unreal vulkaninfo

# Or check the summary
docker-compose exec drv-unreal vulkaninfo --summary
```

Expected output should show available Vulkan drivers and devices.

### Vulkan Driver Issues

If you see Vulkan-related errors:

```bash
# Check if Vulkan is available in the container
docker-compose exec drv-unreal vulkaninfo

# Or run with debug
docker-compose run drv-unreal bash
vulkaninfo
```

### Display Issues

If running with GUI (not headless):

```bash
# Allow X11 connections (on host)
xhost +local:docker

# Run with proper DISPLAY variable
DISPLAY=:0 docker-compose up
```

### Container Exits Immediately

Check the logs:

```bash
docker-compose logs drv-unreal
```

If the binary requires X11 or other dependencies, you may need to run it in headless mode or with additional configuration.

### Debugging

To keep the container running for debugging:

```yaml
# In docker-compose.yml, uncomment:
command: tail -f /dev/null
```

Then exec into it:

```bash
docker-compose exec drv-unreal bash
./Blocks.sh -graphicsadapter=1
```

## Architecture

The setup includes:

- **drv-unreal service**: Main Unreal application container
- **Exposed ports**:
  - 3000: Web UI interface
  - 8888: PixelStreaming (if enabled)

## Notes

- The Linux.zip file is ~1.27 GB and will be downloaded during build
- First build will take several minutes
- Vulkan drivers are pre-installed in the container
- The application runs with `-graphicsadapter=1` by default

## Next Steps

1. Build and start: `docker-compose up -d`
2. Check logs: `docker-compose logs -f`
3. Access UI: `http://localhost:3000`
4. Configure GPU support if needed
5. Integrate with your other services in the same docker-compose.yml