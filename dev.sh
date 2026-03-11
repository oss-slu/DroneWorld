#!/bin/bash
# DroneWorld Development Helper Script

set -e

# Prefer docker compose v2 plugin, fallback to docker-compose v1 binary.
resolve_compose() {
    if command -v docker-compose >/dev/null 2>&1; then
        DOCKER_COMPOSE=(docker-compose)
        return 0
    fi
    if command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1; then
        DOCKER_COMPOSE=(docker compose)
        return 0
    fi
    echo "❌ Docker Compose not found. Install Docker Compose or enable the Docker Compose plugin."
    exit 1
}

resolve_compose

check_token() {
    # Check if token is in environment
    if [ -n "$GITHUB_TOKEN" ]; then
        return 0
    fi
    
    # Check if token is in .env file and auto-export it
    if [ -f .env ] && grep -q "^GITHUB_TOKEN=" .env; then
        token=$(grep "^GITHUB_TOKEN=" .env | cut -d '=' -f2-)
        if [ -n "$token" ]; then
            export GITHUB_TOKEN="$token"
            echo "✅ Loaded GITHUB_TOKEN from .env"
            return 0
        fi
    fi
    
    echo "⚠️  GITHUB_TOKEN not found."
    echo "Run './dev.sh token' to set it up."
    return 1
}

set_token() {
    echo "🔑 Setting up GITHUB_TOKEN..."
    echo ""
    
    # Check if token already exists in .env
    if [ -f .env ] && grep -q "^GITHUB_TOKEN=" .env; then
        current_token=$(grep "^GITHUB_TOKEN=" .env | cut -d '=' -f2-)
        if [ -n "$current_token" ]; then
            echo "✅ Found existing token in .env: ${current_token:0:10}..."
            read -p "Use existing token? (Y/n): " -n 1 -r
            echo ""
            if [[ $REPLY =~ ^[Yy]$ ]] || [[ -z $REPLY ]]; then
                export GITHUB_TOKEN="$current_token"
                echo "✅ Token exported for current session"
                return 0
            fi
        fi
    fi
    
    # Prompt for new token
    read -sp "Enter your GitHub Personal Access Token: " token
    echo ""
    
    if [ -z "$token" ]; then
        echo "❌ No token provided"
        return 1
    fi
    
    export GITHUB_TOKEN="$token"
    
    # Save to .env file in root
    if [ -f .env ] && grep -q "^GITHUB_TOKEN=" .env; then
        # Update existing token
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            sed -i '' "s|^GITHUB_TOKEN=.*|GITHUB_TOKEN=$token|" .env
        else
            # Linux
            sed -i "s|^GITHUB_TOKEN=.*|GITHUB_TOKEN=$token|" .env
        fi
        echo "✅ Updated GITHUB_TOKEN in .env"
    else
        # Add new token
        echo "GITHUB_TOKEN=$token" >> .env
        echo "✅ Added GITHUB_TOKEN to .env"
    fi
    
    echo "✅ Token exported for current session"
}

print_usage() {
    echo "Usage: ./dev.sh [command]"
    echo ""
    echo "Commands:"
    echo "  token       - Set GITHUB_TOKEN for building simulator (required for 'full' and 'simulator')"
    echo "  full        - Start all services (frontend, backend, simulator)"
    echo "  full-rebuild - Rebuild and start full stack (frontend, backend, simulator)"
    echo "  dev         - Start development services only (frontend, backend)"
    echo "  dev-rebuild - Rebuild and start development services (frontend, backend)"
    echo "  dev-rebuild-frontend - Rebuild frontend image, then start frontend in dev compose"
    echo "  dev-rebuild-backend - Rebuild backend image, then start backend in dev compose"
    echo "  frontend    - Start frontend only"
    echo "  backend     - Start backend only"
    echo "  simulator   - Start simulator only"
    echo "  logs        - Follow logs for dev services"
    echo "  logs-all    - Follow logs for all services"
    echo "  stop        - Stop all services"
    echo "  stop-dev    - Stop development services only"
    echo "  clean       - Stop and remove all containers and volumes"
    echo "  help        - Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./dev.sh token        # Set GitHub token (needed before 'full' or 'simulator')"
    echo "  ./dev.sh dev          # Quick start for development"
    echo "  ./dev.sh dev-rebuild  # Rebuild frontend/backend images, then start dev services"
    echo "  ./dev.sh dev-rebuild-frontend # Rebuild only frontend image"
    echo "  ./dev.sh dev-rebuild-backend  # Rebuild only backend image"
    echo "  ./dev.sh full         # Start everything including simulator"
    echo "  ./dev.sh full-rebuild # Rebuild all images, then start full stack"
}

case "$1" in
    token)
        set_token
        ;;
    full)
        if ! check_token; then
            echo ""
            read -p "Continue without token? The simulator will fail to build. (y/N): " -n 1 -r
            echo ""
            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                exit 1
            fi
        fi
        echo "🚀 Starting full stack (frontend + backend + simulator)..."
        "${DOCKER_COMPOSE[@]}" --profile gcs up
        ;;
    full-rebuild)
        if ! check_token; then
            echo ""
            read -p "Continue without token? The simulator will fail to build. (y/N): " -n 1 -r
            echo ""
            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                exit 1
            fi
        fi
        echo "🚀 Rebuilding and starting full stack (frontend + backend + simulator)..."
        "${DOCKER_COMPOSE[@]}" --profile gcs down
        "${DOCKER_COMPOSE[@]}" --profile gcs build
        "${DOCKER_COMPOSE[@]}" --profile gcs up
        ;;
    dev)
        echo "🔧 Starting development services (frontend + backend only)..."
        "${DOCKER_COMPOSE[@]}" -f docker-compose.dev.yaml up
        ;;
    dev-rebuild)
        echo "🔧 Rebuilding and starting development services (frontend + backend only)..."
        "${DOCKER_COMPOSE[@]}" -f docker-compose.dev.yaml down
        "${DOCKER_COMPOSE[@]}" -f docker-compose.dev.yaml build frontend backend
        "${DOCKER_COMPOSE[@]}" -f docker-compose.dev.yaml up
        ;;
    dev-rebuild-frontend)
        echo "⚛️  Rebuilding frontend image and starting frontend in development compose..."
        "${DOCKER_COMPOSE[@]}" -f docker-compose.dev.yaml build frontend
        "${DOCKER_COMPOSE[@]}" -f docker-compose.dev.yaml up frontend
        ;;
    dev-rebuild-backend)
        echo "🐍 Rebuilding backend image and starting backend in development compose..."
        "${DOCKER_COMPOSE[@]}" -f docker-compose.dev.yaml build backend
        "${DOCKER_COMPOSE[@]}" -f docker-compose.dev.yaml up backend
        ;;
    frontend)
        echo "⚛️  Starting frontend only..."
        "${DOCKER_COMPOSE[@]}" up frontend
        ;;
    backend)
        echo "🐍 Starting backend only..."
        "${DOCKER_COMPOSE[@]}" up backend
        ;;
    simulator)
        if ! check_token; then
            echo ""
            read -p "Continue without token? The simulator will fail to build. (y/N): " -n 1 -r
            echo ""
            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                exit 1
            fi
        fi
        echo "🎮 Starting simulator only..."
        "${DOCKER_COMPOSE[@]}" up drv-unreal
        ;;
    logs)
        echo "📋 Following development service logs..."
        "${DOCKER_COMPOSE[@]}" -f docker-compose.dev.yaml logs -f frontend backend
        ;;
    logs-all)
        echo "📋 Following all service logs..."
        "${DOCKER_COMPOSE[@]}" logs -f
        ;;
    stop)
        echo "🛑 Stopping all services..."
        "${DOCKER_COMPOSE[@]}" down
        ;;
    stop-dev)
        echo "🛑 Stopping development services..."
        "${DOCKER_COMPOSE[@]}" -f docker-compose.dev.yaml down
        ;;
    clean)
        echo "🧹 Cleaning up all containers and volumes..."
        "${DOCKER_COMPOSE[@]}" down -v
        "${DOCKER_COMPOSE[@]}" -f docker-compose.dev.yaml down -v
        echo "✅ Cleanup complete"
        ;;
    help|"")
        print_usage
        ;;
    *)
        echo "❌ Unknown command: $1"
        echo ""
        print_usage
        exit 1
        ;;
esac
