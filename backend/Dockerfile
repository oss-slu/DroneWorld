# Stage 1: Build Stage
FROM droneworld/windows-base AS build

# Set the working directory
WORKDIR C:/app

# Copy the backend requirements file to install dependencies first (this helps with caching)
COPY ./backend/requirements.txt ./

# Install pip and Python dependencies
RUN curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py && python get-pip.py
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend code into the container
COPY ./backend/ ./

# Copy the service account key for accessing project-data (projct-key.json)
COPY ./config/projct-key.json C:/app/.gcp/projct-key.json

# Set the environment variable for the GCS service account
ENV GOOGLE_APPLICATION_CREDENTIALS="C:/app/.gcp/projct-key.json"

# Stage 2: Production Stage
FROM mcr.microsoft.com/windows/nanoserver:ltsc2022

# Set the working directory in the final image
WORKDIR C:/app

# Copy the built backend code and necessary files from the build stage
COPY --from=build C:/app C:/app

# Expose the backend port
EXPOSE 5000

# Command to start the backend server
CMD ["python", "backend/PythonClient/server/simulation_server.py"]
