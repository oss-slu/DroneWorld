# Step 1: Prerequisites
- Python 3.10
- Node.js
- Microsoft Visual C++ Runtime
- DirectX Runtime
- Unreal Engine (Optional)
- [DRV Unreal Engine Binaries](https://sluedu-my.sharepoint.com/personal/ankit_agrawal_1_slu_edu/_layouts/15/onedrive.aspx?ga=1&id=%2Fpersonal%2Fankit%5Fagrawal%5F1%5Fslu%5Fedu%2FDocuments%2FDroneWorld)

# Step 2: Setup
## Unreal Engine Application
There are two ways to open the Unreal application: Editor mode and Executable mode. Editor mode allows real-time adjustments to the environment but requires Unreal Engine. Executable mode does not require Unreal Engine.

### Editor mode
(In-Progress)

### Executable mode
1. Download the latest `DRV_{version}.zip` from this [link](https://sluedu-my.sharepoint.com/personal/ankit_agrawal_1_slu_edu/_layouts/15/onedrive.aspx?ga=1&id=%2Fpersonal%2Fankit%5Fagrawal%5F1%5Fslu%5Fedu%2FDocuments%2FDroneWorld).
2. Extract the contents.
3. Run the `Blocks.exe` file.

## Backend
To prepare the environment and start the backend, follow these steps:
1. Navigate to the "backend" folder in the project repository:
```
cd backend 
```
2. Create a virtual environment:
```
python -m venv venv
```
> To create a virtual environment with a specific version:
```
python -3.10 -m venv venv
````
3. Activate the virtual environment:  
- Windows:
```powershell
source venv/Scripts/activate
```
- Mac:
```bash
source venv/bin/activate
```
4. Install the necessary dependencies:
```
pip3 install -r requirements.txt
```
5. Start the server:
```
python ./PythonClient/server/simulation_server.py
```
This will start the backend server and allow it to communicate with the Unreal application.

## Frontend
1. Navigate to the "frontend" folder in the project repository:
``` 
cd frontend
```
2. Install the necessary dependencies:
``` 
npm install
```
3. Start the frontend server:
```
npm start
```
This will start the frontend server and allow you to access the user interface in your web browser.

# Step 3: Airsim
Follow these steps to create an AirSim folder in your Documents folder, which is required for testing the report-dashboard and landing page:
1. Open your file management application.
2. Navigate to your Documents folder.
3. Inside the Documents folder, create a new folder named `AirSim`.  

_Note: A folder named `AirSim`, along with `settings.json`, will be automatically created if you load a map in `Blocks.exe`._
