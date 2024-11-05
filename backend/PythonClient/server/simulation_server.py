import logging
import os 
import threading
import time
import base64
import json
import mimetypes
import sys
from flask import Flask, request, abort, send_file, render_template, Response, jsonify
from flask_cors import CORS

from google.cloud import storage

##UNCOMMENT LINE IF TESTING ON LOCAL MACHINE
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))
from PythonClient.multirotor.control.simulation_task_manager import SimulationTaskManager

app = Flask(__name__, template_folder="./templates")

log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)
CORS(app)

task_dispatcher = SimulationTaskManager()
threading.Thread(target=task_dispatcher.start).start()
task_number = 1

# Initialize GCS client
storage_client = storage.Client.from_service_account_json('key.json')  # Initializes the GCS client
bucket_name = 'droneworld'  # The bucket name in GCS
bucket = storage_client.bucket(bucket_name)  # Points to the GCS bucket

# For Frontend to fetch all missions available to use
#@app.route('/mission', methods=['GET'])
#def mission():
#     directory = '../multirotor/mission'
#     return [file for file in os.listdir(directory) if os.path.isfile(os.path.join(directory, file))]

@app.route('/list-reports', methods=['GET'])
def list_reports():
    """
    Lists all report batches from GCS instead of the local filesystem.
    """
    try:
        # List all blobs in the 'reports/' directory
        blobs = bucket.list_blobs(prefix='reports/')
        report_files = []
        for blob in blobs:
            # Extract the batch folder name
            parts = blob.name.split('/')
            if len(parts) < 2:
                continue  # Skip if not in a subdirectory
            batch_folder = parts[1]
            if batch_folder not in [report['filename'] for report in report_files]:
                # Initialize report entry
                report_files.append({
                    'filename': batch_folder,
                    'contains_fuzzy': False,  # Will determine later
                    'drone_count': 0,
                    'pass': 0,
                    'fail': 0
                })
        
        # Iterate through each report folder to gather details
        for report in report_files:
            prefix = f'reports/{report["filename"]}/'
            sub_blobs = bucket.list_blobs(prefix=prefix)
            contains_fuzzy = False
            drone_count = 0
            pass_count = 0
            fail_count = 0

            for sub_blob in sub_blobs:
                sub_parts = sub_blob.name.split('/')
                if len(sub_parts) < 3:
                    continue  # Skip if not in a monitor subdirectory
                monitor = sub_parts[2]
                if 'fuzzy' in monitor.lower():
                    contains_fuzzy = True
                # Here you can implement logic to parse pass/fail counts
                # For simplicity, we'll set dummy values
                # Ideally, you'd download and parse the report files to get accurate counts
                # Example:
                # if monitor == 'CollisionMonitor':
                #     # Parse collision monitor report to update pass/fail
                pass_count += 2  # Placeholder
                fail_count += 1  # Placeholder

            report['contains_fuzzy'] = contains_fuzzy
            report['drone_count'] = drone_count
            report['pass'] = pass_count
            report['fail'] = fail_count

        return {'reports': report_files}

    except Exception as e:
        print(f"Error fetching reports from GCS: {e}")
        return jsonify({'error': 'Failed to list reports from GCS'}), 500

# Folder content with base64
@app.route('/list-folder-contents/<folder_name>', methods=['POST'])
def list_folder_contents(folder_name):
    """
    Lists the contents of a specific report folder from GCS.
    """
    try:
        # Define the prefix for the specific folder
        prefix = f'reports/{folder_name}/'

        # List all blobs within the specified folder
        blobs = bucket.list_blobs(prefix=prefix)
        
        result = {
            "name": folder_name,
            "UnorderedWaypointMonitor": [],
            "CircularDeviationMonitor": [],
            "CollisionMonitor": [],
            "LandspaceMonitor": [],
            "OrderedWaypointMonitor": [],
            "PointDeviationMonitor": [],
            "MinSepDistMonitor": [],
            "NoFlyZoneMonitor": []
        }

        fuzzy_folders = set()
        for blob in blobs:
            parts = blob.name.split('/')
            if len(parts) < 3:
                continue  # Skip if not in a monitor subdirectory
            monitor = parts[2]
            if monitor.startswith("Fuzzy_Wind_"):
                fuzzy_folders.add(monitor)

        if fuzzy_folders:
            for fuzzy_folder in fuzzy_folders:
                fuzzy_prefix = f'reports/{folder_name}/{fuzzy_folder}/'
                process_gcs_directory(fuzzy_prefix, result, fuzzy_folder)
        else:
            process_gcs_directory(prefix, result, "")

        return jsonify(result)

    except Exception as e:
        print(f"Error fetching folder contents from GCS: {e}")
        return jsonify({'error': 'Failed to list folder contents from GCS'}), 500

def process_gcs_directory(prefix, result, fuzzy_path_value):
    """
    Processes blobs in a GCS directory and populates the result dictionary.
    """
    blobs = bucket.list_blobs(prefix=prefix)
    for blob in blobs:
        file_name = os.path.basename(blob.name)
        if blob.name.endswith('.txt'):
            # Download the text content
            file_contents = blob.download_as_text()

            info_content = get_info_contents(file_contents, "INFO", {})
            pass_content = get_info_contents(file_contents, "PASS", {})
            fail_content = get_info_contents(file_contents, "FAIL", {})

            file_data = {
                "name": file_name,
                "type": "text/plain",
                "fuzzyPath": fuzzy_path_value,
                "fuzzyValue": fuzzy_path_value.split("_")[-1] if fuzzy_path_value else "",
                "content": file_contents,
                "infoContent": info_content,
                "passContent": pass_content,
                "failContent": fail_content
            }

            # Determine the monitor type and append the file data
            if "UnorderedWaypointMonitor" in blob.name:
                result["UnorderedWaypointMonitor"].append(file_data)
            elif "CircularDeviationMonitor" in blob.name:
                result["CircularDeviationMonitor"].append(file_data)
            elif "CollisionMonitor" in blob.name:
                result["CollisionMonitor"].append(file_data)
            elif "LandspaceMonitor" in blob.name:
                result["LandspaceMonitor"].append(file_data)
            elif "OrderedWaypointMonitor" in blob.name:
                result["OrderedWaypointMonitor"].append(file_data)
            elif "PointDeviationMonitor" in blob.name:
                result["PointDeviationMonitor"].append(file_data)
            elif "MinSepDistMonitor" in blob.name:
                result["MinSepDistMonitor"].append(file_data)
            elif "NoFlyZoneMonitor" in blob.name:
                result["NoFlyZoneMonitor"].append(file_data)

        elif blob.name.endswith('.png'):
            # Download and encode the image in base64
            image_content = blob.download_as_bytes()
            encoded_string = base64.b64encode(image_content).decode('utf-8')

            # Assume corresponding HTML exists
            html_path = blob.name.replace("_plot.png", "_interactive.html")

            file_data = {
                "name": file_name,
                "type": "image/png",
                "fuzzyPath": fuzzy_path_value,
                "fuzzyValue": fuzzy_path_value.split("_")[-1] if fuzzy_path_value else "",
                "imgContent": encoded_string,
                "path": html_path
            }

            # Determine the monitor type and append the file data
            if "UnorderedWaypointMonitor" in blob.name:
                result["UnorderedWaypointMonitor"].append(file_data)
            elif "CircularDeviationMonitor" in blob.name:
                result["CircularDeviationMonitor"].append(file_data)
            elif "CollisionMonitor" in blob.name:
                result["CollisionMonitor"].append(file_data)
            elif "LandspaceMonitor" in blob.name:
                result["LandspaceMonitor"].append(file_data)
            elif "OrderedWaypointMonitor" in blob.name:
                result["OrderedWaypointMonitor"].append(file_data)
            elif "PointDeviationMonitor" in blob.name:
                result["PointDeviationMonitor"].append(file_data)
            elif "MinSepDistMonitor" in blob.name:
                result["MinSepDistMonitor"].append(file_data)
            elif "NoFlyZoneMonitor" in blob.name:
                result["NoFlyZoneMonitor"].append(file_data)

def get_info_contents(file_contents, keyword, drone_map):
    """
    Parses the file contents to extract information based on the keyword.
    """
    content_array = file_contents.split("\n")
    for content in content_array:
        content_split = content.split(";")
        if keyword in content and len(content_split) == 4:
            key = content_split[2].strip()
            value = content_split[3].strip()
            if key not in drone_map:
                drone_map[key] = [value]
            else:
                drone_map[key].append(value)
    return drone_map

@app.route('/addTask', methods=['POST'])
def add_task():
    global task_number
    uuid_string = time.strftime("%Y-%m-%d-%H-%M-%S", time.localtime()) + "_Batch_" + str(task_number)
    task_dispatcher.add_task(request.get_json(), uuid_string)
    task_number += 1
    print(f"New task added to queue, currently {task_dispatcher.mission_queue.qsize()} in queue")
    return uuid_string

@app.route('/currentRunning', methods=['GET'])
def get_current_running():
    current_task_batch = task_dispatcher.get_current_task_batch()
    if current_task_batch == "None":
        return f"{'None'}, {task_dispatcher.mission_queue.qsize()}"
    else:
        return f"{'Running'}, {task_dispatcher.mission_queue.qsize()}"

@app.route('/report')
@app.route('/report/<path:dir_name>')
def get_report(dir_name=''):
    """
    Serves reports from GCS. Note: Serving files directly from GCS might require generating signed URLs.
    """
    try:
        if dir_name:
            prefix = f'reports/{dir_name}/'
        else:
            prefix = 'reports/'

        blobs = bucket.list_blobs(prefix=prefix)
        files = [blob.name.replace(prefix, '') for blob in blobs if blob.name != prefix]

        if not files:
            return abort(404)

        return render_template('files.html', files=files)

    except Exception as e:
        print(f"Error fetching report for directory {dir_name} from GCS: {e}")
        return abort(404)

@app.route('/stream/<drone_name>/<camera_name>')
def stream(drone_name, camera_name):
    if task_dispatcher.unreal_state['state'] == 'idle':
        return "No task running"
    else:
        try:
            return Response(
                task_dispatcher.get_stream(drone_name, camera_name),
                mimetype='multipart/x-mixed-replace; boundary=frame'
            )
        except Exception as e:
            print(e)
            return "Error"

# @app.route('/uploadMission', methods=['POST'])
# def upload_file():
#     file = request.files['file']
#     filename = file.filename
#     custom_mission_dir = '../multirotor/mission/custom'
#     path = os.path.join(custom_mission_dir, filename)
#     file.save(path)
#     return 'File uploaded'

# def update_settings_json(drone_number, separation_distance):
#     SettingGenerator(drone_number, separation_distance)

@app.route('/state', methods=['GET'])
def get_state():
    """
    For unreal engine to check the current run state
    :return:  json obj consists of the current state with this specific format
    {
        "state": "idle"
    }
    or
    {
        "state": "start"
    }
    any other state will be not accepted by the unreal engine side and the change will be ignored
    """
    return task_dispatcher.unreal_state

@app.route('/cesiumCoordinate', methods=['GET'])
def get_map():
    return task_dispatcher.load_cesium_setting()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000) 
    # makes it discoverable by other devices in the network
