# ToughTongue AI Docs & Starter Templates

Official documentation and starter templates for [ToughTongue AI](https://toughtongueai.com) — the voice AI platform for building high-stakes conversation training applications.

## What's Inside

- **`docs/`** — Complete documentation site built with Mintlify
- **`nextjs-minimal/`** — Production-ready Next.js starter with Firebase auth
- **`flask-minimal/`** — Simple Flask starter with iframe embedding

## 📚 Documentation

> **📖 For detailed documentation developer guide, see [docs/README.md](docs/README.md)**

### Run Locally

```bash
cd docs
pnpm install
pnpm dev
```

Docs will be available at `http://localhost:3000`

### Structure

- **Get Started** — Introduction and quickstart
- **Product Documentation** — Features, enterprise, integrations
- **Developer Documentation** — API, iframe embedding, guides
- **API Reference** — Interactive API playground with OpenAPI spec
- **Starter Templates** — Next.js and Flask guides

### Configuration

Documentation is configured via `mint.json` (Mintlify format). Navigation, branding, and API settings are all in this file.

### Deploy

The documentation is designed to be deployed to Mintlify's platform. See [Mintlify documentation](https://mintlify.com/docs) for deployment instructions.

## 🚀 Next.js Starter

Production-ready starter template with Firebase authentication.

### Quick Start

```bash
cd nextjs-minimal
pnpm install

# Copy and configure environment variables
cp .env.example .env.local
# Add your TOUGH_TONGUE_API_KEY and Firebase config

pnpm dev
```

### What's Included

- **Landing Page** — Hero section with feature cards
- **Firebase Auth** — Email/password and Google sign-in
- **Protected Routes** — Middleware for authenticated pages
- **Iframe Embedding** — ToughTongue AI conversation widget
- **Session Analysis** — Post-conversation analytics
- **Course Example** — Multi-scenario learning path

### Tech Stack

- Next.js 16.1+ (App Router)
- TypeScript + React 19
- Firebase Authentication
- Tailwind CSS
- Zustand (state management)

### Environment Variables

Create `.env.local` with:

```env
TOUGH_TONGUE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Get your API key from the [Developer Portal](https://app.toughtongueai.com/developer?tab=api-keys).

## 🐍 Flask Starter

Minimal Python starter for quick prototyping.

### Quick Start

```bash
cd flask-minimal
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env with your API key
echo "TTAI_TOKEN=your_api_key" > .env

python app.py
```

Server runs at `http://localhost:5001`

### What's Included

- Landing page with iframe embedding
- Server-side API proxy for security
- Session management and analysis
- Vanilla JavaScript (Preact, no build tools)

## 📖 Repository Structure

```
/
├── docs/                           # Mintlify documentation
│   ├── getting-started/           # Introduction & quickstart
│   ├── product/                   # Product features
│   ├── developer/                 # API & integration guides
│   ├── guides/                    # Webhooks, troubleshooting
│   ├── starters/                  # Starter template docs
│   ├── api-reference/             # OpenAPI spec & endpoints
│   ├── use-cases/                 # Sales, courses, etc.
│   └── docs.json                  # Mintlify configuration
│
├── nextjs-minimal/                # Next.js starter
│   ├── app/                       # App router pages
│   │   ├── auth/                  # Firebase auth context & pages
│   │   ├── analysis/              # Session analysis page
│   │   ├── course/                # Multi-scenario course example
│   │   └── api/                   # API routes (proxy)
│   ├── components/                # React components
│   ├── lib/                       # Firebase & utilities
│   └── package.json
│
├── flask-minimal/                 # Flask starter
│   ├── api/                       # API routes
│   ├── templates/                 # HTML templates
│   ├── www/                       # Frontend assets
│   ├── app.py                     # Flask server
│   └── requirements.txt
│
└── 0ven/                          # Internal docs (gitignored)
```

## 🔑 Getting Your API Key

1. Sign up at [app.toughtongueai.com](https://app.toughtongueai.com)
2. Go to [Developer Portal](https://app.toughtongueai.com/developer?tab=api-keys)
3. Create a new API key
4. Copy and securely store your token

## 🚢 Deployment

### Documentation

Deploy to Mintlify's platform for best results. Alternatively, use Vercel with the included `vercel.json`.

### Starter Templates

Both templates include `vercel.json` for one-click Vercel deployment:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd nextjs-minimal  # or flask-minimal
vercel
```

Remember to add environment variables in your deployment platform.

## 📋 Contributing

See `.cursor/rules/nextjs-starter.mdc` for development guidelines specific to the Next.js starter.

For documentation contributions:

- Follow Mintlify MDX conventions
- Keep line lengths under ~100 characters
- Use relative paths for API references
- Test locally before submitting

## 📞 Support

- **Documentation:** [docs.toughtongueai.com](https://docs.toughtongueai.com)
- **Discord:** [Join our community](https://discord.com/invite/NfTPT3HsSj)
- **Developer Portal:** [app.toughtongueai.com/developer](https://app.toughtongueai.com/developer/)

## 📄 License

MIT — See individual directories for details.

---

**Ready to build?** Start with the [quickstart guide](docs/getting-started/quickstart.mdx) or dive into a starter template above.
