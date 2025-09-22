# Use a slim Python image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Install system dependencies for compilation and audio
RUN apt-get update && \
    apt-get install -y gcc portaudio19-dev build-essential libssl-dev && \
    rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ . 

# Set environment variables for Flask
ENV FLASK_APP=pythonclient/server/simulation_server.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=5000

# Expose port
EXPOSE 5000

# Run the Flask app
CMD ["python", "pythonclient/server/simulation_server.py"]
