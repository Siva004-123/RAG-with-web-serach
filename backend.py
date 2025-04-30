from flask import Flask,Response,jsonify
from flask_cors import CORS
import json
import queue
from llm_code import query_generation

app=Flask(__name__)
CORS(app)
sse_clients = []
@app.route("/sse_event")
def sse_event():
    client_queue = queue.Queue()
    sse_clients.append(client_queue)

    def stream():
        try:
            while True:
                data = client_queue.get()
                yield data
        except GeneratorExit:
            # This happens when the client disconnects
            sse_clients.remove(client_queue)

    return Response(stream(), mimetype='text/event-stream')


def send_message(data):
    for clients in sse_clients:
        clients.put(f"data:{json.dumps(data)}\n\n")
from flask import request

@app.route("/send", methods=["POST"])
def send():
    data = request.get_json()
    send_message(data)
    return {"status": "sent"}
@app.route("/text", methods=["POST"])
def call():
    data=request.get_json()
    query=data.get('text')
    print("quert",query)
    llm_respose=query_generation(query)
    return{"response":llm_respose}


if __name__ == '__main__':
    app.run(port=5000, debug=True)