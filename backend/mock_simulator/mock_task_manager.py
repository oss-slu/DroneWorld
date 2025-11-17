import queue
import time
import json
import os

from PythonClient.multirotor.storage.storage_config import get_storage_service

class MockTaskManager:
    def __init__(self):
        self.storage_service = get_storage_service()
        self.mission_queue = queue.Queue()
        self.currentTaskBatch = "None" # I know that this doesnt match the original syntax but i believe in camelCase supremacy
        self.state = True
        self.unreal_state = {"state": "idle (mock)"}
        self.__user_directory = os.path.join(os.path.expanduser('~'), "Documents", "AirSim")

    def createFakeReport(self, uuid):
            print("uploading report")
            content = "\n".join([
                "INFO;MockMonitor;Generated",
                "PASS;MockMonitor;Everything ok",
            ])
            self.storage_service.upload_to_service(
                f"{uuid}/MockMonitor/mock_report.txt",
                content,
                "text/plain",
            ) 

    def runMockTest(self, json, uuid):
        print("running mock test")
        time.sleep(.1) #simulate running sim
        self.createFakeReport(uuid)   
        return 1
 
    def start(self):
        print("Mock Simulator started")
        while self.state:
            while self.mission_queue.empty():
                self.unreal_state = {"state": "idle (mock)"}
                self.currentTaskBatch = "None"
                time.sleep(1)
            self.unreal_state = {"state": "running (mock)"}
            currentTop = self.mission_queue.get()
            self.currentTaskBatch = currentTop[1]
            testResult = self.runMockTest(currentTop[0], currentTop[1])
            print("Test complete, result of", testResult)

    def add_task(self, raw_request_json, uuid):
        print("add task recieved")
        self.mission_queue.put((raw_request_json, uuid))

    def get_current_task_batch(self): 
        return self.currentTaskBatch
    
    def get_stream(self, drone_name, camera_name):
        return "Mock Simulator, no stream"
    
    def load_cesium_setting(self):
        try:
            with open(self.__user_directory + os.sep + 'cesium.json', 'r') as f:
                cesium_setting = json.load(f)
        except FileNotFoundError:
            print("Cesium file not found")
        return cesium_setting