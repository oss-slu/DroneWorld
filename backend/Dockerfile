# Use slim Python base
FROM python:3.10-slim

# Install system dependencies for PyAudio & others
RUN apt-get update && \
    apt-get install -y gcc portaudio19-dev build-essential libssl-dev && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy only requirements first (for better Docker caching)
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend code
COPY . .

# Default command (adjust if needed)
CMD ["python", "app.py"]
