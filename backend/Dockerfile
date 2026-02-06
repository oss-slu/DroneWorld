# Use the official Python 3.10 image
FROM python:3.10-slim

# Install system-level dependencies required for the Python packages
RUN apt-get update && apt-get install -y \
    build-essential \
    libasound-dev \
    libportaudio2 \
    libportaudiocpp0 \
    portaudio19-dev \
    libjpeg-dev \
    zlib1g-dev \
    # libglx-mesa0 \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory in the container
WORKDIR /app

# Copy the backend code into the container
COPY . .

# Install the Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Configure port from build args to avoid hardcoding
ARG BACKEND_PORT=5000
ENV BACKEND_PORT=${BACKEND_PORT}
ENV FLASK_RUN_PORT=${BACKEND_PORT}

# Expose the port the backend will use
EXPOSE ${BACKEND_PORT}

# Command to start the backend server  
CMD ["sh", "-c", "flask --app PythonClient.server.simulation_server run --host=0.0.0.0 --port=${BACKEND_PORT} --debug"]
