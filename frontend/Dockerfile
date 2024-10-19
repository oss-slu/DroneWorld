# Stage 1: Build Stage
FROM droneworld/windows-base AS build

# Set the working directory
WORKDIR C:/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install the necessary dependencies
RUN npm install --no-audit --no-fund --silent

# Copy the rest of the application code
COPY . .

# Stage 2: Production Stage
FROM mcr.microsoft.com/windows/nanoserver:ltsc2022

# Set the working directory in the final image
WORKDIR C:/app

# Copy the built app from the previous stage
COPY --from=build C:/app/build C:/app

# Expose the port the app runs on
EXPOSE 3000

# Command to start the frontend server
CMD ["npm", "start"]
