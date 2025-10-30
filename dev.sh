#!/bin/bash
# DroneWorld Development Helper Script

set -e

print_usage() {
    echo "Usage: ./dev.sh [command]"
    echo ""
    echo "Commands:"
    echo "  full        - Start all services (frontend, backend, simulator)"
    echo "  dev         - Start development services only (frontend, backend)"
    echo "  frontend    - Start frontend only"
    echo "  backend     - Start backend only"
    echo "  simulator   - Start simulator only"
    echo "  logs        - Follow logs for dev services"
    echo "  logs-all    - Follow logs for all services"
    echo "  stop        - Stop all services"
    echo "  stop-dev    - Stop development services only"
    echo "  clean       - Stop and remove all containers and volumes"
    echo "  help        - Show this help message"
}

case "$1" in
    full)
        echo "🚀 Starting full stack (frontend + backend + simulator)..."
        docker-compose up
        ;;
    dev)
        echo "🔧 Starting development services (frontend + backend only)..."
        docker-compose -f docker-compose.dev.yml up
        ;;
    frontend)
        echo "⚛️  Starting frontend only..."
        docker-compose up frontend
        ;;
    backend)
        echo "🐍 Starting backend only..."
        docker-compose up backend
        ;;
    simulator)
        echo "🎮 Starting simulator only..."
        docker-compose up drv-unreal
        ;;
    logs)
        echo "📋 Following development service logs..."
        docker-compose -f docker-compose.dev.yml logs -f frontend backend
        ;;
    logs-all)
        echo "📋 Following all service logs..."
        docker-compose logs -f
        ;;
    stop)
        echo "🛑 Stopping all services..."
        docker-compose down
        ;;
    stop-dev)
        echo "🛑 Stopping development services..."
        docker-compose -f docker-compose.dev.yml down
        ;;
    clean)
        echo "🧹 Cleaning up all containers and volumes..."
        docker-compose down -v
        docker-compose -f docker-compose.dev.yml down -v
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