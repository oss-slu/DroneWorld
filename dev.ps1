# DroneWorld Development Helper Script (PowerShell)
# Usage: .\dev.ps1 [command]

param(
    [Parameter(Position=0)]
    [string]$Command
)

function Print-Usage {
    Write-Host ""
    Write-Host "Usage: .\dev.ps1 [command]" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Commands:" -ForegroundColor Yellow
    Write-Host "  full        - Start all services (frontend, backend, simulator)"
    Write-Host "  dev         - Start development services only (frontend, backend)"
    Write-Host "  frontend    - Start frontend only"
    Write-Host "  backend     - Start backend only"
    Write-Host "  simulator   - Start simulator only"
    Write-Host "  logs        - Follow logs for dev services"
    Write-Host "  logs-all    - Follow logs for all services"
    Write-Host "  stop        - Stop all services"
    Write-Host "  stop-dev    - Stop development services only"
    Write-Host "  clean       - Stop and remove all containers and volumes"
    Write-Host "  help        - Show this help message"
    Write-Host ""
    Write-Host "If you get an execution policy error, run this once:"
    Write-Host ""
    Write-Host "Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser"
    Write-Host ""

}

switch ($Command) {
    "full" {
        Write-Host "🚀 Starting full stack (frontend + backend + simulator)..." -ForegroundColor Green
        docker-compose up
    }
    "dev" {
        Write-Host "🔧 Starting development services (frontend + backend only)..." -ForegroundColor Green
        docker-compose -f docker-compose.dev.yml up
    }
    "frontend" {
        Write-Host "⚛️  Starting frontend only..." -ForegroundColor Green
        docker-compose up frontend
    }
    "backend" {
        Write-Host "🐍 Starting backend only..." -ForegroundColor Green
        docker-compose up backend
    }
    "simulator" {
        Write-Host "🎮 Starting simulator only..." -ForegroundColor Green
        docker-compose up drv-unreal
    }
    "logs" {
        Write-Host "📋 Following development service logs..." -ForegroundColor Green
        docker-compose -f docker-compose.dev.yml logs -f frontend backend
    }
    "logs-all" {
        Write-Host "📋 Following all service logs..." -ForegroundColor Green
        docker-compose logs -f
    }
    "stop" {
        Write-Host "🛑 Stopping all services..." -ForegroundColor Yellow
        docker-compose down
    }
    "stop-dev" {
        Write-Host "🛑 Stopping development services..." -ForegroundColor Yellow
        docker-compose -f docker-compose.dev.yml down
    }
    "clean" {
        Write-Host "🧹 Cleaning up all containers and volumes..." -ForegroundColor Yellow
        docker-compose down -v
        docker-compose -f docker-compose.dev.yml down -v
        Write-Host "✅ Cleanup complete" -ForegroundColor Green
    }
    { $_ -eq "help" -or $_ -eq "" -or $null -eq $_ } {
        Print-Usage
    }
    default {
        Write-Host "❌ Unknown command: $Command" -ForegroundColor Red
        Print-Usage
        exit 1
    }
}