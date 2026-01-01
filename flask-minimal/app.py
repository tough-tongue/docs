import os
import pathlib
from flask import send_from_directory
from dotenv import load_dotenv

# Load environment variables from .env file (might be redundant but kept for safety)
load_dotenv()

# Import the Flask app from index.py
from api.index import app

# Get the directory where the Flask app is located
BASE_DIR = pathlib.Path(__file__).parent.absolute()
WWW_DIR = BASE_DIR / "www"


# Serve static files - only needed for local development
@app.route("/", defaults={"path": "index.html"})
@app.route("/<path:path>")
def serve_static(path):
    # Special case for the root path
    if path == "index.html" or path == "":
        return send_from_directory(WWW_DIR, "index.html")

    # Return the requested static file
    return send_from_directory(WWW_DIR, path)


if __name__ == "__main__":
    try:
        # Run the app on port 8008
        port = int(os.environ.get("PORT", 8008))
        print(f"Starting server on port {port}...")
        print(f"Serving static files from: {WWW_DIR}")
        print("Press CTRL+C to quit")
        app.run(host="0.0.0.0", port=port, debug=True)
    except Exception as e:
        print(f"Error starting server: {str(e)}")
