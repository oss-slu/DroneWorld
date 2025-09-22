# Use Python 3.10 slim as base
FROM python:3.10-slim

# Set working directory inside container
WORKDIR /app

# Install system dependencies needed for building packages like PyAudio
RUN apt-get update && \
    apt-get install -y gcc portaudio19-dev build-essential libssl-dev && \
    rm -rf /var/lib/apt/lists/*

# Copy Python requirements and install them
COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend code
COPY . .

# Expose Flask port
EXPOSE 5000

# Set the default command to run your Flask app
CMD ["python", "simulation_server.py"]
