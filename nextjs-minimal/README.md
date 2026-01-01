# Next.js Minimal Starter

A modern, production-ready Next.js application built with TypeScript, React 19, and Tailwind CSS. This starter demonstrates advanced integration patterns with ToughTongue AI, including authentication, state management, and a full course/lesson system.

## Features

- **TypeScript**: Full type safety throughout the application
- **Next.js 15 App Router**: Modern React Server Components architecture
- **Clerk Authentication**: Built-in user authentication (optional)
- **Zustand State Management**: Lightweight, performant state management
- **API Routes**: Server-side API integration with ToughTongue AI
- **Tailwind CSS**: Utility-first styling with dark mode support
- **Course System**: Full-featured course/lesson management
- **Session Analysis**: Complete session tracking and analysis

## Quick Start

### 1. Prerequisites

- Node.js 18 or higher
- npm or yarn
- A [ToughTongue AI account](https://www.toughtongueai.com/)
- An API token from the [Developer Portal](https://app.toughtongueai.com/developer?tab=api-keys)

### 2. Installation

```bash
# Install dependencies
pnpm install
```

### 3. Configuration

Create a `.env.local` file in the `nextjs-minimal/` directory:

```env
# ToughTongue AI (Required)
TOUGH_TONGUE_API_KEY=your_api_token_here

# Clerk Authentication (Optional - remove if not using)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

**To get your ToughTongue AI API token:**

1. Go to [ToughTongue AI Developer Portal](https://app.toughtongueai.com/developer?tab=api-keys)
2. Create a new API key
3. Copy and paste it into `.env.local`

**To set up Clerk (optional):**

1. Create an account at [Clerk](https://clerk.com/)
2. Create a new application
3. Copy your publishable key and secret key
4. Add them to `.env.local`

Authentication is powered by Firebase. Sign-in and sign-up pages are located at `/auth/signin` and `/auth/signup`.

### 4. Update Scenario IDs

Update scenario IDs in your components. For example, in `app/analysis/components/ToughTongueIframe.tsx`:

```typescript
const scenarioId = "YOUR_SCENARIO_ID_HERE"; // Replace with your scenario ID
```

**To get a scenario ID:**

1. Go to [ToughTongue AI](https://www.toughtongueai.com/)
2. Create a scenario or use an existing one
3. Copy the scenario ID from the URL or scenario settings

### 5. Run the Application

```bash
pnpm dev
```

The application will start at `http://localhost:3000`.

## Integration Guide

### How It Works

This starter demonstrates a complete integration pattern:

1. **Frontend Components** embed ToughTongue AI iframes
2. **API Routes** (`app/api/tough-tongue/`) proxy API requests securely
3. **Custom Hooks** (`app/analysis/hooks/`) manage session state and events
4. **State Management** (Zustand) stores session data across components
5. **Session Analysis** uses API routes to analyze completed sessions

### Key Integration Points

#### 1. Embedding the Iframe

Use the `ToughTongueIframe` component or create your own:

```typescript
import ToughTongueIframe from "./components/ToughTongueIframe";

<ToughTongueIframe />;
```

Or embed directly:

```typescript
<iframe
  src={`https://app.toughtongueai.com/embed/${scenarioId}?bg=black`}
  width="100%"
  height="600px"
  frameBorder="0"
  allow="microphone"
/>
```

#### 2. Listening for Events

The `useSessionManagement` hook automatically listens for iframe events:

```typescript
import useSessionManagement from "./hooks/useSessionManagement";

const { sessionId, sessionData, analyzeSession } = useSessionManagement();
```

The hook handles:

- `onStart` events - Session started
- `onStop` events - Session completed, stores session ID

#### 3. Analyzing Sessions

After a session completes, analyze it:

```typescript
const { analyzeSession, sessionAnalysis } = useSessionManagement();

// After session completes
await analyzeSession();
// Results available in sessionAnalysis
```

The API route (`app/api/tough-tongue/sessions/analyze/route.ts`) securely handles the request:

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

### Customization

#### Changing Scenarios

Update scenario IDs in your components:

```typescript
// In ToughTongueIframe.tsx or your component
const scenarioId = "YOUR_NEW_SCENARIO_ID";
```

#### Styling

The project uses Tailwind CSS. Customize in:

- `tailwind.config.ts` - Tailwind configuration
- `app/globals.css` - Global styles
- Component files - Inline Tailwind classes

#### Adding New Pages

1. Create a new directory in `app/`
2. Add `page.tsx` file
3. Export default component
4. Add navigation links as needed

#### Adding New API Routes

1. Create route file in `app/api/`
2. Export HTTP method handlers (`GET`, `POST`, etc.)
3. Use `NextResponse` for responses

Example:

```typescript
// app/api/your-endpoint/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Hello" });
}
```

## Project Structure

```
nextjs-minimal/
├── app/
│   ├── page.tsx                    # Home page
│   ├── layout.tsx                  # Root layout
│   ├── analysis/
│   │   ├── page.tsx                # Analysis page
│   │   ├── hooks/
│   │   │   └── useSessionManagement.ts  # Session management hook
│   │   └── components/
│   │       ├── ToughTongueIframe.tsx
│   │       ├── SessionInformation.tsx
│   │       ├── DataDisplay.tsx
│   │       └── ErrorDisplay.tsx
│   ├── course/
│   │   ├── page.tsx                # Course page
│   │   └── CourseClient.tsx        # Course client component
│   ├── api/
│   │   └── tough-tongue/
│   │       ├── scenarios/
│   │       │   └── route.ts        # Create scenarios
│   │       └── sessions/
│   │           ├── [sessionId]/
│   │           │   └── route.ts    # Get session details
│   │           └── analyze/
│   │               └── route.ts    # Analyze session
│   ├── store/
│   │   └── sessionStore.ts         # Zustand state management
│   └── sign-in/                    # Clerk authentication
├── components/
│   ├── ui/                         # shadcn/ui components
│   ├── FeatureCard.tsx
│   ├── Header.tsx
│   └── MediaEmbed.tsx
├── middleware.ts                   # Clerk middleware
└── package.json
```

## API Routes

### POST `/api/tough-tongue/scenarios`

Create a new scenario:

```typescript
const response = await fetch("/api/tough-tongue/scenarios", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "Scenario Name",
    description: "Description",
    ai_instructions: "AI instructions...",
    user_friendly_description: "User-facing description",
  }),
});
```

### GET `/api/tough-tongue/sessions/[sessionId]`

Get session details:

```typescript
const response = await fetch(`/api/tough-tongue/sessions/${sessionId}`);
const data = await response.json();
```

### POST `/api/tough-tongue/sessions/analyze`

Analyze a session:

```typescript
const response = await fetch("/api/tough-tongue/sessions/analyze", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ session_id: sessionId }),
});
const data = await response.json();
```

## Pages

### Home Page (`app/page.tsx`)

Landing page with:

- Feature cards
- Course modules overview
- Call-to-action buttons

### Analysis Page (`app/analysis/page.tsx`)

Complete session analysis interface:

- Embedded ToughTongue AI iframe
- Session information display
- Analysis results
- Error handling

### Course Page (`app/course/page.tsx`)

Full course/lesson system:

- Lesson sidebar navigation
- Media embedding (YouTube, Loom, ToughTongue AI)
- Lesson progression
- Responsive design

## State Management

The application uses Zustand for state management (`app/store/sessionStore.ts`):

```typescript
import { useSessionStore } from "@/app/store/sessionStore";

const { sessionId, sessionData, setSessionId } = useSessionStore();
```

Available state:

- `sessionId`: Current session ID
- `sessionData`: Session event data
- `sessionDetails`: Detailed session information
- `sessionAnalysis`: Analysis results

## Deployment

### Vercel (Recommended)

Next.js is optimized for Vercel deployment:

1. Push code to GitHub

2. Import project in Vercel:

   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your repository
   - Select `nextjs-minimal` as root directory

3. Configure environment variables:

   - `TOUGH_TONGUE_API_KEY` - Your ToughTongue AI API token
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk publishable key (if using)
   - `CLERK_SECRET_KEY` - Clerk secret key (if using)

4. Deploy:
   - Vercel will automatically deploy on push
   - Or click "Deploy" in dashboard

### Other Platforms

For other platforms (Netlify, Railway, etc.):

1. Build: `pnpm build`
2. Start: `npm start`
3. Set environment variables
4. Configure Node.js version (18+)

## Environment Variables

| Variable                            | Required | Description                            |
| ----------------------------------- | -------- | -------------------------------------- |
| `TOUGH_TONGUE_API_KEY`              | Yes      | Your ToughTongue AI API token          |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | No       | Clerk publishable key (if using Clerk) |
| `CLERK_SECRET_KEY`                  | No       | Clerk secret key (if using Clerk)      |

## Authentication

The starter includes Clerk authentication. To disable:

1. Remove Clerk from `package.json` dependencies
2. Remove or modify `middleware.ts` to remove Clerk logic
3. Authentication pages are at `app/auth/signin/` and `app/auth/signup/`
4. Remove authentication checks from pages

## Troubleshooting

### Build Errors

- Ensure Node.js 18+ is installed
- Clear `.next` directory: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && pnpm install`

### API Errors

- Verify `TOUGH_TONGUE_API_KEY` is set in `.env.local`
- Check API token hasn't expired
- Review API route error handling

### Authentication Issues

- Verify Clerk keys are correct
- Check middleware configuration
- Review Clerk dashboard settings

### TypeScript Errors

- Run `pnpm build` to see all type errors
- Ensure all types are properly imported
- Check `tsconfig.json` configuration

## Dependencies

### Core

- **Next.js 15+**: React framework
- **React 19**: UI library
- **TypeScript**: Type safety

### UI & Styling

- **Tailwind CSS**: Utility-first CSS
- **shadcn/ui**: Component library
- **lucide-react**: Icons

### State & Data

- **Zustand**: State management
- **Clerk**: Authentication (optional)

## Next Steps

- Explore the [full documentation](/docs/nextjs-minimal)
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
