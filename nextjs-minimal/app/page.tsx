import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center rounded-full bg-indigo-100 px-4 py-1.5 text-sm font-medium text-indigo-700">
            <span className="mr-2">🚀</span>
            Built with ToughTongue AI
          </div>

          <h1 className="mb-6 text-5xl font-bold tracking-tight text-gray-900 md:text-7xl">
            Voice AI Training,{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Made Simple
            </span>
          </h1>

          <p className="mb-10 text-xl text-gray-600 md:text-2xl">
            Build production-ready voice AI agents for sales coaching, interview prep, and
            leadership development. No pipeline maintenance required.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/analysis">
              <Button size="lg" className="w-full sm:w-auto">
                Try Demo Analysis
              </Button>
            </Link>
            <Link href="/course">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                View Course Example
              </Button>
            </Link>
          </div>

          <p className="mt-6 text-sm text-gray-500">
            This is a Next.js starter template. Customize it for your use case.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            Everything You Need to Build Voice AI Apps
          </h2>
          <p className="text-lg text-gray-600">
            This starter template includes best practices for integrating ToughTongue AI
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100">
                <svg
                  className="h-6 w-6 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <CardTitle>Iframe Embedding</CardTitle>
              <CardDescription>
                Drop ToughTongue AI scenarios into your app with a single iframe. Handle lifecycle
                events seamlessly.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                <svg
                  className="h-6 w-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <CardTitle>Session Analysis</CardTitle>
              <CardDescription>
                Fetch detailed conversation analysis via API. Display insights, transcripts, and
                coaching feedback.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-pink-100">
                <svg
                  className="h-6 w-6 text-pink-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <CardTitle>Firebase Auth</CardTitle>
              <CardDescription>
                Built-in authentication with email/password and Google sign-in. Protect your routes
                with ease.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
              </div>
              <CardTitle>API Routes</CardTitle>
              <CardDescription>
                Server-side API proxies for secure token handling. Never expose your ToughTongue AI
                key to clients.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100">
                <svg
                  className="h-6 w-6 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                  />
                </svg>
              </div>
              <CardTitle>Zustand State</CardTitle>
              <CardDescription>
                Clean state management for session data, analysis results, and user preferences.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <svg
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
              </div>
              <CardTitle>Tailwind + shadcn/ui</CardTitle>
              <CardDescription>
                Beautiful, accessible UI components. Customize the design system to match your
                brand.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              How This Template Works
            </h2>
            <p className="text-lg text-gray-600">
              A complete integration example with ToughTongue AI
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white font-bold">
                1
              </div>
              <div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  Embed Voice AI Scenarios
                </h3>
                <p className="text-gray-600">
                  Use the{" "}
                  <code className="rounded bg-gray-100 px-2 py-1 text-sm">ToughTongueIframe</code>{" "}
                  component to embed any scenario from ToughTongue AI. Users practice conversations
                  right in your app.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white font-bold">
                2
              </div>
              <div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  Listen to Lifecycle Events
                </h3>
                <p className="text-gray-600">
                  The{" "}
                  <code className="rounded bg-gray-100 px-2 py-1 text-sm">
                    useSessionManagement
                  </code>{" "}
                  hook captures when sessions start, stop, and provides session IDs for analysis.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white font-bold">
                3
              </div>
              <div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">Fetch Analysis via API</h3>
                <p className="text-gray-600">
                  Server-side API routes proxy requests to ToughTongue AI, keeping your API key
                  secure. Get transcripts, coaching insights, and performance metrics.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white font-bold">
                4
              </div>
              <div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  Display Results & Track Progress
                </h3>
                <p className="text-gray-600">
                  Show users their performance, areas for improvement, and progress over time. Store
                  data in Firebase or your preferred database.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-4xl rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 p-12 text-center text-white">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Ready to Build Your Voice AI App?</h2>
          <p className="mb-8 text-lg text-indigo-100">
            Get your ToughTongue AI API key and start building in minutes
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="https://app.toughtongueai.com/developer"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Get API Key
              </Button>
            </a>
            <a href="https://docs.toughtongueai.com" target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                variant="outline"
                className="w-full border-white text-white hover:bg-white hover:text-indigo-600 sm:w-auto"
              >
                Read Documentation
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p className="mb-4">
            Built with ❤️ using{" "}
            <a
              href="https://nextjs.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline"
            >
              Next.js
            </a>
            ,{" "}
            <a
              href="https://firebase.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline"
            >
              Firebase
            </a>
            , and{" "}
            <a
              href="https://www.toughtongueai.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline"
            >
              ToughTongue AI
            </a>
          </p>
          <p className="text-sm">
            <a
              href="https://docs.toughtongueai.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-600"
            >
              Documentation
            </a>
            {" • "}
            <a
              href="https://github.com/tough-tongue/tt-starter"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-600"
            >
              GitHub
            </a>
            {" • "}
            <a
              href="https://discord.com/invite/jfq2wVAP"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-600"
            >
              Discord
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
