# Runtime environment with Vulkan drivers (native Linux + NVIDIA)
FROM nvidia/cuda:12.8.0-base-ubuntu24.04 AS runtime

# Prevent interactive prompts during installation
ENV DEBIAN_FRONTEND=noninteractive

# Install Vulkan drivers and ALL runtime dependencies for Unreal Engine
# Including 32-bit libraries that might be needed
RUN apt-get update && apt-get install -y \
    mesa-vulkan-drivers \
    vulkan-tools \
    libvulkan1 \
    libgl1 \
    libgl1-mesa-dri \
    libglx-mesa0 \
    libglu1-mesa \
    mesa-utils \
    libxrandr2 \
    libxinerama1 \
    libxcursor1 \
    libxi6 \
    libc6 \
    libstdc++6 \
    libgcc-s1 \
    zlib1g \
    libx11-6 \
    libxext6 \
    libxrender1 \
    libxtst6 \
    libxau6 \
    libxdmcp6 \
    libxcb1 \
    libasound2t64 \
    libpulse0 \
    ca-certificates \
    xdg-user-dirs \
    xvfb \
    sudo \
    net-tools \
    gosu \
    && rm -rf /var/lib/apt/lists/*

# Headless-friendly defaults
ENV SDL_HEADLESS=1 \
    XDG_RUNTIME_DIR=/tmp/runtime-ue4

# Provide runtime dirs so XDG/X11 lookups don't fail at startup
RUN mkdir -p /tmp/runtime-ue4 /tmp/.X11-unix && \
    chmod 700 /tmp/runtime-ue4 && \
    chmod 1777 /tmp/.X11-unix

# Vulkan ICD (helps driver discovery inside container)
COPY HelperFiles/nvidia_icd.json /etc/vulkan/icd.d/nvidia_icd.json

# Create non-root user for running Unreal Engine (handle base images with UID 1000 already taken)
RUN id -u ue4 >/dev/null 2>&1 || useradd -m -s /bin/bash ue4 && \
    echo "ue4 ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers && \
    chown -R ue4:ue4 /tmp/runtime-ue4 && \
    if getent group render >/dev/null; then groupmod -g 992 render || true; else groupadd -r -g 992 render; fi && \
    if getent group video >/dev/null; then groupmod -g 44 video || true; else groupadd -r -g 44 video; fi && \
    usermod -aG render,video ue4


# Set working directory
WORKDIR /app

# Copy the local DRV-Unreal Linux build from the repo
COPY ["(Linux)DRV_2.1.0/Linux/", "/app/"]

# Ensure entry script and binary are executable
RUN chmod +x /app/DRV.sh /app/DRV/Binaries/Linux/DRV-Linux-Shipping

# Lightweight Xvfb wrapper for headless runs
RUN printf '%s\n' \
  '#!/bin/sh' \
  'set -e' \
  'XDG_RUNTIME_DIR="${XDG_RUNTIME_DIR:-/tmp/runtime-ue4}"' \
  'mkdir -p "$XDG_RUNTIME_DIR"' \
  'chmod 700 "$XDG_RUNTIME_DIR"' \
  'Xvfb :99 -screen 0 1024x768x24 -ac +extension GLX +render -noreset &' \
  'export DISPLAY=:99' \
  'sleep 2' \
  'exec /app/DRV.sh "$@"' \
  > /app/Blocks.sh && chmod +x /app/Blocks.sh

# Entrypoint: fix /dev/dri permissions at runtime, then drop to ue4
RUN printf '%s\n' \
  '#!/bin/sh' \
  'set -e' \
  'if [ -d /dev/dri ]; then' \
  '  for dev in /dev/dri/card*; do [ -e "$dev" ] || continue; chgrp video "$dev" || true; chmod 660 "$dev" || true; done' \
  '  for dev in /dev/dri/renderD*; do [ -e "$dev" ] || continue; chgrp render "$dev" || true; chmod 660 "$dev" || true; done' \
  'fi' \
  'if [ -n "${XDG_RUNTIME_DIR:-}" ]; then' \
  '  mkdir -p "$XDG_RUNTIME_DIR"' \
  '  chown ue4:ue4 "$XDG_RUNTIME_DIR" || true' \
  '  chmod 700 "$XDG_RUNTIME_DIR" || true' \
  'fi' \
  'exec gosu ue4 "$@"' \
  > /usr/local/bin/entrypoint.sh && chmod +x /usr/local/bin/entrypoint.sh

# Ensure log directory exists and is writable
RUN mkdir -p /app/DRV/Saved/Logs && \
    chown -R ue4:ue4 /app/DRV/Saved && \
    chmod -R u+w /app/DRV/Saved

# Change ownership to non-root user
RUN chown -R ue4:ue4 /app

# Verify Vulkan installation (optional, for debugging)
RUN vulkaninfo --summary || echo "Vulkan info check complete"

# OpenSSL 1.1 compatibility for older UE builds/plugins
COPY --from=python:3.8.1-buster /usr/lib/x86_64-linux-gnu/libssl.so.1.1 /usr/lib/x86_64-linux-gnu/libssl.so.1.1
COPY --from=python:3.8.1-buster /usr/lib/x86_64-linux-gnu/libcrypto.so.1.1 /usr/lib/x86_64-linux-gnu/libcrypto.so.1.1

RUN mkdir -p /home/ue4/Documents/AirSim && \
    touch /home/ue4/Documents/AirSim/settings.json && \
    touch /home/ue4/Documents/AirSim/cesium.json && \
    ln -sf /home/ue4/Documents/AirSim/settings.json /home/ue4/Documents/AirSim\\settings.json && \
    ln -sf /home/ue4/Documents/AirSim/cesium.json /home/ue4/Documents/AirSim\\cesium.json

# Expose ports
# Port 3000 for the UI (from DRV docs)
# Port 8888 for PixelStreaming (if using that feature)
EXPOSE 3000 8888 41451

# Entrypoint runs as root, then drops to ue4
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

# Default command - run with graphicsadapter flag
CMD ["./Blocks.sh", "-RenderOffscreen", "-graphicsadapter=0"]
