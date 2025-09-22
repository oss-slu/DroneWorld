FROM python:3.10-slim

# Install system dependencies for PyAudio and building wheels
RUN apt-get update && \
    apt-get install -y gcc portaudio19-dev build-essential libssl-dev && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements first (to leverage Docker caching)
COPY backend/requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ .

# Set default command (adjust as needed)
CMD ["python", "app.py"]
