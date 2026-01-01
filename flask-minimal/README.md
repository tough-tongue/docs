# Flask Minimal Starter

A lightweight Flask-based application that demonstrates how to integrate ToughTongue AI into your Python web application. Perfect for developers who prefer Python and want a simple, straightforward integration.

## Features

- **Server-side API proxy**: Secure API calls through Flask backend
- **Iframe integration**: Embed ToughTongue AI conversations seamlessly
- **Session management**: Track and analyze conversation sessions
- **Preact-based UI**: Lightweight React alternative without build tools
- **Vercel-ready**: Pre-configured for serverless deployment

## Quick Start

### 1. Prerequisites

- Python 3.9 or higher
- A [ToughTongue AI account](https://www.toughtongueai.com/)
- An API token from the [Developer Portal](https://app.toughtongueai.com/developer?tab=api-keys)

### 2. Installation

```bash
# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Configuration

Create a `.env` file in the `flask-minimal/` directory:

```env
TTAI_TOKEN=your_api_token_here
API_BASE_URL=https://api.toughtongueai.com/api/public
PORT=8008
```

### 4. Update Scenario ID

Edit `www/config.js` to set your scenario ID:

```javascript
export const toughTongueConfig = {
  baseUrl: "https://app.toughtongueai.com",
  scenarioId: "YOUR_SCENARIO_ID_HERE", // Replace with your scenario ID
  defaultStyles: {
    name: "Personality Assessment",
    color: "indigo-500",
    background: "white",
  },
};
```

**To get a scenario ID:**

1. Go to [ToughTongue AI](https://www.toughtongueai.com/)
2. Create a scenario or use an existing one
3. Copy the scenario ID from the URL or scenario settings

### 5. Run the Application

```bash
python app.py
```

The application will start at `http://localhost:8008`.

## Integration Guide

### How It Works

This starter demonstrates a complete integration pattern:

1. **Frontend** (`www/`) embeds ToughTongue AI iframe
2. **Backend** (`api/index.py`) proxies API requests securely
3. **Event Handling** (`www/assessment.js`) listens for iframe events
4. **Session Analysis** uses the backend API to analyze completed sessions

### Key Integration Points

#### 1. Embedding the Iframe

The iframe is embedded in `www/assessment.js`:

```javascript
const buildIframeUrl = () => {
  let baseUrl = `${toughTongueConfig.baseUrl}/embed/${toughTongueConfig.scenarioId}`;
  const params = new URLSearchParams();
  params.append("name", toughTongueConfig.defaultStyles.name);
  params.append("color", toughTongueConfig.defaultStyles.color);
  params.append("bg", toughTongueConfig.defaultStyles.background);
  params.append("pulse", "true");
  params.append("transcribe", "true");
  return `${baseUrl}?${params.toString()}`;
};
```

#### 2. Listening for Events

Handle iframe events in `www/assessment.js`:

```javascript
useEffect(() => {
  const handleMessage = async (event) => {
    const data = event.data;
    if (data && data.event) {
      switch (data.event) {
        case "onStart":
          // Session started - store session ID
          setSessionData({
            sessionId: data.sessionId,
            status: "started",
            timestamp: data.timestamp,
          });
          break;
        case "onStop":
          // Session completed - ready for analysis
          setSessionData((prev) => ({
            ...prev,
            status: "completed",
            timestamp: data.timestamp,
          }));
          break;
      }
    }
  };
  window.addEventListener("message", handleMessage);
  return () => window.removeEventListener("message", handleMessage);
}, []);
```

#### 3. Analyzing Sessions

After a session completes, analyze it via the backend API:

```javascript
const analyzeSession = async (sessionId) => {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: sessionId }),
  });
  return await response.json();
};
```

The backend (`api/index.py`) securely handles the API call:

```python
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
    return jsonify(response.json()), response.status_code
```

### Customization

#### Changing the Scenario

Update the scenario ID in `www/config.js`:

```javascript
scenarioId: "YOUR_NEW_SCENARIO_ID";
```

#### Styling

Modify `www/styles.css` to customize the appearance. The starter includes:

- Responsive layout
- Card-based UI components
- Smooth transitions
- CSS variables for easy theming

#### Adding New Features

1. **New API endpoints**: Add routes in `api/index.py`
2. **New components**: Create files in `www/components/`
3. **New pages**: Add components in `app.js` with routing logic

## Project Structure

```
flask-minimal/
├── app.py                 # Main Flask application (static file server)
├── api/
│   └── index.py          # API routes for ToughTongue AI integration
├── www/                   # Frontend assets
│   ├── index.html        # Main HTML page
│   ├── app.js            # Main application logic (Preact)
│   ├── assessment.js     # Assessment page with iframe handling
│   ├── config.js         # Configuration (scenario ID, API endpoints)
│   ├── styles.css        # Application styling
│   └── components/
│       └── results.js    # Results display component
├── requirements.txt      # Python dependencies
└── vercel.json          # Vercel deployment configuration
```

## API Endpoints

### POST `/api/analyze`

Analyzes a completed session:

**Request:**

```json
{
  "session_id": "SESSION_ID"
}
```

**Response:**

```json
{
  "session_id": "SESSION_ID",
  "analysis": {
    "overall_score": 85,
    "strengths": ["Clear communication"],
    "areas_for_improvement": ["Response time"]
  }
}
```

### GET `/api/sessions/<session_id>`

Retrieves session details:

**Response:**

```json
{
  "id": "session_id",
  "scenario_id": "scenario_id",
  "transcript": "...",
  "duration": 300,
  "created_at": "2024-01-01T00:00:00Z"
}
```

## Deployment

### Vercel (Recommended)

The project includes `vercel.json` for serverless deployment:

1. Install Vercel CLI:

   ```bash
   pnpm add -g vercel
   ```

2. Navigate to project directory:

   ```bash
   cd flask-minimal
   ```

3. Deploy:

   ```bash
   vercel
   ```

4. Set environment variables in Vercel dashboard:

   - `TTAI_TOKEN` - Your ToughTongue AI API token
   - `API_BASE_URL` - Optional (defaults to production API)

5. Deploy to production:
   ```bash
   vercel --prod
   ```

### Other Platforms

For other platforms (Heroku, Railway, etc.):

1. Ensure Python 3.9+ is available
2. Set environment variables
3. Configure the start command: `python app.py`
4. Ensure port is configurable via `PORT` environment variable

For production, consider using `gunicorn`:

```bash
pip install gunicorn
gunicorn app:app
```

## Troubleshooting

### API Token Issues

- Verify `TTAI_TOKEN` is set correctly in `.env` or environment variables
- Check token hasn't expired
- Ensure token has necessary permissions

### Iframe Not Loading

- Verify scenario ID is correct in `www/config.js`
- Check scenario is set to `is_public: true` in ToughTongue AI dashboard
- Review browser console for errors
- Ensure HTTPS is used in production (required for microphone access)

### Static Files Not Serving

- Check `WWW_DIR` path in `app.py` is correct
- Verify files exist in `www/` directory
- Check file permissions

### CORS Errors

- Flask-CORS is already configured in `api/index.py`
- If issues persist, check API base URL is correct

## Environment Variables

| Variable       | Required | Default                                    | Description                   |
| -------------- | -------- | ------------------------------------------ | ----------------------------- |
| `TTAI_TOKEN`   | Yes      | -                                          | Your ToughTongue AI API token |
| `API_BASE_URL` | No       | `https://api.toughtongueai.com/api/public` | API base URL                  |
| `PORT`         | No       | `8008`                                     | Server port                   |

## Dependencies

- **Flask 2.0+**: Web framework
- **requests**: HTTP library for API calls
- **flask-cors**: CORS support
- **python-dotenv**: Environment variable management
- **gunicorn**: Production WSGI server (for non-Vercel deployments)

## Next Steps

- Explore the [full documentation](/docs/flask-minimal)
- Learn about [API integration](/docs/api-integration)
- Check out [deployment options](/docs/deployment)
- Review [best practices](/docs/best-practices)

## Support

- [API Playground](https://app.toughtongueai.com/api-playground)
- [Developer Portal](https://app.toughtongueai.com/developer)
- [Developer Community](https://discord.com/invite/jfq2wVAP)
- [Support Email](mailto:help@getarchieai.com)

## License

MIT
