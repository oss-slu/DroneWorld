import logging
import os
import threading
import time
import sys
from flask import Flask, request, abort, render_template, Response, jsonify
from flask_cors import CORS
from flasgger import Swagger
from marshmallow import Schema, fields, validate, ValidationError
from functools import wraps

# Add parent directories to the Python path for module imports
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

# Import the SimulationTaskManager
from PythonClient.multirotor.control.simulation_task_manager import SimulationTaskManager

# Import the storage service from the configuration module
from PythonClient.multirotor.storage.storage_config import get_storage_service

app = Flask(__name__, template_folder="./templates")

# Configure logging to suppress Werkzeug logs except for errors
log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)
CORS(app)

# Initialize Swagger for API documentation
swagger_config = {
    "headers": [],
    "specs": [
        {
            "endpoint": "apispec",
            "route": "/apispec.json",
            "rule_filter": lambda rule: True,
            "model_filter": lambda tag: True,
        }
    ],
    "static_url_path": "/flasgger_static",
    "swagger_ui": True,
    "specs_route": "/api/docs"
}

swagger_template = {
    "info": {
        "title": "DroneWorld API",
        "description": """
        DroneWorld API provides comprehensive endpoints for managing drone simulation scenarios.
        
        **Key Features:**
        - Configure simulation environments (weather, terrain, time of day)
        - Manage drone configurations and missions
        - Monitor simulation safety parameters
        - Submit and track simulation tasks
        - Access simulation reports and results
        - Stream live camera feeds from drones
        
        **API Versioning:**
        This API follows URL-based versioning. The current version is v1 (default).
        Future versions will be accessible at `/api/v2/`, `/api/v3/`, etc.
        
        **Authentication:**
        Currently, no authentication is required for API access. All endpoints are publicly accessible.
        Future versions may implement API key or JWT-based authentication.
        """,
        "version": "1.0.0",
        "contact": {
            "name": "OSS-SLU",
            "url": "https://github.com/oss-slu/DroneWorld",
            "email": None
        },
        "license": {
            "name": "MIT",
            "url": "https://opensource.org/licenses/MIT"
        },
        "termsOfService": "https://github.com/oss-slu/DroneWorld/blob/main/LICENSE"
    },
    "servers": [
        {
            "url": "http://localhost:5000",
            "description": "Local development server"
        },
        {
            "url": "https://api.droneworld.com",
            "description": "Production server (if applicable)"
        }
    ],
    "tags": [
        {
            "name": "Health",
            "description": "Health check and status endpoints"
        },
        {
            "name": "Simulation",
            "description": "Simulation configuration and state management"
        },
        {
            "name": "Drones",
            "description": "Drone configuration and management"
        },
        {
            "name": "Tasks",
            "description": "Simulation task submission and tracking"
        },
        {
            "name": "Reports",
            "description": "Report generation and retrieval"
        },
        {
            "name": "State",
            "description": "Simulation engine state and configuration"
        },
        {
            "name": "Streaming",
            "description": "Live camera streaming from drones"
        }
    ],
    "components": {
        "securitySchemes": {
            "apiKey": {
                "type": "apiKey",
                "in": "header",
                "name": "X-API-Key",
                "description": "API Key authentication (not currently required, reserved for future use)"
            },
            "bearerAuth": {
                "type": "http",
                "scheme": "bearer",
                "bearerFormat": "JWT",
                "description": "JWT Bearer token authentication (not currently required, reserved for future use)"
            }
        }
    },
    "security": []
}

swagger = Swagger(app, config=swagger_config, template=swagger_template)

# Initialize the SimulationTaskManager
task_dispatcher = SimulationTaskManager()
threading.Thread(target=task_dispatcher.start, daemon=True).start()

task_number = 1  # Global task counter

# Initialize the storage service
storage_service = get_storage_service()
print(f"Using {storage_service.__class__.__name__} as the storage service.")

# === Schema Validation Classes ===

class DroneSchema(Schema):
    """Schema for drone validation"""
    id = fields.Str(required=True, validate=validate.Length(min=1))
    name = fields.Str(required=False, validate=validate.Length(max=100))
    type = fields.Str(required=False)
    battery_level = fields.Int(required=False, validate=validate.Range(min=0, max=100))
    status = fields.Str(required=False)

class EnvironmentSchema(Schema):
    """Schema for environment configuration validation"""
    weather = fields.Dict(required=False)
    terrain = fields.Dict(required=False)
    timeOfDay = fields.Str(required=False)
    wind = fields.Dict(required=False)

class MonitorsSchema(Schema):
    """Schema for monitors configuration validation"""
    battery_monitor = fields.Dict(required=False)
    collision_monitor = fields.Dict(required=False)
    drift_monitor = fields.Dict(required=False)
    waypoint_monitor = fields.Dict(required=False)

class TaskSchema(Schema):
    """Schema for simulation task validation"""
    environment = fields.Dict(required=True)
    drones = fields.List(fields.Dict(), required=True, validate=validate.Length(min=1))
    monitors = fields.Dict(required=True)

def validate_json(schema_class):
    """Decorator to validate JSON request body against a schema"""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if not request.is_json:
                return jsonify({"error": "Content-Type must be application/json"}), 400
            
            data = request.get_json()
            if data is None:
                return jsonify({"error": "Invalid JSON in request body"}), 400
            
            schema = schema_class()
            try:
                validated_data = schema.load(data)
                # Store validated data in request for use in endpoint
                request.validated_data = validated_data
            except ValidationError as err:
                return jsonify({"error": "Validation failed", "details": err.messages}), 400
            return f(*args, **kwargs)
        return decorated_function
    return decorator

# === Simulation Configuration State ===
simulation_state = {
    "environment": {},
    "monitors": {},
    "drones": []
}

# === New API Routes ===

@app.route('/api/simulation', methods=['GET'])
def get_simulation_state():
    """
    Get simulation state
    ---
    tags:
      - Simulation
    summary: Retrieve the current simulation state
    description: Returns the complete current simulation state including environment, monitors, and drones. No query parameters are currently supported.
    parameters: []
    responses:
      200:
        description: Simulation state retrieved successfully
        content:
          application/json:
            schema:
              type: object
              properties:
                environment:
                  type: object
                  description: Environment configuration settings
                monitors:
                  type: object
                  description: Monitor configuration settings
                drones:
                  type: array
                  items:
                    type: object
                  description: List of configured drones
            example:
              environment: {}
              monitors: {}
              drones: []
    """
    return jsonify(simulation_state), 200

@app.route('/api/simulation/drones', methods=['POST'])
@validate_json(DroneSchema)
def add_drone():
    """
    Add a new drone to the simulation
    ---
    tags:
      - Simulation
      - Drones
    summary: Add a new drone configuration
    description: Adds a new drone to the simulation configuration. Request body is validated against the drone schema.
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required:
              - id
            properties:
              id:
                type: string
                description: Unique identifier for the drone
                example: "drone-001"
              name:
                type: string
                description: Human-readable name for the drone
                example: "Alpha Drone"
              type:
                type: string
                description: Type or model of the drone
                example: "UAV-301"
              battery_level:
                type: integer
                description: Battery level percentage (0-100)
                minimum: 0
                maximum: 100
                example: 85
              status:
                type: string
                description: Current status of the drone
                example: "active"
          example:
            id: "drone-001"
            name: "Alpha Drone"
            type: "UAV-301"
            battery_level: 85
            status: "active"
    responses:
      201:
        description: Drone added successfully
        content:
          application/json:
            schema:
              type: object
              properties:
                id:
                  type: string
                name:
                  type: string
            example:
              id: "drone-001"
              name: "Alpha Drone"
      400:
        description: Invalid drone data provided or validation failed
        content:
          application/json:
            schema:
              type: object
              properties:
                error:
                  type: string
                  example: "Validation failed"
                details:
                  type: object
                  description: Detailed validation error messages
                  example:
                    id: ["Missing data for required field."]
            examples:
              missing_field:
                value:
                  error: "Validation failed"
                  details:
                    id: ["Missing data for required field."]
              invalid_type:
                value:
                  error: "Validation failed"
                  details:
                    battery_level: ["Not a valid integer."]
    """
    # Use validated data from decorator
    new_drone = request.validated_data
    simulation_state["drones"].append(new_drone)
    return jsonify(new_drone), 201

@app.route('/api/simulation/drones/<drone_id>', methods=['PUT'])
@validate_json(DroneSchema)
def update_drone(drone_id):
    """
    Update an existing drone's configuration
    ---
    tags:
      - Simulation
      - Drones
    summary: Update drone configuration
    description: Updates the configuration of an existing drone by ID. Request body is validated against the drone schema.
    parameters:
      - name: drone_id
        in: path
        required: true
        schema:
          type: string
        description: Unique identifier of the drone to update
        example: "drone-001"
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required:
              - id
            properties:
              id:
                type: string
                description: Unique identifier for the drone
              name:
                type: string
                description: Human-readable name for the drone
              type:
                type: string
                description: Type or model of the drone
              battery_level:
                type: integer
                description: Battery level percentage (0-100)
                minimum: 0
                maximum: 100
              status:
                type: string
                description: Current status of the drone
          example:
            id: "drone-001"
            name: "Alpha Drone Updated"
            battery_level: 90
    responses:
      200:
        description: Drone updated successfully
        content:
          application/json:
            schema:
              type: object
              properties:
                id:
                  type: string
                name:
                  type: string
            example:
              id: "drone-001"
              name: "Alpha Drone Updated"
      404:
        description: Drone not found
        content:
          application/json:
            schema:
              type: object
              properties:
                error:
                  type: string
                  example: "Drone not found"
    """
    # Use validated data from decorator
    updated_drone = request.validated_data
    for i, drone in enumerate(simulation_state["drones"]):
        if str(drone["id"]) == drone_id:
            simulation_state["drones"][i] = updated_drone
            return jsonify(updated_drone), 200
    return jsonify({"error": "Drone not found"}), 404

@app.route('/api/simulation/drones/<drone_id>', methods=['DELETE'])
def delete_drone(drone_id):
    """
    Remove a drone from the simulation
    ---
    tags:
      - Simulation
      - Drones
    summary: Delete a drone configuration
    description: Removes a drone from the simulation configuration by ID
    parameters:
      - name: drone_id
        in: path
        required: true
        schema:
          type: string
        description: Unique identifier of the drone to delete
        example: "drone-001"
    responses:
      200:
        description: Drone deleted successfully
        content:
          application/json:
            schema:
              type: object
              properties:
                message:
                  type: string
                  example: "Drone deleted"
      404:
        description: Drone not found
        content:
          application/json:
            schema:
              type: object
              properties:
                error:
                  type: string
                  example: "Drone not found"
    """
    for i, drone in enumerate(simulation_state["drones"]):
        if str(drone["id"]) == drone_id:
            del simulation_state["drones"][i]
            return jsonify({"message": "Drone deleted"}), 200
    return jsonify({"error": "Drone not found"}), 404

@app.route('/api/simulation/environment', methods=['PUT'])
@validate_json(EnvironmentSchema)
def update_environment():
    """
    Update the simulation environment settings
    ---
    tags:
      - Simulation
    summary: Update environment configuration
    description: Updates the simulation environment settings including weather, terrain, and other environmental factors. Request body is validated against the environment schema.
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            properties:
              weather:
                type: object
                description: Weather configuration settings
              terrain:
                type: object
                description: Terrain configuration settings
              timeOfDay:
                type: string
                description: Time of day setting
                example: "noon"
              wind:
                type: object
                description: Wind configuration settings
          example:
            weather:
              condition: "clear"
            terrain:
              type: "mountain"
            timeOfDay: "noon"
    responses:
      200:
        description: Environment updated successfully
        content:
          application/json:
            schema:
              type: object
              properties:
                message:
                  type: string
                  example: "Environment updated"
      400:
        description: Invalid environment data
        content:
          application/json:
            schema:
              type: object
              properties:
                error:
                  type: string
                  example: "Invalid environment data"
    """
    # Use validated data from decorator
    new_environment = request.validated_data
    simulation_state["environment"] = new_environment
    return jsonify({"message": "Environment updated"}), 200

@app.route('/api/simulation/monitors', methods=['PUT'])
@validate_json(MonitorsSchema)
def update_monitors():
    """
    Update the simulation monitor settings
    ---
    tags:
      - Simulation
    summary: Update monitor configuration
    description: Updates the simulation monitor settings for safety and performance monitoring. Request body is validated against the monitors schema.
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            properties:
              battery_monitor:
                type: object
                description: Battery monitoring configuration
              collision_monitor:
                type: object
                description: Collision detection monitoring configuration
              drift_monitor:
                type: object
                description: Drift monitoring configuration
              waypoint_monitor:
                type: object
                description: Waypoint monitoring configuration
          example:
            battery_monitor:
              enabled: true
              threshold: 20
            collision_monitor:
              enabled: true
    responses:
      200:
        description: Monitors updated successfully
        content:
          application/json:
            schema:
              type: object
              properties:
                message:
                  type: string
                  example: "Monitors updated"
      400:
        description: Invalid monitor data
        content:
          application/json:
            schema:
              type: object
              properties:
                error:
                  type: string
                  example: "Invalid monitor data"
    """
    # Use validated data from decorator
    new_monitors = request.validated_data
    simulation_state["monitors"] = new_monitors
    return jsonify({"message": "Monitors updated"}), 200

# === Flask Routes ===

@app.route('/list-reports', methods=['GET'])
def list_reports():
    """
    List all report batches
    ---
    tags:
      - Reports
    summary: Retrieve list of all report batches
    description: Returns a list of all available report batches from the storage service
    responses:
      200:
        description: Reports listed successfully
        content:
          application/json:
            schema:
              type: array
              items:
                type: object
                properties:
                  name:
                    type: string
                    description: Report batch name/identifier
                  created:
                    type: string
                    description: Creation timestamp
            example:
              - name: "2024-01-15-10-30-45_Batch_1"
                created: "2024-01-15T10:30:45Z"
              - name: "2024-01-15-11-15-20_Batch_2"
                created: "2024-01-15T11:15:20Z"
      500:
        description: Failed to list reports
        content:
          application/json:
            schema:
              type: object
              properties:
                error:
                  type: string
                  example: "Failed to list reports"
    """
    try:
        reports = storage_service.list_reports()
        if 'error' in reports:
            return jsonify({'error': 'Failed to list reports'}), 500
        return jsonify(reports)
    except Exception as e:
        print(f"Error fetching reports: {e}")
        return jsonify({'error': 'Failed to list reports'}), 500

@app.route('/list-folder-contents/<folder_name>', methods=['POST'])
def list_folder_contents(folder_name):
    """
    List contents of a report folder
    ---
    tags:
      - Reports
    summary: Retrieve contents of a specific report folder
    description: Returns the contents (files and subdirectories) of a specific report folder from the storage service
    parameters:
      - name: folder_name
        in: path
        required: true
        schema:
          type: string
        description: Name of the report folder to list contents for
        example: "2024-01-15-10-30-45_Batch_1"
    requestBody:
      required: false
      content:
        application/json:
          schema:
            type: object
            description: Optional request body for additional filtering options
    responses:
      200:
        description: Folder contents retrieved successfully
        content:
          application/json:
            schema:
              type: array
              items:
                type: object
                properties:
                  name:
                    type: string
                    description: File or folder name
                  type:
                    type: string
                    description: Type of item (file or folder)
                  size:
                    type: integer
                    description: File size in bytes (for files)
            example:
              - name: "report.html"
                type: "file"
                size: 15234
              - name: "logs"
                type: "folder"
      500:
        description: Failed to list folder contents
        content:
          application/json:
            schema:
              type: object
              properties:
                error:
                  type: string
                  example: "Failed to list folder contents"
    """
    try:
        folder_contents = storage_service.list_folder_contents(folder_name)
        if 'error' in folder_contents:
            return jsonify({'error': 'Failed to list folder contents'}), 500
        return jsonify(folder_contents)
    except Exception as e:
        print(f"Error fetching folder contents: {e}")
        return jsonify({'error': 'Failed to list folder contents'}), 500

@app.route('/serve-html/<folder_name>/<path:relative_path>', methods=['GET'])
def serve_html(folder_name, relative_path):
    """
    Serve HTML file from storage
    ---
    tags:
      - Reports
    summary: Retrieve and serve an HTML file from a report folder
    description: Serves an HTML file from a specific report folder using the storage service
    parameters:
      - name: folder_name
        in: path
        required: true
        schema:
          type: string
        description: Name of the report folder containing the HTML file
        example: "2024-01-15-10-30-45_Batch_1"
      - name: relative_path
        in: path
        required: true
        schema:
          type: string
        description: Relative path to the HTML file within the folder
        example: "report.html"
    responses:
      200:
        description: HTML file served successfully
        content:
          text/html:
            schema:
              type: string
            example: "<html><body>Report content</body></html>"
      404:
        description: HTML file not found
        content:
          application/json:
            schema:
              type: object
              properties:
                error:
                  type: string
                  example: "HTML file not found"
      500:
        description: Failed to serve HTML file
        content:
          application/json:
            schema:
              type: object
              properties:
                error:
                  type: string
                  example: "Failed to serve HTML file"
    """
    try:
        file_contents, status_code = storage_service.serve_html(folder_name, relative_path)
        if status_code == 200:
            return Response(file_contents, mimetype='text/html')
        elif status_code == 404:
            return jsonify({"error": "HTML file not found"}), 404
        else:
            return jsonify({"error": "Failed to serve HTML file"}), 500
    except Exception as e:
        print(f"Error serving HTML file: {e}")
        return jsonify({"error": "Failed to serve HTML file"}), 500

@app.route('/addTask', methods=['POST'])
@validate_json(TaskSchema)
def add_task():
    """
    Add a new simulation task to the queue
    ---
    tags:
      - Tasks
    summary: Submit a simulation task
    description: Adds a new simulation task to the processing queue with complete configuration including environment, drones, and monitors. Request body is validated against the task schema.
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required:
              - environment
              - drones
              - monitors
            properties:
              environment:
                type: object
                description: Environment configuration for the simulation
                properties:
                  weather:
                    type: object
                  terrain:
                    type: object
                  timeOfDay:
                    type: string
              drones:
                type: array
                description: Array of drone configurations
                items:
                  type: object
                  properties:
                    id:
                      type: string
                    name:
                      type: string
                    mission:
                      type: object
              monitors:
                type: object
                description: Monitor configuration settings
          example:
            environment:
              weather:
                condition: "clear"
              timeOfDay: "noon"
            drones:
              - id: "drone-001"
                name: "Alpha"
                mission:
                  type: "waypoint"
            monitors:
              battery_monitor:
                enabled: true
    responses:
      200:
        description: Task added to queue successfully
        content:
          application/json:
            schema:
              type: object
              properties:
                task_id:
                  type: string
                  description: Unique identifier for the queued task
                  example: "2024-01-15-10-30-45_Batch_1"
      400:
        description: Invalid task data provided
        content:
          application/json:
            schema:
              type: object
              properties:
                error:
                  type: string
                  example: "No task data provided"
      500:
        description: Failed to add task to queue
        content:
          application/json:
            schema:
              type: object
              properties:
                error:
                  type: string
                  example: "Failed to add task"
    """
    global task_number
    try:
        # Use validated data from decorator
        task_data = request.validated_data

        # Generate a unique UUID string for the task
        uuid_string = time.strftime("%Y-%m-%d-%H-%M-%S", time.localtime()) + "_Batch_" + str(task_number)
        task_dispatcher.add_task(task_data, uuid_string)
        task_number += 1
        print(f"New task added to queue, currently {task_dispatcher.mission_queue.qsize()} in queue")
        return jsonify({'task_id': uuid_string}), 200
    except Exception as e:
        print(f"Error adding task: {e}")
        return jsonify({'error': 'Failed to add task'}), 500

@app.route('/currentRunning', methods=['GET'])
def get_current_running():
    """
    Get current running task status
    ---
    tags:
      - Tasks
    summary: Retrieve current task status and queue size
    description: Returns the status of the currently running task and the number of tasks in the queue
    responses:
      200:
        description: Task status retrieved successfully
        content:
          application/json:
            schema:
              type: object
              properties:
                current_task:
                  type: string
                  description: Status of current task (either "None" or "Running")
                  example: "Running"
                queue_size:
                  type: integer
                  description: Number of tasks waiting in the queue
                  example: 3
            examples:
              running:
                value:
                  current_task: "Running"
                  queue_size: 2
              idle:
                value:
                  current_task: "None"
                  queue_size: 0
    """
    current_task_batch = task_dispatcher.get_current_task_batch()
    if current_task_batch == "None":
        return jsonify({'current_task': 'None', 'queue_size': task_dispatcher.mission_queue.qsize()}), 200
    else:
        return jsonify({'current_task': 'Running', 'queue_size': task_dispatcher.mission_queue.qsize()}), 200

@app.route('/report')
@app.route('/report/<path:dir_name>')
def get_report(dir_name=''):
    """
    Get report files listing
    ---
    tags:
      - Reports
    summary: Retrieve report files listing
    description: Returns an HTML page listing files in a report directory, or all reports if no directory specified
    parameters:
      - name: dir_name
        in: path
        required: false
        schema:
          type: string
        description: Optional directory name within reports to list files for
        example: "2024-01-15-10-30-45_Batch_1"
    responses:
      200:
        description: Report files listing retrieved successfully
        content:
          text/html:
            schema:
              type: string
            description: HTML page with file listing
      404:
        description: Report directory or files not found
      501:
        description: Feature not implemented
        content:
          application/json:
            schema:
              type: object
              properties:
                error:
                  type: string
                  example: "Not Implemented"
    """
    try:
        if dir_name:
            prefix = f'reports/{dir_name}/'
        else:
            prefix = 'reports/'

        # Assuming the storage service has a method to list files in a prefix
        if hasattr(storage_service, 'list_files'):
            files = storage_service.list_files(prefix)
        else:
            # If not implemented, return a 501 Not Implemented
            return abort(501)
        
        if not files:
            return abort(404)

        return render_template('files.html', files=files)

    except Exception as e:
        print(f"Error fetching report for directory {dir_name}: {e}")
        return abort(404)

@app.route('/stream/<drone_name>/<camera_name>')
def stream(drone_name, camera_name):
    """
    Stream camera data
    ---
    tags:
      - Streaming
    summary: Stream camera feed from a drone
    description: Returns a live video stream from a specific drone's camera using multipart MJPEG format
    parameters:
      - name: drone_name
        in: path
        required: true
        schema:
          type: string
        description: Name of the drone to stream from
        example: "Drone1"
      - name: camera_name
        in: path
        required: true
        schema:
          type: string
        description: Name of the camera to stream from
        example: "front_camera"
    responses:
      200:
        description: Camera stream active
        content:
          multipart/x-mixed-replace; boundary=frame:
            schema:
              type: string
            description: MJPEG video stream
      500:
        description: Error streaming camera data
        content:
          text/plain:
            schema:
              type: string
            example: "Error"
    """
    if task_dispatcher.unreal_state.get('state') == 'idle':
        return "No task running", 200
    else:
        try:
            return Response(
                task_dispatcher.get_stream(drone_name, camera_name),
                mimetype='multipart/x-mixed-replace; boundary=frame'
            )
        except Exception as e:
            print(e)
            return "Error", 500

@app.route('/state', methods=['GET'])
def get_state():
    """
    Get simulation state
    ---
    tags:
      - State
    summary: Retrieve current simulation engine state
    description: Returns the current state of the simulation engine including status and configuration
    responses:
      200:
        description: Simulation state retrieved successfully
        content:
          application/json:
            schema:
              type: object
              properties:
                state:
                  type: string
                  description: Current simulation state (e.g., "idle", "running")
                  example: "running"
                task:
                  type: string
                  description: Current task identifier
                  example: "2024-01-15-10-30-45_Batch_1"
            example:
              state: "running"
              task: "2024-01-15-10-30-45_Batch_1"
    """
    return jsonify(task_dispatcher.unreal_state), 200

@app.route('/cesiumCoordinate', methods=['GET'])
def get_map():
    """
    Get Cesium map coordinates
    ---
    tags:
      - State
    summary: Retrieve Cesium map configuration
    description: Returns the Cesium map settings including geographic coordinates for terrain generation
    responses:
      200:
        description: Cesium map settings retrieved successfully
        content:
          application/json:
            schema:
              type: object
              properties:
                latitude:
                  type: number
                  description: Latitude coordinate
                  example: 38.63657
                longitude:
                  type: number
                  description: Longitude coordinate
                  example: -90.236895
                height:
                  type: number
                  description: Height/elevation in meters
                  example: 163.622131
            example:
              latitude: 38.63657
              longitude: -90.236895
              height: 163.622131
    """
    return task_dispatcher.load_cesium_setting(), 200

@app.route('/api/health', methods=['GET'])
def health_check():
    """
    Health check endpoint
    ---
    tags:
      - Health
    summary: Check backend health status
    description: Returns the health status of the backend API
    responses:
      200:
        description: Backend is healthy and reachable
        content:
          application/json:
            schema:
              type: object
              properties:
                status:
                  type: string
                  example: "ok"
                message:
                  type: string
                  example: "Backend is reachable!"
    """
    return jsonify({"status": "ok", "message": "Backend is reachable!"})

# === Run the Flask App ===
if __name__ == '__main__':
    print("Starting DroneWorld API Server...")
    app.run(host='0.0.0.0', port=5000)  # Makes it discoverable by other devices in the networkecho 
