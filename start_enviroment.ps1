
#security permissions for npm start, if you dont allow just type "npm start" after the script runs

Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
function Write-Info($msg) {
    Write-Host "`n[INFO] $msg`n" -ForegroundColor Cyan
}

#create or check if airsim doc is existing
$documentsPath = [Environment]::GetFolderPath('MyDocuments')
$airsimPath = Join-Path $documentsPath "AirSim"

if (-Not (Test-Path $airsimPath)) {
    New-Item -ItemType Directory -Path $airsimPath | Out-Null
    Write-Host "Created AirSim folder at: $airsimPath" -ForegroundColor Green
} else {
    Write-Host "AirSim folder already exists at: $airsimPath" -ForegroundColor Yellow
}



#check if venv is made, otherwise do the whole install
if (-Not (Test-Path "venv")) {
    Write-Host "Creating virtual enviroment 'venv' " -ForegroundColor Green
    py -3.10 -m venv venv
} else {
    Write-Host "Found exisitng virtual enviroment 'venv' " -ForegroundColor Yellow
}

.\venv\Scripts\Activate.ps1

Write-Info "installing requirements..."
pip install -r requirements.txt

#back end starting 
Write-Info "Starting backend..."
Set-Location -Path ".\backend"


#open another shell for backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd $(Get-Location)\PythonClient\server; py simulation_server.py"

# front end starting
Write-Info "Starting frontend..."
Set-Location -Path "..\frontend"

npm install

#open another shell for frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd $(Get-Location); npm start"

