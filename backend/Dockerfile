FROM python:3.10-slim

# Install system dependencies
RUN apt-get update && \
    apt-get install -y gcc portaudio19-dev build-essential libssl-dev && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements first (for caching)
COPY backend/requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend code
COPY backend/ .

# Set environment variables
ENV FLASK_APP=PythonClient/server/simulation_server.py
ENV FLASK_RUN_HOST=0.0.0.0

# Expose port for Flask
EXPOSE 5000

# Run Flask when the container starts
CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]
