import logging
import os #I changed it from os.path to just os. Revert is needed
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

storage_client = storage.Client.from_service_account_json('key.json') # Use service account credentials from 'key.json'
bucket = storage_client.bucket('droneworld') # Reference the bucket

# For Frontend to fetch all missions available to use
#@app.route('/mission', methods=['GET'])
#def mission():
#     directory = '../multirotor/mission'
#     return [file for file in os.listdir(directory) if os.path.isfile(os.path.join(directory, file))]
def check_monitor_pass_fail(bucket, file_name, monitors):
        monitor_pass = True
        blob = bucket.blob(file_name) # Full path
        content = blob.download_as_text()

        for monitor in monitors:
            if monitor in content and 'FAIL' in content:
                monitor_pass = False
                break
        return monitor_pass

def count_drone_files(bucket, report_file_name):
        count = 0
        flytopoints_prefix = f'{report_file_name}/FlyToPoints/' # Full path

        try:
            blobs = bucket.list_blobs(prefix=flytopoints_prefix)
            count = sum(1 for blob in blobs if 'CollisionMonitor' in blob.name and blob.name.endswith('.txt'))

        except Exception as e:
            logging.error(f"Error counting drone files for {flytopoints_prefix}: {str(e)}")
            count = 0
            
        return count 

@app.route('/list-reports', methods=['GET'])
def list_reports():
    # Fetch the list of reports from GCS bucket
    blobs = bucket.list_blobs(prefix='reports/', delimiter='/')

    report_files = []
    monitors = ['CollisionMonitor', 'LandspaceMonitor', 'NoFlyZoneMonitor', 'PointDeviationMonitor']
    global_monitors = ['MinSepDistMonitor']

    for blob in blobs:
        if '/reports/' in blob.name and blob.name.endswith('.txt'):
            file_name = blob.name # Keep the full path for nested directories
            drone_count = count_drone_files(bucket, file_name)
            all_monitors_pass = check_monitor_pass_fail(bucket, file_name, monitors)
            report_files.append({
                'filename': file_name,
                'contains_fuzzy': False,
                'drone_count': drone_count,
                'pass': drone_count if all_monitors_pass else 0,
                'fail': 0 if all_monitors_pass else drone_count
            })
    
    return {'reports': report_files}               
    
#Folder content with base64
@app.route('/list-folder-contents/<folder_name>', methods=['POST'])
def list_folder_contents(folder_name):
    base_directory = f'reports/{folder_name}/'
    blobs = bucket.list_blobs(prefix=base_directory)

    if not any(blobs):
        return jsonify({'error': 'Folder not found'}), 404

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

    fuzzy_folders = [blob.name for blob in blobs if "Fuzzy_Wind_" in blob.name]

    if fuzzy_folders:
        for fuzzy_folder in fuzzy_folders:
            fuzzy_directory = fuzzy_folder
            process_directory(fuzzy_directory, result, fuzzy_folder)
    else:
        process_directory(base_directory, result, "")

    return jsonify(result)

def process_directory(directory, result, fuzzy_path_value):
    blobs = bucket.list_blobs(prefix=directory)
    
    for blob in blobs:
        file_name = blob.name.split("/")[-1]
        fuzzy_value = fuzzy_path_value.split("_")[-1] if fuzzy_path_value else ""

        if file_name.endswith('.txt'):
            content = blob.download_as_text()
            file_data = {
                "name": file_name,
                "type": "text/plain",
                "fuzzyPath": fuzzy_path_value,
                "fuzzyValue": fuzzy_value,
                "content": content,
                "infoContent": get_info_contents(content, "INFO", {}),
                "passContent": get_info_contents(content, "PASS", {}),
                "failContent": get_info_contents(content, "FAIL", {})
            }

            assign_monitor_file(result, file_data, blob.name)

        elif file_name.endswith('.png'):
            encoded_string = base64.b64encode(blob.download_as_bytes()).decode('utf-8')
            file_data = {
                "name": file_name,
                "type": "image/png",
                "fuzzyPath": fuzzy_path_value,
                "fuzzyValue": fuzzy_value,
                "imgContent": encoded_string,
                "path": blob.name.replace("_plot.png", "_interactive.html")
            }

            assign_monitor_file(result, file_data, blob.name)

def assign_monitor_file(result, file_data, file_path):
    if "UnorderedWaypointMonitor" in file_path:
        result["UnorderedWaypointMonitor"].append(file_data)
    elif "CircularDeviationMonitor" in file_path:
        result["CircularDeviationMonitor"].append(file_data)
    elif "CollisionMonitor" in file_path:
        result["CollisionMonitor"].append(file_data)
    elif "LandspaceMonitor" in file_path:
        result["LandspaceMonitor"].append(file_data)
    elif "OrderedWaypointMonitor" in file_path:
        result["OrderedWaypointMonitor"].append(file_data)
    elif "PointDeviationMonitor" in file_path:
        result["PointDeviationMonitor"].append(file_data)
    elif "MinSepDistMonitor" in file_path:
        result["MinSepDistMonitor"].append(file_data)
    elif "NoFlyZoneMonitor" in file_path:
        result["NoFlyZoneMonitor"].append(file_data)

def get_info_contents(file_contents, keyword, drone_map):
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
    report_root_dir = 'reports/'
    dir_path = os.path.join(report_root_dir, dir_name)

    blobs = bucket.list_blobs(prefix=dir_path)

    if not blobs:
        return abort(404)
    
    if dir_name and any(blob.name == dir_path for blob in blobs):
        blob = bucket.blob(dir_path)
        return send_file(blob.download_as_bytes(), attachment_filename=dir_name)
    
    files = [blob.name.split('/')[-1] for blob in blobs]
    return render_template('files.html', files=files)

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
