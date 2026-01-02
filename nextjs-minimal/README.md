# Next.js ToughTongue AI Starter Template

A production-ready Next.js application showcasing how to integrate ToughTongue AI for voice-based training scenarios. Built with TypeScript, React 19, Next.js 15, Firebase Authentication, Supabase middleware, and Tailwind CSS.

## ✨ What This Template Includes

- **🎤 ToughTongue AI Integration**: Complete iframe embedding with session management and analysis
- **🔐 Firebase Authentication**: Email/password + Google OAuth sign-in
- **⚡ Next.js 15 App Router**: Modern React Server Components
- **🎨 Tailwind CSS + shadcn/ui**: Beautiful, customizable UI components
- **📊 Zustand State Management**: Lightweight state management for sessions and analysis
- **🛡️ Supabase Middleware**: Session handling and server-side utilities
- **🔒 Secure API Routes**: Server-side proxying to keep your API keys safe
- **📱 Responsive Design**: Works perfectly on mobile, tablet, and desktop

## 🚀 Quick Start (5 minutes)

### Prerequisites

- **Node.js 18+** ([Download](https://nodejs.org/))
- **pnpm** (Install: `npm install -g pnpm`)
- **ToughTongue AI Account** ([Sign up](https://www.toughtongueai.com/))

### Step 1: Install Dependencies

```bash
cd nextjs-minimal
pnpm install
```

### Step 2: Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Open `.env.local` and add your credentials:

```env
# Required: ToughTongue AI API Configuration
TOUGH_TONGUE_API_KEY=your_api_key_here

# Required: Firebase Configuration (for authentication)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Optional: Supabase Configuration (for future database features)
# NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Where to get your credentials:**

#### 🎤 ToughTongue AI API Key

1. Go to [ToughTongue AI Developer Portal](https://app.toughtongueai.com/developer?tab=api-keys)
2. Click "Create New API Key"
3. Copy the API key and paste into `.env.local` as `TOUGH_TONGUE_API_KEY`

#### 🔥 Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Enable **Authentication** → **Email/Password** and **Google** providers
4. Go to Project Settings → General → Your apps → Web app
5. Copy the config values into your `.env.local`

#### 📦 Supabase (Optional - for future database features)

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Create a new project
3. Go to Settings → API to get your URL and anon key

### Step 3: Update Scenario IDs

The template includes placeholder scenario IDs. Replace them with your own:

**In `app/analysis/components/ToughTongueIframe.tsx`** (around line 15):

```typescript
const scenarioId = "YOUR_SCENARIO_ID_HERE"; // ← Replace this
```

**To get a scenario ID:**

1. Go to [ToughTongue AI Dashboard](https://app.toughtongueai.com/)
2. Create a new scenario or open an existing one
3. Copy the scenario ID from the URL or scenario settings

### Step 4: Run the Development Server

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) 🎉

## 📁 Project Structure

```
nextjs-minimal/
├── app/
│   ├── page.tsx                         # Landing page
│   ├── layout.tsx                       # Root layout with AuthContext
│   ├── globals.css                      # Global styles
│   │
│   ├── auth/                            # Authentication pages
│   │   ├── AuthContext.tsx              # Firebase auth context provider
│   │   ├── signin/page.tsx              # Sign-in page
│   │   └── signup/page.tsx              # Sign-up page
│   │
│   ├── analysis/                        # Session analysis demo
│   │   ├── page.tsx                     # Analysis page
│   │   ├── hooks/
│   │   │   └── useSessionManagement.ts  # Custom hook for session lifecycle
│   │   └── components/
│   │       ├── ToughTongueIframe.tsx    # Iframe embed component
│   │       ├── SessionInformation.tsx   # Display session info
│   │       ├── DataDisplay.tsx          # Display analysis results
│   │       └── ErrorDisplay.tsx         # Error handling component
│   │
│   ├── course/                          # Course example page
│   │   ├── page.tsx                     # Course layout
│   │   └── CourseClient.tsx             # Course client component
│   │
│   ├── api/tough-tongue/                # API routes (secure server-side)
│   │   ├── scenarios/route.ts           # Create scenarios
│   │   └── sessions/
│   │       ├── [sessionId]/route.ts     # Get session details
│   │       └── analyze/route.ts         # Analyze completed session
│   │
│   └── store/
│       └── sessionStore.ts              # Zustand state management
│
├── components/
│   ├── ui/                              # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── scroll-area.tsx
│   ├── course/
│   │   └── CourseSidebar.tsx            # Course navigation sidebar
│   ├── FeatureCard.tsx
│   ├── Header.tsx
│   └── MediaEmbed.tsx                   # Embed YouTube, Loom, ToughTongue
│
├── lib/
│   ├── firebase.ts                      # Firebase initialization
│   ├── firebase/
│   │   └── firestore.ts                 # Firestore utilities
│   ├── supabase/                        # Supabase utilities
│   │   ├── client.ts                    # Browser client
│   │   ├── server.ts                    # Server client
│   │   ├── middleware.ts                # Session middleware
│   │   └── types.ts                     # TypeScript types
│   └── utils.ts                         # Utility functions
│
├── middleware.ts                        # Next.js middleware (Supabase)
├── .env.example                         # Environment variable template
├── .env.local                           # Your local config (git-ignored)
└── package.json
```

## 🎯 How It Works

### 1. **Embedding ToughTongue AI Scenarios**

The `ToughTongueIframe` component embeds scenarios into your app:

```typescript
import ToughTongueIframe from "./components/ToughTongueIframe";

<ToughTongueIframe />;
```

Or embed directly with an iframe:

```typescript
<iframe
  src={`https://app.toughtongueai.com/embed/${scenarioId}?bg=black`}
  width="100%"
  height="600px"
  allow="microphone"
/>
```

### 2. **Listening to Session Events**

The `useSessionManagement` hook automatically listens for iframe events:

```typescript
import useSessionManagement from "./hooks/useSessionManagement";

const { sessionId, sessionData, analyzeSession } = useSessionManagement();

// Hook automatically handles:
// - onStart events (session started)
// - onStop events (session completed, stores session ID)
```

### 3. **Analyzing Sessions**

After a session completes, fetch detailed analysis:

```typescript
const { analyzeSession, sessionAnalysis, loading, error } = useSessionManagement();

// Call this after session completes
await analyzeSession();

// Access results
console.log(sessionAnalysis);
```

### 4. **API Routes (Secure Server-Side Proxying)**

API routes keep your API keys secure by handling requests server-side:

**Example: `app/api/tough-tongue/sessions/analyze/route.ts`**

```typescript
export async function POST(req: Request) {
  const { session_id } = await req.json();
  const apiKey = process.env.TOUGH_TONGUE_API_KEY;

  const response = await fetch("https://api.toughtongueai.com/api/public/sessions/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ session_id }),
  });

  return NextResponse.json(await response.json());
}
```

Your frontend calls `/api/tough-tongue/sessions/analyze` instead of the ToughTongue API directly.

### 5. **State Management with Zustand**

The `sessionStore` manages session state across components:

```typescript
import { useSessionStore } from "@/app/store/sessionStore";

const { sessionId, sessionData, sessionAnalysis, setSessionId } = useSessionStore();
```

## 🔐 Authentication Flow

The template uses **Firebase Authentication** with email/password and Google OAuth:

### Sign Up / Sign In

- **Sign Up**: `/auth/signup`
- **Sign In**: `/auth/signin`

### Using Auth in Components

```typescript
"use client";
import { useAuth } from "@/app/auth/AuthContext";

function MyComponent() {
  const { user, signOut } = useAuth();

  if (!user) {
    return <p>Please sign in</p>;
  }

  return (
    <div>
      <p>Welcome, {user.email}</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

### Protecting Routes

Add authentication checks in your page components:

```typescript
"use client";
import { useAuth } from "@/app/auth/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin");
    }
  }, [user, loading, router]);

  if (loading) return <p>Loading...</p>;
  if (!user) return null;

  return <div>Protected content</div>;
}
```

## 📡 API Routes Reference

### `POST /api/tough-tongue/scenarios`

Create a new ToughTongue AI scenario:

```typescript
const response = await fetch("/api/tough-tongue/scenarios", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "Customer Support Training",
    description: "Practice handling customer complaints",
    ai_instructions: "You are a frustrated customer...",
    user_friendly_description: "Practice de-escalation techniques",
  }),
});

const { scenario_id } = await response.json();
```

### `GET /api/tough-tongue/sessions/[sessionId]`

Get detailed session information:

```typescript
const response = await fetch(`/api/tough-tongue/sessions/${sessionId}`);
const sessionData = await response.json();
```

### `POST /api/tough-tongue/sessions/analyze`

Analyze a completed session:

```typescript
const response = await fetch("/api/tough-tongue/sessions/analyze", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ session_id: sessionId }),
});

const analysis = await response.json();
```

## 🎨 Customization

### Changing Scenarios

Update scenario IDs in your components:

```typescript
// In ToughTongueIframe.tsx or any component
const scenarioId = "your-new-scenario-id";
```

### Styling with Tailwind

The project uses Tailwind CSS. Customize:

- **`tailwind.config.ts`**: Theme configuration
- **`app/globals.css`**: Global styles
- **Component files**: Use Tailwind classes directly

### Adding New Pages

1. Create a directory in `app/`
2. Add `page.tsx`
3. Export a default component

```typescript
// app/dashboard/page.tsx
export default function Dashboard() {
  return <div>My Dashboard</div>;
}
```

### Adding New API Routes

1. Create route file in `app/api/`
2. Export HTTP method handlers

```typescript
// app/api/my-endpoint/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Hello!" });
}

export async function POST(req: Request) {
  const body = await req.json();
  return NextResponse.json({ received: body });
}
```

## 🚢 Deployment

### Deploy to Vercel (Recommended)

Next.js is optimized for Vercel:

1. **Push to GitHub**

2. **Import in Vercel:**

   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your repository
   - **Important**: Set root directory to `nextjs-minimal`

3. **Add Environment Variables:**

   - Go to Project Settings → Environment Variables
   - Add all variables from your `.env.local`

4. **Deploy:**
   - Click "Deploy"
   - Vercel will auto-deploy on future git pushes

### Deploy to Other Platforms

For Netlify, Railway, Render, etc.:

1. Build command: `pnpm build`
2. Start command: `pnpm start`
3. Node version: 18+
4. Root directory: `nextjs-minimal`
5. Add environment variables in platform settings

## 🛠️ Troubleshooting

### ❌ `ERR_PNPM_NO_MATCHING_VERSION`

**Solution**: The dependency versions have been updated. Run:

```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### ❌ Firebase Configuration Errors

**Error**: `Firebase: Error (auth/invalid-api-key)`

**Solution**:

1. Double-check all Firebase config values in `.env.local`
2. Ensure you've enabled Email/Password and Google authentication in Firebase Console
3. Restart dev server: `pnpm dev`

### ❌ ToughTongue AI Session Not Starting

**Possible causes:**

1. Invalid API key in `.env.local`
2. Scenario ID not configured (still says `YOUR_SCENARIO_ID_HERE`)
3. Browser blocking microphone permission

**Solution**:

1. Verify API keys in [Developer Portal](https://app.toughtongueai.com/developer)
2. Update scenario ID in `app/analysis/components/ToughTongueIframe.tsx`
3. Allow microphone access when prompted

### ❌ TypeScript Errors

Run type checking:

```bash
pnpm build
```

Common fixes:

- Ensure all imports are correct
- Check `tsconfig.json` paths
- Restart TypeScript server in your IDE

### ❌ Module Not Found Errors

Clear Next.js cache:

```bash
rm -rf .next
pnpm dev
```

## 📚 Learn More

- **[ToughTongue AI Documentation](https://docs.toughtongueai.com)**
- **[API Reference](https://docs.toughtongueai.com/api)**
- **[Next.js Documentation](https://nextjs.org/docs)**
- **[Firebase Documentation](https://firebase.google.com/docs)**
- **[Tailwind CSS](https://tailwindcss.com/docs)**
- **[shadcn/ui](https://ui.shadcn.com)**

## 💬 Support & Community

- **[Developer Community Discord](https://discord.com/invite/jfq2wVAP)**
- **[API Playground](https://app.toughtongueai.com/api-playground)**
- **[Email Support](mailto:help@getarchieai.com)**
- **[GitHub Issues](https://github.com/tough-tongue/tt-starter/issues)**

## 📝 License

MIT License - feel free to use this template for any project!

---

Built with ❤️ by the ToughTongue AI team
