# Stage 1: Build Stage
FROM droneworld/windows-base AS build

# Set the working directory
WORKDIR C:/app

# Copy the backend code into the container
COPY ./backend C:/app/backend

# Copy the service account key for accessing project-data (projct-key.json)
COPY ./droneworld/config/projct-key.json C:/app/.gcp/projct-key.json

# Set the environment variable for the GCS service account
ENV GOOGLE_APPLICATION_CREDENTIALS="C:/app/.gcp/projct-key.json"

# Install pip and Python dependencies
RUN curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py && python get-pip.py
RUN pip install --no-cache-dir -r C:/app/backend/requirements.txt

# Stage 2: Production Stage
FROM mcr.microsoft.com/windows/nanoserver:ltsc2022

# Set the working directory in the final image
WORKDIR C:/app

# Copy only the necessary parts of the backend code and dependencies
COPY --from=build C:/app/backend C:/app/backend
COPY --from=build C:/app/.gcp/projct-key.json C:/app/.gcp/projct-key.json

# Expose the backend port
EXPOSE 5000

# Command to start the backend server
CMD ["python", "C:/app/backend/PythonClient/server/simulation_server.py"]
