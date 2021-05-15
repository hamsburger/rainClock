from flask import Flask, request, url_for

app = Flask(__name__, static_folder="./", static_url_path="./")
@app.route("/", methods=["GET"])
def index():
    return app.send_static_file('index.html')