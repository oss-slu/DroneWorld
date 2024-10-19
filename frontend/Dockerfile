# Stage 1: Build Stage
FROM droneworld/windows-base AS build

# Set the working directory
WORKDIR C:/app

# Increase Node.js memory limit
ENV NODE_OPTIONS=--max_old_space_size=4096

# Copy package.json and package-lock.json from the frontend directory
COPY ./frontend/package*.json ./

# Install the necessary dependencies
RUN npm install --no-audit --no-fund --silent

# Copy the rest of the frontend code from the frontend directory
COPY ./frontend/ ./

# Build the frontend app
RUN npm run build

# Stage 2: Production Stage
FROM mcr.microsoft.com/windows/nanoserver:ltsc2022

# Set the working directory in the final image
WORKDIR C:/app

# Set Node.js memory limit in the production image
ENV NODE_OPTIONS=--max_old_space_size=4096

# Copy the built app from the previous stage
COPY --from=build C:/app/build C:/app

# Expose the port the app runs on
EXPOSE 3000

# Command to start the frontend server
CMD ["npm", "start"]
