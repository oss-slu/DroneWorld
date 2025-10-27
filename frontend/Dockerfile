# Use Node.js for building
FROM node:20 AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Use Nginx for serving static files
FROM nginx:alpine

# Copy built frontend files (CRA outputs to /build, not /dist)
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
