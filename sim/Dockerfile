# Stage 1: Download and extract the binary
FROM ubuntu:22.04 AS downloader

# Prevent interactive prompts during installation
ENV DEBIAN_FRONTEND=noninteractive

# Install download tools
RUN apt-get update && apt-get install -y \
    wget \
    unzip \
    ca-certificates \
    jq \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /tmp/download

# Download the DRV-Unreal Linux binary from GitHub releases
ARG VERSION=v2.0.0
ARG GITHUB_REPO=UAVLab-SLU/DRV-Unreal
ARG GITHUB_TOKEN

# Download and extract the Linux release
# For private repos, must use GitHub API asset endpoint
RUN if [ -n "$GITHUB_TOKEN" ]; then \
        echo "Downloading from private repo via GitHub API..." && \
        # Get the asset ID for Linux.zip using jq
        ASSET_ID=$(wget -qO- \
                   --header="Authorization: Bearer ${GITHUB_TOKEN}" \
                   "https://api.github.com/repos/${GITHUB_REPO}/releases/tags/${VERSION}" | \
                   jq -r '.assets[] | select(.name=="Linux.zip") | .id') && \
        echo "Found Linux.zip asset ID: $ASSET_ID" && \
        # Download using API endpoint (required for private repos)
        wget --header="Authorization: Bearer ${GITHUB_TOKEN}" \
             --header="Accept: application/octet-stream" \
             "https://api.github.com/repos/${GITHUB_REPO}/releases/assets/$ASSET_ID" \
             -O linux.zip; \
    else \
        echo "Downloading from public repo..." && \
        wget https://github.com/${GITHUB_REPO}/releases/download/${VERSION}/Linux.zip \
             -O linux.zip; \
    fi \
    && echo "Download complete, extracting..." \
    && unzip -q linux.zip -d /tmp/extract \
    && rm linux.zip \
    && echo "Searching for Blocks.sh..." \
    && BLOCKS_DIR=$(find /tmp/extract -name "Blocks.sh" -type f | head -1 | xargs dirname) \
    && echo "Found in: $BLOCKS_DIR" \
    && echo "Contents:" \
    && ls -la "$BLOCKS_DIR" \
    && echo "Moving contents to /app..." \
    && cp -r "$BLOCKS_DIR"/. /app/ \
    && rm -rf /tmp/extract \
    && echo "Files in /app:" \
    && ls -la /app/ | head -20

# Make the binary executable
RUN chmod +x /app/Blocks.sh

# Stage 2: Runtime environment with Vulkan drivers
# Force x86_64 platform for Apple Silicon compatibility
FROM --platform=linux/amd64 ubuntu:22.04 AS runtime

# Prevent interactive prompts during installation
ENV DEBIAN_FRONTEND=noninteractive

# Install Vulkan drivers and ALL runtime dependencies for Unreal Engine
# Including 32-bit libraries that might be needed
RUN apt-get update && apt-get install -y \
    mesa-vulkan-drivers \
    vulkan-tools \
    libvulkan1 \
    libgl1 \
    libglu1-mesa \
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
    libasound2 \
    libpulse0 \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user for running Unreal Engine
RUN useradd -m -s /bin/bash -u 1000 ue4 && \
    echo "ue4 ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers


# Set working directory
WORKDIR /app

# Copy the extracted binary from downloader stage
COPY --from=downloader /app /app

# Change ownership to non-root user
RUN chown -R ue4:ue4 /app

# Verify Vulkan installation (optional, for debugging)
RUN vulkaninfo --summary || echo "Vulkan info check complete"

RUN mkdir -p /home/ue4/Documents/AirSim && \ 
    touch /home/ue4/Documents/AirSim/settings.json && \
    touch /home/ue4/Documents/AirSim/cesium.json && \
    ln -sf /home/ue4/Documents/AirSim/settings.json /home/ue4/Documents/AirSim\\settings.json && \
    ln -sf /home/ue4/Documents/AirSim/cesium.json /home/ue4/Documents/AirSim\\cesium.json

# Switch to non-root user
USER ue4

# Expose ports
# Port 3000 for the UI (from DRV docs)
# Port 8888 for PixelStreaming (if using that feature)
EXPOSE 3000 8888

# Default command - run with graphicsadapter flag as shown in docs
CMD ["./Blocks.sh", "-RenderOffscreen", "-graphicsadapter=0"]