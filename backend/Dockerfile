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
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container
COPY . .

# Copy the settings.json file into the appropriate location
COPY config/settings.json /root/Documents/AirSim/settings.json

# Install the Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose the port the backend server will use
EXPOSE 5000

# Command to start the backend server
CMD ["python", "./PythonClient/server/simulation_server.py"]
