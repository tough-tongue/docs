# ToughTongue AI Documentation

Comprehensive developer documentation for building with ToughTongue AI, built with modern documentation tooling.

## 🚀 Running Locally

### Prerequisites

- Node.js 18 or higher
- pnpm (recommended) - `pnpm install -g pnpm`

### Setup

1. Install dependencies:

```bash
pnpm install
```

2. Start the development server:

```bash
pnpm dev
```

The documentation will be available at **http://localhost:3000** with hot reload for instant preview of changes.

## 📚 Documentation Structure

```
docs/
├── introduction.mdx          # Welcome & platform overview
├── quickstart.mdx           # 5-minute getting started guide
│
├── concepts/                # Core concepts
│   ├── scenarios.mdx        # Understanding scenarios
│   ├── sessions.mdx         # Sessions & analysis
│   └── authentication.mdx   # Auth & security
│
├── guides/                  # Implementation guides
│   ├── embedding.mdx        # Iframe embedding
│   ├── api-integration.mdx  # API patterns
│   ├── webhooks.mdx         # Webhook integration
│   └── meeting-bots.mdx     # Meeting bot integration
│
├── starters/                # Starter templates
│   ├── overview.mdx         # Templates comparison
│   ├── flask.mdx            # Flask starter guide
│   └── nextjs.mdx           # Next.js starter guide
│
├── api-reference/           # API documentation
│   ├── overview.mdx         # API introduction
│   ├── scenarios.mdx        # Scenarios endpoints
│   ├── sessions.mdx         # Sessions endpoints
│   ├── analytics.mdx        # Analytics endpoints
│   └── openapi.json         # OpenAPI 3.1 spec
│
├── examples/                # Real-world examples
│   ├── interview-prep.mdx   # Interview practice app
│   ├── sales-training.mdx   # Sales training app
│   └── customer-service.mdx # Support training app
│
├── troubleshooting.mdx      # Common issues & solutions
├── mint.json                # Documentation configuration
└── package.json             # Dependencies
```

## 📝 Adding New Pages

1. Create a new `.mdx` file in the appropriate directory

2. Add frontmatter at the top:

```yaml
---
title: Your Page Title
description: Brief description for SEO and navigation
---
```

3. Write your content using Markdown and MDX components

4. Add the page to `mint.json` navigation:

```json
{
  "group": "Your Group",
  "pages": ["path/to/your-page"]
}
```

5. The dev server will auto-reload with your changes

## 🧩 Available Components

### Cards

```mdx
<Card title="Title" icon="icon-name" href="/link">
  Description
</Card>
```

### Code Groups

````mdx
<CodeGroup>
```javascript
// JavaScript code
```

```python
# Python code
```

</CodeGroup>
````

### Accordions

```mdx
<AccordionGroup>
  <Accordion title="Question">Answer</Accordion>
</AccordionGroup>
```

### Steps

```mdx
<Steps>
  <Step title="First Step">Content</Step>
  <Step title="Second Step">Content</Step>
</Steps>
```

### Tabs

```mdx
<Tabs>
  <Tab title="JavaScript">JavaScript content</Tab>
  <Tab title="Python">Python content</Tab>
</Tabs>
```

### Callouts

```mdx
<Note>This is a note</Note>
<Tip>This is a tip</Tip>
<Warning>This is a warning</Warning>
<Info>This is an info box</Info>
```

## 🚀 Publishing

### Quick Deploy

1. Push your code to GitHub
2. Go to [Mintlify Dashboard](https://dashboard.mintlify.com/)
3. Connect your repository
4. Select `docs/` as the documentation directory
5. Deploy - auto-deploys on every push

### Self-Hosting

1. Build the documentation:

```bash
pnpm build
```

2. Deploy the generated files to your hosting provider

## 🎨 Customization

### Branding

Update `mint.json`:

```json
{
  "name": "Your Brand",
  "logo": {
    "light": "/path/to/light-logo.png",
    "dark": "/path/to/dark-logo.png"
  },
  "colors": {
    "primary": "#your-color",
    "light": "#your-light-color",
    "dark": "#your-dark-color"
  }
}
```

### Navigation

Modify the `navigation` array in `mint.json` to reorganize pages and groups.

### OpenAPI Integration

The API reference automatically generates from `api-reference/openapi.json`. Update the OpenAPI spec to reflect API changes.

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 pnpm dev
```

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules .mintlify
pnpm install
```

### Content Not Updating

- Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
- Clear `.mintlify` cache directory
- Restart the dev server

## 📊 Documentation Statistics

- **29 comprehensive pages** across 8 major sections
- **Interactive examples** with code snippets in multiple languages
- **Complete API reference** with OpenAPI 3.1 specification
- **Real-world examples** for 3 different use cases
- **Fully responsive** with dark mode support

## 🎯 Content Coverage

### Topics Covered:

- ✅ Platform overview and use cases
- ✅ Quick start (5 minutes to first conversation)
- ✅ Scenario creation and management
- ✅ Session tracking and analysis
- ✅ Authentication and security
- ✅ Iframe embedding (all variants)
- ✅ API integration patterns
- ✅ Webhooks and real-time events
- ✅ Meeting bot integration
- ✅ Starter templates (Flask & Next.js)
- ✅ Complete API reference
- ✅ Real-world examples
- ✅ Troubleshooting guide
- ✅ Best practices throughout

### Languages/Frameworks Covered:

- ✅ JavaScript/TypeScript
- ✅ Python
- ✅ React/Next.js
- ✅ Flask
- ✅ cURL (for testing)
- ✅ HTML/CSS

## 🎓 Learning Paths

The documentation supports multiple learning paths:

1. **Quick Start Path** (5 minutes)

   - Introduction → Quickstart → First embed

2. **Developer Path** (30 minutes)

   - Introduction → Quickstart → Concepts → Embedding Guide

3. **Integration Path** (1-2 hours)

   - Quickstart → Concepts → Guides → Starter Templates

4. **Reference Path** (ongoing)
   - API Reference → OpenAPI Spec → Examples

## 🤝 Contributing

To contribute to the documentation:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally with `pnpm dev`
5. Submit a pull request

## 📚 Resources

- [Mintlify Documentation](https://mintlify.com/docs)
- [OpenAPI Integration](https://mintlify.com/docs/api-playground/openapi)
- [Deployment Guide](https://mintlify.com/docs/settings/deployment)

## 📄 License

MIT
