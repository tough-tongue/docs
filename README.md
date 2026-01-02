# ToughTongue AI Documentation & Starter Templates

**The Lovable for Voice AI Agents** - Build production-ready voice AI agents without low-level pipeline maintenance.

This repository contains:

1. 📚 **Comprehensive Documentation** - Product and Developer docs for ToughTongue AI
2. 🚀 **Production-Ready Starter Templates** - Flask and Next.js templates with Firebase auth

---

## 🎯 About ToughTongue AI

ToughTongue AI is a voice AI agent platform that enables you to build training and coaching applications without dealing with the complexity of WebSocket connections, STT/TTS pipelines, audio streaming, or inference infrastructure.

**What Makes It Different:**

- **Voice AI Agents, Not Chatbots** - Multimodal understanding (voice, facial expressions, body language)
- **Agentic with Real Tools** - Generate images, navigate slides, sketch diagrams
- **Complete Workflow** - Prepare → Practice → Debrief with AI feedback
- **No Infrastructure Maintenance** - Focus on your product, not the pipeline

---

## 📚 Documentation

This repository powers the complete documentation site for ToughTongue AI, organized into **Product** and **Developer** sections.

### Documentation Structure

```
docs/
├── introduction.mdx          # Main landing page with "Lovable for Voice AI" positioning
├── quickstart.mdx           # Getting started guide
├── use-cases/              # Product documentation (SaaS users, no code)
│   ├── sales-coaching.mdx
│   ├── enterprise-account.mdx
│   └── ...
├── product/                # Product integrations
│   ├── google-meet-integration.mdx
│   └── phone-integration.mdx
├── guides/                 # Developer guides
│   ├── embedding.mdx
│   ├── api-integration.mdx
│   ├── firebase-auth.mdx
│   └── webhooks.mdx
├── starters/              # Starter template documentation
│   ├── overview.mdx
│   ├── flask.mdx
│   └── nextjs.mdx
├── api-reference/         # API documentation
│   ├── overview.mdx
│   ├── scenarios.mdx
│   ├── sessions.mdx
│   └── analytics.mdx
├── concepts/              # Core concepts
│   ├── scenarios.mdx
│   ├── sessions.mdx
│   └── authentication.mdx
└── mint.json             # Mintlify configuration
```

### View the Documentation

The documentation is built with [Mintlify](https://mintlify.com) and organized into:

1. **Product Documentation** - For SaaS users (no coding required)
   - Use cases (sales coaching, enterprise, interview prep)
   - Product integrations (Google Meet, Phone)
2. **Developer Documentation** - For API/SDK integration
   - Core concepts (scenarios, sessions, authentication)
   - Integration guides (embedding, webhooks, API)
   - Starter templates (Flask, Next.js)
   - Complete API reference

**To run docs locally:**

```bash
cd docs
pnpm install
pnpm dev
```

---

## 🚀 Starter Templates

Production-ready templates to jumpstart your ToughTongue AI integration.

### Flask Minimal (`flask-minimal/`)

**Tech Stack:**

- Python 3.9+
- Flask 3.1.0+
- Preact (no build tools)
- Vercel-ready

**Features:**

- ✅ Beautiful landing page
- ✅ Iframe embedding example
- ✅ Session management
- ✅ Server-side API proxy
- ✅ Session analysis

**Quick Start:**

```bash
cd flask-minimal
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
# Create .env with TTAI_TOKEN=your_api_token
python app.py
```

📖 **[Full Flask Guide](flask-minimal/README.md)** | **[Documentation](docs/starters/flask.mdx)**

---

### Next.js Minimal (`nextjs-minimal/`)

**Tech Stack:**

- Next.js 16.1.1 (App Router)
- TypeScript
- React 19
- Tailwind CSS
- Firebase Authentication
- Zustand (state management)

**Features:**

- ✅ Modern landing page with hero & features
- ✅ Firebase authentication (sign-in/sign-up/Google)
- ✅ Protected routes with auth middleware
- ✅ Iframe embedding with event handling
- ✅ Session analysis with API integration
- ✅ Responsive, production-ready UI

**Quick Start:**

```bash
cd nextjs-minimal
pnpm install
# Create .env.local with:
# TOUGH_TONGUE_API_KEY=your_api_token
# NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
# ... (see .env.example)
pnpm dev
```

📖 **[Full Next.js Guide](nextjs-minimal/README.md)** | **[Documentation](docs/starters/nextjs.mdx)**

---

## 🔑 Getting Your API Token

1. Sign up at [ToughTongue AI](https://app.toughtongueai.com)
2. Navigate to the [Developer Portal](https://app.toughtongueai.com/developer?tab=api-keys)
3. Create a new API key
4. Copy and securely store your token

---

## 🎯 What Can You Build?

ToughTongue AI powers voice AI agents across industries:

- **Sales & GTM** - Cold call simulators, objection handling, discovery call coaching
- **Leadership Development** - Performance reviews, difficult conversations, feedback delivery
- **Job Interview Prep** - Technical interviews, behavioral practice, case studies
- **Customer Service** - De-escalation training, complaint handling, empathy coaching
- **Education** - Teacher training, student communication, classroom management
- **Healthcare** - Patient communication, bedside manner, delivering difficult news

---

## 📦 Repository Structure

```
/
├── docs/                      # Mintlify documentation site
│   ├── introduction.mdx       # "Lovable for Voice AI Agents" landing
│   ├── quickstart.mdx         # Getting started
│   ├── use-cases/            # Product documentation
│   ├── product/              # Product integrations
│   ├── guides/               # Developer guides (including firebase-auth.mdx)
│   ├── starters/             # Starter template docs
│   ├── api-reference/        # Complete API reference
│   ├── concepts/             # Core concepts
│   └── mint.json             # Mintlify config
│
├── flask-minimal/            # Flask starter template
│   ├── app.py                # Flask server
│   ├── api/                  # API routes
│   ├── templates/            # Landing page HTML
│   ├── www/                  # Frontend assets (Preact)
│   └── requirements.txt      # Python dependencies
│
├── nextjs-minimal/           # Next.js starter template
│   ├── app/
│   │   ├── auth/            # Firebase auth (AuthContext, signin, signup)
│   │   ├── analysis/        # Session analysis page
│   │   ├── course/          # Course example
│   │   ├── page.tsx         # Landing page
│   │   └── api/             # API routes
│   ├── components/           # React components
│   ├── lib/
│   │   └── firebase.ts      # Firebase config
│   └── package.json          # Dependencies (Next.js 16.1.1, Firebase 12.7.0)
│
└── 0ven/                     # Project tracking (gitignored)
    ├── tt-ai/                # Original repo reference
    ├── specs/spec.md         # Project specification
    └── ai-docs/agent-updates.md  # Progress tracking
```

---

## 🏗️ Integration Overview

Both starters demonstrate complete integration patterns:

1. **Iframe Embedding** - Embed ToughTongue AI conversations in your app
2. **Event Handling** - Listen for session start/stop events
3. **Session Management** - Track and store session data
4. **API Integration** - Analyze sessions and retrieve insights
5. **Authentication** - Firebase auth with sign-in/sign-up/Google
6. **Secure Backend** - Server-side API proxying for security

---

## 📋 Template Comparison

| Feature          | Flask Minimal | Next.js Minimal         |
| ---------------- | ------------- | ----------------------- |
| Language         | Python        | TypeScript              |
| Framework        | Flask 3.1     | Next.js 16.1            |
| Frontend         | Preact        | React 19                |
| Build Tools      | None          | Next.js                 |
| Type Safety      | No            | Yes                     |
| Authentication   | None          | Firebase (email+Google) |
| State Management | Preact Hooks  | Zustand                 |
| Styling          | CSS           | Tailwind CSS            |
| Deployment       | Vercel/Any    | Vercel (optimized)      |
| Best For         | Simple apps   | Production apps         |

---

## 🚢 Deployment

Both templates are ready for deployment:

- **Vercel** (Recommended) - Pre-configured `vercel.json` for both
- **Other Platforms** - See [Deployment Guide](docs/guides/deployment.md)

**Environment Variables:**

- Flask: `TTAI_TOKEN`
- Next.js: `TOUGH_TONGUE_API_KEY`, Firebase config vars

---

## 📖 Quick Links

### For Product Users

- **[App](https://app.toughtongueai.com)** - Start using the platform (no code)
- **[Scenario Library](https://app.toughtongueai.com/library)** - 100+ pre-built agents
- **[Use Cases](docs/use-cases/)** - Product documentation

### For Developers

- **[API Playground](https://app.toughtongueai.com/api-playground)** - Test endpoints
- **[Developer Portal](https://app.toughtongueai.com/developer)** - Manage API keys
- **[API Reference](docs/api-reference/overview.mdx)** - Complete API docs
- **[Integration Guides](docs/guides/)** - Embedding, webhooks, Firebase auth
- **[Starter Templates](docs/starters/)** - Flask & Next.js documentation

### Community

- **[Discord](https://discord.com/invite/jfq2wVAP)** - Get help from other builders
- **[GitHub](https://github.com/tough-tongue/tt-starter)** - This repository

---

## 🛠️ Development

### Prerequisites

- **Flask Starter**: Python 3.9+, pip
- **Next.js Starter**: Node.js 18+, pnpm
- **Documentation**: Node.js 18+, pnpm, Mintlify CLI

### Local Development

**Run documentation site:**

```bash
cd docs
pnpm install
pnpm dev
# Opens at http://localhost:3000
```

**Run Flask starter:**

```bash
cd flask-minimal
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
# Opens at http://localhost:5001
```

**Run Next.js starter:**

```bash
cd nextjs-minimal
pnpm install
pnpm dev
# Opens at http://localhost:3000
```

---

## ✅ Project Status

**Documentation:** ✅ Complete

- Product documentation imported and enhanced
- Developer documentation comprehensive
- "Lovable for Voice AI Agents" branding applied throughout
- Mintlify configuration complete

**Starter Templates:** ✅ Complete

- Flask: Landing page + API integration
- Next.js: Landing page + Firebase auth + Protected routes
- Both: Production-ready with modern UI

**Security:** ✅ Up-to-date

- Next.js: 16.1.1 (CVE-2025-66478 fixed)
- Firebase: 12.7.0
- Flask: 3.1.0

See [`0ven/ai-docs/agent-updates.md`](0ven/ai-docs/agent-updates.md) for detailed progress tracking.

---

## 🎓 What is "Lovable for Voice AI Agents"?

Just like [Lovable](https://lovable.dev) makes full-stack development accessible, ToughTongue AI makes voice AI agent development accessible.

**Build without low-level pipeline maintenance:**

- ❌ No managing WebSocket connections
- ❌ No configuring STT/TTS pipelines
- ❌ No handling audio streaming logic
- ❌ No managing inference infrastructure

✅ **Just describe what you want your agent to do, and we handle the rest.**

---

## 🤝 Contributing

Contributions are welcome! Please feel free to:

- 🐛 Report bugs via GitHub Issues
- 💡 Suggest new features
- 📝 Improve documentation
- 🔧 Submit Pull Requests

---

## 📄 License

MIT - See individual starter template directories for details

---

## 🆘 Support

- **Documentation**: Browse the [`docs/`](docs/) directory
- **API Issues**: [Developer Portal](https://app.toughtongueai.com/developer)
- **Community Help**: [Discord](https://discord.com/invite/jfq2wVAP)
- **Email Support**: [help@getarchieai.com](mailto:help@getarchieai.com)

---

**Ready to build?**

🚀 **For Product Users:** [Start with the App →](https://app.toughtongueai.com)

💻 **For Developers:** [Read the Quickstart →](docs/quickstart.mdx) or [Choose a Starter Template ↑](#-starter-templates)
