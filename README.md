# ToughTongue AI Starter Templates

This repository contains production-ready starter templates for building applications with [ToughTongue AI](https://www.toughtongueai.com/). Choose the template that best fits your tech stack and start building interactive voice-based learning applications.

## 🚀 Quick Start

1. **Fork this repository** to create your own copy
2. **Choose a starter template** from the options below
3. **Get your API token** from the [ToughTongue AI Developer Portal](https://app.toughtongueai.com/developer?tab=api-keys)
4. **Follow the template-specific setup guide**
5. **Start building** your application

## 📦 Available Templates

### Flask Minimal (`flask-minimal/`)

A lightweight Flask-based application perfect for Python developers.

**Tech Stack:**

- Python 3.9+
- Flask 2.0+
- Preact (no build tools)
- Vercel-ready

**Best for:**

- Python developers
- Simple integrations
- Quick prototypes
- Server-side API proxying

**Quick Start:**

```bash
cd flask-minimal
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
# Create .env file with TTAI_TOKEN
python app.py
```

📖 [Full Flask Minimal Guide](flask-minimal/README.md) | [Documentation](docs/starters/flask.mdx)

---

### Next.js Minimal (`nextjs-minimal/`)

A modern, production-ready Next.js application with TypeScript.

**Tech Stack:**

- Next.js 15+ (App Router)
- TypeScript
- React 19
- Tailwind CSS
- Zustand (state management)
- Clerk (authentication, optional)

**Best for:**

- Modern web applications
- Production-ready projects
- TypeScript developers
- Full-featured applications

**Quick Start:**

```bash
cd nextjs-minimal
pnpm install
# Create .env.local with TOUGH_TONGUE_API_KEY
pnpm dev
```

📖 [Full Next.js Minimal Guide](nextjs-minimal/README.md) | [Documentation](docs/starters/nextjs.mdx)

---

## 📚 Documentation

Comprehensive documentation is available in the [`docs/`](/docs) folder:

- **[Introduction](docs/introduction.mdx)** - Overview of ToughTongue AI and starter templates
- **[Getting Started](docs/quickstart.mdx)** - Quick start guide for all templates
- **[Flask Minimal](docs/starters/flask.mdx)** - Complete Flask starter guide
- **[Next.js Minimal](docs/starters/nextjs.mdx)** - Complete Next.js starter guide
- **[API Integration](docs/api-reference/overview.mdx)** - Complete API reference and integration patterns
- **[Deployment](docs/integration/deployment.mdx)** - Deployment guides for various platforms
- **[Best Practices](docs/integration/best-practices.mdx)** - Development best practices and patterns

## 🔑 Getting Your API Token

1. Sign in to [ToughTongue AI](https://www.toughtongueai.com/)
2. Navigate to the [Developer Portal](https://app.toughtongueai.com/developer?tab=api-keys)
3. Create a new API key
4. Copy and securely store your token

## 🎯 What is ToughTongue AI?

ToughTongue AI is a conversational AI platform that enables you to practice and improve communication skills through interactive voice-based conversations. Perfect for:

- 📞 Interview preparation
- 💼 Sales training
- 🎧 Customer service role play
- 👔 Leadership development
- 📊 Performance review practice
- 🤝 Conflict resolution training

## 🏗️ Integration Overview

Both starters demonstrate complete integration patterns:

1. **Iframe Embedding** - Embed ToughTongue AI conversations in your app
2. **Event Handling** - Listen for session start/stop events
3. **Session Management** - Track and store session data
4. **API Integration** - Analyze sessions and retrieve insights
5. **Secure Backend** - Server-side API proxying for security

## 📋 Template Comparison

| Feature          | Flask Minimal | Next.js Minimal    |
| ---------------- | ------------- | ------------------ |
| Language         | Python        | TypeScript         |
| Framework        | Flask         | Next.js 15         |
| Frontend         | Preact        | React 19           |
| Build Tools      | None          | Next.js            |
| Type Safety      | No            | Yes                |
| Authentication   | No            | Clerk (optional)   |
| State Management | Preact Hooks  | Zustand            |
| Styling          | CSS           | Tailwind CSS       |
| Deployment       | Vercel/Any    | Vercel (optimized) |
| Best For         | Simple apps   | Production apps    |

## 🚢 Deployment

Both templates are ready for deployment:

- **Vercel** (Recommended) - Pre-configured for both templates
- **Other Platforms** - See [Deployment Guide](/docs/deployment.md)

## 🔧 Common Tasks

### Creating a Scenario

Scenarios define conversation context and AI behavior. Create them via:

- **Web UI**: [Scenario Builder](https://app.toughtongueai.com/scenarios)
- **API**: See [API Integration Guide](/docs/api-integration.md)

### Embedding in Your App

Both templates include iframe embedding examples:

```html
<iframe
  src="https://app.toughtongueai.com/embed/SCENARIO_ID"
  width="100%"
  height="600px"
  frameborder="0"
  allow="microphone"
></iframe>
```

### Listening for Events

Handle session events:

```javascript
window.addEventListener("message", (event) => {
  if (event.data.event === "onStop") {
    const sessionId = event.data.sessionId;
    // Analyze session, redirect, etc.
  }
});
```

## 🛠️ Development

### Prerequisites

- **Flask Minimal**: Python 3.9+, pip
- **Next.js Minimal**: Node.js 18+, npm/yarn

### Project Structure

```
tt-starter/
├── flask-minimal/          # Flask starter template
│   ├── app.py             # Main Flask app
│   ├── api/               # API routes
│   └── www/               # Frontend assets
├── nextjs-minimal/        # Next.js starter template
│   ├── app/               # Next.js App Router
│   ├── components/        # React components
│   └── package.json       # Dependencies
└── docs/                  # Documentation
```

## 📖 Learn More

- **[API Integration Guide](/docs/api-integration.md)** - Complete API reference
- **[Deployment Guide](/docs/deployment.md)** - Deploy to various platforms
- **[Best Practices](/docs/best-practices.md)** - Development best practices

## 🆘 Support

- **Documentation**: See [`docs/`](/docs) folder
- **API Playground**: [https://app.toughtongueai.com/api-playground](https://app.toughtongueai.com/api-playground)
- **Developer Portal**: [https://app.toughtongueai.com/developer](https://app.toughtongueai.com/developer)
- **Community**: [Discord](https://discord.com/invite/jfq2wVAP)
- **Support Email**: [help@getarchieai.com](mailto:help@getarchieai.com)

## 📄 License

MIT

## 📁 Repository Structure

```
tt-starter/
├── flask-minimal/          # Python Flask starter
│   ├── app.py             # Flask server
│   ├── api/               # API routes
│   ├── www/               # Frontend assets
│   ├── templates/         # HTML templates (NEW)
│   └── requirements.txt   # Python dependencies
│
├── nextjs-minimal/        # Next.js TypeScript starter
│   ├── app/               # Next.js App Router
│   │   ├── auth/         # Auth pages & context (NEW)
│   │   ├── analysis/     # Session analysis
│   │   ├── course/       # Course example
│   │   └── api/          # API routes
│   ├── components/        # React components
│   ├── lib/              # Utilities & Firebase (NEW)
│   └── package.json       # Dependencies
│
├── docs/                  # Mintlify documentation
│   ├── introduction.mdx   # Main landing (NEW)
│   ├── quickstart.mdx     # Getting started (NEW)
│   ├── use-cases/        # Product docs (NEW)
│   ├── product/          # Integrations (NEW)
│   ├── guides/           # Developer guides
│   ├── starters/         # Template docs
│   ├── api-reference/    # API documentation
│   └── mint.json         # Mintlify config (UPDATED)
│
└── 0ven/                 # Project tracking & references
    ├── agent-updates.md  # Progress tracking
    └── COMPLETION_SUMMARY.md  # Detailed summary
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## ⭐ Show Your Support

If you find these starter templates helpful, please consider:

- ⭐ Starring this repository
- 🐛 Reporting bugs
- 💡 Suggesting new features
- 📝 Improving documentation

---

**Ready to build?** Choose a template above and follow its setup guide!
