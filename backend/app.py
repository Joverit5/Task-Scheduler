from flask import Flask, request, jsonify
from flask_cors import CORS
from task_scheduler import schedule_tasks

app = Flask(__name__)
CORS(app)

@app.route('/schedule_tasks', methods=['POST'])
def api_schedule_tasks():
    tasks = request.json.get('tasks', [])
    result = schedule_tasks(tasks)
    return jsonify(result)

@app.route('/')
def home():
    return "Task Scheduler API is running!"

if __name__ == '__main__':
    app.run(debug=True)

#Pruebas Unitarias
import requests

def test_server():
    url = 'http://localhost:5000/schedule_tasks'
    tasks = [
        {"name": "Task 1", "deadline": "2023-06-30", "profit": 100},
        {"name": "Task 2", "deadline": "2023-07-15", "profit": 150},
    ]
    response = requests.post(url, json={"tasks": tasks})
    print("Status Code:", response.status_code)
    print("Response:", response.json())

