import sys
import os
from pathlib import Path
from flask import Flask, request, jsonify
import requests
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Create a lightweight Flask app for API only
app = Flask(__name__)
CORS(app)

API_BASE_URL = os.environ.get(
    "API_BASE_URL", "https://api.toughtongueai.com/api/public"
)
TTAI_TOKEN = os.environ.get("TTAI_TOKEN")

# For Vercel deployment - handle token error gracefully
if not TTAI_TOKEN:
    print("Warning: TTAI_TOKEN is not set")


def tryy(response):
    try:
        return jsonify(response.json()), response.status_code
    except requests.exceptions.JSONDecodeError:
        return (
            jsonify(
                {
                    "error": "Invalid response from API",
                    "status": response.status_code,
                    "text": response.text,
                }
            ),
            500,
        )


@app.route("/api/analyze", methods=["POST"])
def analyze():
    data = request.json
    response = requests.post(
        f"{API_BASE_URL}/sessions/analyze",
        json=data,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {TTAI_TOKEN}",
        },
    )
    return tryy(response)


@app.route("/api/sessions/<session_id>", methods=["GET"])
def get_session(session_id):
    response = requests.get(
        f"{API_BASE_URL}/sessions/{session_id}",
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {TTAI_TOKEN}",
        },
    )
    return tryy(response)


# This is required for Vercel serverless functions
if __name__ == "__main__":
    app.run()
