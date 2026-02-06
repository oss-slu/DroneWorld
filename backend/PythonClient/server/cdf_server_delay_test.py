import requests
import time
import os

WIND_SERVICE_HOST = os.getenv('WIND_SERVICE_HOST', '172.18.126.222')
WIND_SERVICE_PORT = os.getenv('WIND_SERVICE_PORT', '5001')

# This is a mess waiting to be cleaned up.
post_url = f'http://{WIND_SERVICE_HOST}:{WIND_SERVICE_PORT}/wind'
get_url = f'http://{WIND_SERVICE_HOST}:{WIND_SERVICE_PORT}/'



def measure_delay_post():
    start_time = time.time()

    # Create the JSON data to send in the POST request
    data = {'x': 1, 'y': 2, 'z': 3}

    # Send the POST request with JSON data
    response = requests.post(post_url, json=data)

    end_time = time.time()
    delay = end_time - start_time
    return delay

def measure_delay_get():
    start_time = time.time()

    # Send the GET request
    response = requests.get(get_url)

    end_time = time.time()
    delay = end_time - start_time
    return delay

def test_post_delay():
    delay = measure_delay_post()
    assert delay <= 1.0, f"POST delay exceeded 1 second. Actual delay: {delay} seconds"

def test_get_delay():
    delay = measure_delay_get()
    assert delay <= 1.0, f"GET delay exceeded 1 second. Actual delay: {delay} seconds"
