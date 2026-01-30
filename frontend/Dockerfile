# Use an official Node.js runtime as a parent image
FROM node:20

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install the necessary dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
ARG FRONTEND_PORT
ENV FRONTEND_PORT=${FRONTEND_PORT}
ENV PORT=${FRONTEND_PORT}
EXPOSE ${FRONTEND_PORT}

# Command to start the frontend
CMD ["npm", "start"]
