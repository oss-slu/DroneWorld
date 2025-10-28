# Stage 1: Download and extract the binary
FROM ubuntu:22.04 AS downloader

# Prevent interactive prompts during installation
ENV DEBIAN_FRONTEND=noninteractive

# Install download tools
RUN apt-get update && apt-get install -y \
    wget \
    unzip \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /tmp/download

# Download the DRV-Unreal Linux binary from GitHub releases
ARG VERSION=v2.0.0
ARG GITHUB_REPO=UAVLab-SLU/DRV-Unreal

# Download and extract the Linux release
RUN wget https://github.com/${GITHUB_REPO}/releases/download/${VERSION}/Linux.zip -O linux.zip \
    && unzip linux.zip -d /app \
    && rm linux.zip

# Make the binary executable
RUN chmod +x /app/Blocks.sh

# Stage 2: Runtime environment with Vulkan drivers
FROM ubuntu:22.04 AS runtime

# Prevent interactive prompts during installation
ENV DEBIAN_FRONTEND=noninteractive

# Install Vulkan drivers and runtime dependencies
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
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy the extracted binary from downloader stage
COPY --from=downloader /app /app

# Verify Vulkan installation (optional, for debugging)
RUN vulkaninfo --summary || echo "Vulkan info check complete"

# Expose ports
# Port 3000 for the UI (from DRV docs)
# Port 8888 for PixelStreaming (if using that feature)
EXPOSE 3000 8888

# Default command - run with graphicsadapter flag as shown in docs
CMD ["./Blocks.sh", "-graphicsadapter=1"]