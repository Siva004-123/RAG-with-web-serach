import requests
import time

while True:
    requests.post("http://localhost:5000/send", json={'url': 'https://youtube.com'})
    time.sleep(1)
