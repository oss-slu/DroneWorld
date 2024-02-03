import logging
import os.path
import threading
import time
import base64
import sys
from flask import Flask, request, abort, send_file, render_template, Response, jsonify
from flask_cors import CORS

##UNCOMMENT LINE IF TESTING ON LOCAL MACHINE
#sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))
from PythonClient.multirotor.control.simulation_task_manager import SimulationTaskManager

app = Flask(__name__, template_folder="./templates")

log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)
CORS(app)

task_dispatcher = SimulationTaskManager()
threading.Thread(target=task_dispatcher.start).start()
task_number = 1


# For Frontend to fetch all missions available to use
#@app.route('/mission', methods=['GET'])
#def mission():
#     directory = '../multirotor/mission'
#     return [file for file in os.listdir(directory) if os.path.isfile(os.path.join(directory, file))]

@app.route('/list-reports', methods=['GET'])
def list_reports():
    # Reports file
    reports_path = os.path.join(os.path.expanduser("~"), "Documents", "AirSim", "report")
    if not os.path.exists(reports_path) or not os.path.isdir(reports_path):
        return 'Reports directory not found', 404
    #print("Listing items in:", reports_path) #Debugging line
    #print(os.listdir(reports_path))  #Debugging line
    report_files = []
    for file in os.listdir(reports_path):
        if 'store' in file.lower():
            continue #skip ds store files entirely, we dont want them

        file_path = os.path.join(reports_path, file)
        
        if os.path.isdir(file_path):
            #Find 'Fuzzy' files
            fuzzy_files = [f for f in os.listdir(file_path) if 'fuzzy' in f.lower()]
            contains_fuzzy = len(fuzzy_files) > 0
            #Determine the path to count Drone files
            if contains_fuzzy:
                first_fuzzy_path = os.path.join(file_path, fuzzy_files[0])
                #Check if the first 'Fuzzy' file is a directory
                if os.path.isdir(first_fuzzy_path):
                    flytopoints_path = os.path.join(first_fuzzy_path, 'FlyToPoints')
                else:
                    flytopoints_path = os.path.join(file_path, 'FlyToPoints')
            else:
                flytopoints_path = os.path.join(file_path, 'FlyToPoints')
            #Count Drones
            drone_count = 0
            if os.path.exists(flytopoints_path) and os.path.isdir(flytopoints_path):
                drone_count = sum(1 for f in os.listdir(flytopoints_path) if f.startswith('FlyToPoints_Drone'))
            report_files.append({'filename': file, 'contains_fuzzy': contains_fuzzy, 'drone_count': drone_count})
        else:
            report_files.append({'filename': file, 'contains_fuzzy': False, 'drone_count': 0})
    return {'reports': report_files}

"""
@app.route('/list-reports', methods=['GET'])
def list_reports():
    # Reports file
    reports_path = os.path.join(os.path.expanduser("~"), "Documents", "AirSim", "report")
    if not os.path.exists(reports_path) or not os.path.isdir(reports_path):
        return 'Reports directory not found', 404
    #print("Listing items in:", reports_path) #Debugging line
    #print(os.listdir(reports_path))  #Debugging line
    report_files = []
    for file in os.listdir(reports_path):
        file_path = os.path.join(reports_path, file)
        #print("Checking file:", file_path)
        if os.path.isfile(file_path):
            #contains_fuzzy = 'Fuzzy' in file
            report_files.append({'filename': file})
        else:
            report_files.append({'filename': file})
    return {'reports': report_files}

@app.route('/get-file-path/<filename>', methods=['GET'])
def get_file_path(filename):
    #construct the full path to the file
    file_path = os.path.join(os.path.expanduser("~"), "Documents", "AirSim", "report", filename)

    #return the file path
    return file_path
"""
"""
#make a report data function that takes the fileName.
@app.route('/report-data/<filename>', methods=['GET'])

def report_data(filename):

    #construct the full path to the file
    file_path = os.path.join(os.path.expanduser("~"), "Documents", "AirSim", "report", filename)

    #check if the file exists
    if not os.path.exists(file_path):
        return jsonify({'error': 'File not found'}), 404

    try:
        #open and read the file content
        with open(file_path, 'r') as file:
            content = file.read()
            return jsonify({'content': content})
        
        #if error give us an error message to tell the user
    except Exception as e:
        return jsonify({'error': 'Error reading file', 'details': str(e)}), 500
"""

@app.route('/list-folder-contents-<foldername>', methods=['GET'])
def list_folder_contents(foldername):
    base_directory = os.path.join(os.path.expanduser("~"), "Documents", "AirSim", "report")
    folder_name = request.args.get(foldername)
    folder_path = os.path.join(base_directory, folder_name)

    if not os.path.exists(folder_path) or not os.path.isdir(folder_path):
        return jsonify({'error': 'Folder not found'}), 404

    folder_contents = []
    for item in os.listdir(folder_path):
        item_path = os.path.join(folder_path, item)
        file_content = None
        file_type = None

        if os.path.isfile(item_path):
            file_type = 'file'
            if item.endswith('.txt') or item.endswith('.html'):
                # For text and HTML files, read as text
                with open(item_path, 'r', encoding='utf-8') as file:
                    file_content = file.read()
            elif item.endswith('.png'):
                # For PNG images, encode the content in base64
                with open(item_path, 'rb') as file:
                    file_content = base64.b64encode(file.read()).decode('utf-8')
            else:
                # For other file types, you may add more conditions
                continue

            folder_contents.append({
                'name': item,
                'type': file_type,
                'content': file_content,
                'file_extension': item.split('.')[-1]
            })
        elif os.path.isdir(item_path):
            file_type = 'directory'
            folder_contents.append({
                'name': item,
                'type': file_type
            })

    return jsonify(folder_contents)


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
    report_root_dir = os.path.join(os.path.expanduser("~"), "Documents", "AirSim", "report")
    dir_path = os.path.join(report_root_dir, dir_name)
    if not os.path.exists(dir_path):
        return abort(404)
    if os.path.isfile(dir_path):
        return send_file(dir_path)
    files = os.listdir(dir_path)
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
