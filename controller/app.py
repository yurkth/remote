from flask import Flask, render_template, request
from collections import defaultdict
import pyautogui

app = Flask(__name__)
updated = defaultdict(lambda: False)
music_data = '{ "message": "Music data not found." }'


@app.route("/")
def main():
    updated[request.remote_addr] = True
    return render_template("index.html")


@app.route("/api/key/<key>", methods=["GET"])
def send_key(key):
    if(key in pyautogui.KEYBOARD_KEYS):
        pyautogui.press(key)
    else:
        print('Specified key not found')
    return ""


@app.route("/api/hotkey/<keys>", methods=["GET"])
def send_hotkey(keys):
    pyautogui.hotkey(*keys.split("+"))  # +キーを入力する場合変える必要アリ
    return ""


@app.route("/api/music", methods=["POST"])
def post_music():
    global music_data
    music_data = request.get_data().decode()
    global updated
    for k in updated:
        updated[k] = True
    return ""


@app.route("/api/music", methods=["GET"])
def get_music():
    global updated
    if updated[request.remote_addr]:
        updated[request.remote_addr] = False
        return music_data
    else:
        return '{ "message": "No need to update." }'


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=55432)
