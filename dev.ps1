# DroneWorld Development Helper Script (PowerShell)
# Usage: .\dev.ps1 [command]

param(
    [Parameter(Position = 0)]
    [string]$Command
)

function Check-Token {
    # Check if token is in environment
    if (-not [string]::IsNullOrWhiteSpace($env:GITHUB_TOKEN)) {
        return $true
    }
    
    # Check if token is in .env file and auto-export it
    if (Test-Path ".env") {
        $envContent = Get-Content ".env"
        $tokenLine = $envContent | Where-Object { $_ -match "^GITHUB_TOKEN=" }
        if ($tokenLine) {
            $token = $tokenLine -replace "^GITHUB_TOKEN=", ""
            if (-not [string]::IsNullOrWhiteSpace($token)) {
                $env:GITHUB_TOKEN = $token
                Write-Host "[OK] Loaded GITHUB_TOKEN from .env" -ForegroundColor Green
                return $true
            }
        }
    }
    
    Write-Host "[WARNING] GITHUB_TOKEN not found." -ForegroundColor Yellow
    Write-Host "Run '.\dev.ps1 token' to set it up." -ForegroundColor Yellow
    return $false
}

function Set-Token {
    Write-Host "[SETUP] Setting up GITHUB_TOKEN..." -ForegroundColor Green
    Write-Host ""
    
    # Check if token already exists in .env
    if (Test-Path ".env") {
        $envContent = Get-Content ".env"
        $tokenLine = $envContent | Where-Object { $_ -match "^GITHUB_TOKEN=" }
        if ($tokenLine) {
            $currentToken = $tokenLine -replace "^GITHUB_TOKEN=", ""
            if (-not [string]::IsNullOrWhiteSpace($currentToken)) {
                $preview = $currentToken.Substring(0, [Math]::Min(10, $currentToken.Length))
                Write-Host "[OK] Found existing token in .env: $preview..." -ForegroundColor Green
                $response = Read-Host "Use existing token? (Y/n)"
                if ([string]::IsNullOrWhiteSpace($response) -or $response -match "^[Yy]$") {
                    $env:GITHUB_TOKEN = $currentToken
                    Write-Host "[OK] Token exported for current session" -ForegroundColor Green
                    return
                }
            }
        }
    }
    
    # Prompt for new token
    $secureToken = Read-Host "Enter your GitHub Personal Access Token" -AsSecureString
    $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureToken)
    $token = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
    [System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($BSTR)
    
    if ([string]::IsNullOrWhiteSpace($token)) {
        Write-Host "[ERROR] No token provided" -ForegroundColor Red
        return
    }
    
    # Set environment variable for current session
    $env:GITHUB_TOKEN = $token
    
    # Save to .env file in root
    $envFile = ".env"
    $tokenLine = "GITHUB_TOKEN=$token"
    
    if (Test-Path $envFile) {
        $content = Get-Content $envFile
        $found = $false
        $newContent = $content | ForEach-Object {
            if ($_ -match "^GITHUB_TOKEN=") {
                $found = $true
                $tokenLine
            }
            else {
                $_
            }
        }
        
        if ($found) {
            $newContent | Set-Content $envFile
            Write-Host "[OK] Updated GITHUB_TOKEN in .env" -ForegroundColor Green
        }
        else {
            Add-Content $envFile "`n$tokenLine"
            Write-Host "[OK] Added GITHUB_TOKEN to .env" -ForegroundColor Green
        }
    }
    else {
        $tokenLine | Set-Content $envFile
        Write-Host "[OK] Created .env with GITHUB_TOKEN" -ForegroundColor Green
    }
    
    Write-Host "[OK] Token exported for current session" -ForegroundColor Green
}

function Print-Usage {
    Write-Host ""
    Write-Host "Usage: .\dev.ps1 [command]" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Commands:" -ForegroundColor Yellow
    Write-Host "  token       - Set GITHUB_TOKEN for building simulator (required for 'full' and 'simulator')"
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
    Write-Host "Examples:" -ForegroundColor Cyan
    Write-Host "  .\dev.ps1 token        # Set GitHub token (needed before 'full' or 'simulator')"
    Write-Host "  .\dev.ps1 dev          # Quick start for development"
    Write-Host "  .\dev.ps1 full         # Start everything including simulator"
    Write-Host ""
    Write-Host "If you get an execution policy error, run this once:" -ForegroundColor Red
    Write-Host ""
    Write-Host "Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser"
    Write-Host ""
}

switch ($Command) {
    "token" {
        Set-Token
    }
    "full" {
        if (-not (Check-Token)) {
            Write-Host ""
            $response = Read-Host "Continue without token? The simulator will fail to build. (y/N)"
            if ($response -notmatch "^[Yy]$") {
                exit 1
            }
        }
        Write-Host "[START] Starting full stack (frontend + backend + simulator)..." -ForegroundColor Green
        docker-compose up
    }
    "dev" {
        Write-Host "[START] Starting development services (frontend + backend only)..." -ForegroundColor Green
        docker-compose -f docker-compose.dev.yaml up
    }
    "frontend" {
        Write-Host "[START] Starting frontend only..." -ForegroundColor Green
        docker-compose up frontend
    }
    "backend" {
        Write-Host "[START] Starting backend only..." -ForegroundColor Green
        docker-compose up backend
    }
    "simulator" {
        if (-not (Check-Token)) {
            Write-Host ""
            $response = Read-Host "Continue without token? The simulator will fail to build. (y/N)"
            if ($response -notmatch "^[Yy]$") {
                exit 1
            }
        }
        Write-Host "[START] Starting simulator only..." -ForegroundColor Green
        docker-compose up drv-unreal
    }
    "logs" {
        Write-Host "[LOGS] Following development service logs..." -ForegroundColor Green
        docker-compose -f docker-compose.dev.yaml logs -f frontend backend
    }
    "logs-all" {
        Write-Host "[LOGS] Following all service logs..." -ForegroundColor Green
        docker-compose logs -f
    }
    "stop" {
        Write-Host "[STOP] Stopping all services..." -ForegroundColor Yellow
        docker-compose down
    }
    "stop-dev" {
        Write-Host "[STOP] Stopping development services..." -ForegroundColor Yellow
        docker-compose -f docker-compose.dev.yaml down
    }
    "clean" {
        Write-Host "[CLEAN] Cleaning up all containers and volumes..." -ForegroundColor Yellow
        docker-compose down -v
        docker-compose -f docker-compose.dev.yaml down -v
        Write-Host "[OK] Cleanup complete" -ForegroundColor Green
    }
    { $_ -eq "help" -or $_ -eq "" -or $null -eq $_ } {
        Print-Usage
    }
    default {
        Write-Host "[ERROR] Unknown command: $Command" -ForegroundColor Red
        Print-Usage
        exit 1
    }
}