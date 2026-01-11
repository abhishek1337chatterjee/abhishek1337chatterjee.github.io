# Abhishek Chatterjee - Portfolio

A modern, responsive portfolio website showcasing professional experience as a Serverless Engineer and React Developer. Built with cutting-edge technologies including React 19, Vite 7, and Tailwind CSS 4, featuring an AI-powered chatbot for interactive visitor engagement.

**Live Site:** [abhishek1337chatterjee.github.io](https://abhishek1337chatterjee.github.io)

## Overview

This portfolio serves as both a professional showcase and a technical demonstration, implementing modern web development practices with a focus on performance, user experience, and SEO optimization. The site features an innovative AI chatbot integration that allows visitors to interactively learn about skills, projects, and experience.

## Key Features

- **AI-Powered ChatBot** - Interactive chatbot powered by Sanity CMS data with streaming responses and intelligent suggestions
  - **Initial Suggestions**: Fetched from `/api/suggestions` endpoint when chat opens (uses Sanity CMS data)
  - **Follow-up Suggestions**: AI-generated after each bot response, parsed via `[SUGGESTIONS]: query1 | query2 | query3` format
  - **Tab Navigation**: Press Tab to cycle through suggestions and auto-fill input (Shift+Tab for reverse)
  - **One-Click Send**: Click any suggestion chip to auto-send the query
  - **Third-Person Format**: All suggestions use "Abhishek's" format (e.g., "What are Abhishek's skills?")
  - **Word-by-Word Streaming**: Smooth 15ms delay animation for natural conversation flow
  - **Markdown Support**: Custom renderer with phone number detection, copy button, and external links
  - **Hint Text**: "Click to send • Tab to edit" displayed below suggestion chips
- **Sanity CMS Integration** - Headless CMS backend via external API (abhishek-api) for all portfolio and chatbot content
- **Responsive Design** - Fully responsive from mobile (320px) to ultra-wide displays (1920px+)
- **Performance Optimized** - Code splitting with manual chunks for vendor libraries (React, Framer Motion, AI SDK, Markdown)
- **React Compiler** - Babel plugin integration for React 19's experimental compiler
- **Smooth Animations** - Framer Motion for all transitions, entrance effects, and micro-interactions
- **Dynamic Typewriter** - Rotating role display on hero section
- **GitHub Integration** - Live stats via GitHub API with contribution calendar and language distribution
- **SEO Optimized** - Comprehensive meta tags, Open Graph, Twitter Cards, and JSON-LD structured data
- **Mobile FAB** - Floating action button with animated social links stack
- **Contact Form** - Working form with GetForm.io integration
- **Auto Deploy** - GitHub Actions CI/CD with Biome lint checks and commit SHA tracking

## Architecture Highlights

### Build Optimization
The project uses Vite's `rollupOptions` to implement strategic code splitting:
- **vendor-react**: Core React libraries isolated
- **vendor-motion**: Framer Motion (large library) separated
- **vendor-markdown**: Markdown rendering isolated
- **vendor-ai**: AI SDK components separated
- **vendor-icons**: Lucide React icons bundled

This approach ensures optimal initial load times and efficient caching strategies.

### AI ChatBot Architecture
The chatbot implementation demonstrates advanced streaming patterns with Sanity CMS integration:
- **Data Source**: All chatbot knowledge comes from Sanity CMS via external API (abhishek-api)
- **API Endpoints** (both served by abhishek-api):
  - `CHAT_API_URL` - Streaming chat responses with message history (default: `http://localhost:3000/api/chat`)
  - `SUGGESTIONS_API_URL` - Initial conversation starters (auto-derived by replacing `/api/chat` with `/api/suggestions`)
- **Smart Suggestions System**:
  - **Initial Suggestions**: Fetched from API on chat open, returns `{ suggestions: ["query1", "query2", "query3"] }`
  - **Follow-up Suggestions**: AI-generated after each bot response, embedded in streaming response as `[SUGGESTIONS]: query1 | query2 | query3`
  - **Tab Key Navigation**: Tab cycles forward through suggestions, Shift+Tab cycles backward, auto-fills input field
  - **Click to Send**: Clicking a suggestion chip auto-sends the query (no manual submit needed)
  - **Visual Feedback**: Selected suggestion highlighted with cyan border and background
  - **Hint Text**: "Click to send • Tab to edit" displayed below chips
  - **Third-Person Format**: All suggestions use "Abhishek's" (e.g., "What are Abhishek's skills?" not "your skills")
  - **Fallback**: If API fails, uses hardcoded third-person suggestions
- **Streaming Response**: Word-by-word display with 15ms delay for natural conversation flow
- **Markdown Support**: Custom ReactMarkdown renderer with phone number detection, copy button, and external link handling
- **Message History**: In-memory conversation history sent with each request for context-aware responses
- **Error Handling**: User-friendly error messages with retry capability
- **Responsive UI**: Mobile-optimized modal with smooth Framer Motion animations

### Component Architecture
The application follows a clear separation of concerns:
- **Layout Components**: Persistent UI elements (Navbar, Footer, SocialSidebar)
- **Section Components**: Page sections (Hero, About, Skills, Projects, GitHubStats, Contact)
- **UI Components**: Reusable elements (SectionDivider)
- **Specialized Components**: ChatBot with complex state management and suggestion system
- **Data Layer**: Sanity CMS integration via `src/lib/sanity.ts` with typed GROQ queries
- **Custom Hooks**: `useSanityData`, `useGitHubStats` for centralized data fetching

## Tech Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | UI Framework | 19.2.0 |
| **TypeScript** | Type Safety | 5.9.3 |
| **Vite** | Build Tool | 7.3.1 |
| **Tailwind CSS** | Styling Framework | 4.1.18 |
| **DaisyUI** | Component Library | 5.5.14 |
| **Framer Motion** | Animation Library | 12.25.0 |
| **AI SDK** | Chatbot Integration | 6.0.27 |
| **Sanity CMS** | Headless CMS | 7.14.0 |
| **React Markdown** | Markdown Rendering | 10.1.0 |
| **Lucide React** | Icon System | 0.562.0 |
| **Biome** | Linting & Formatting | 2.3.10 |

## Project Structure

```
abhishek1337chatterjee.github.io/
├── .github/
│   └── workflows/       # GitHub Actions CI/CD pipeline
├── public/
│   ├── favicon.svg      # Site favicon
│   ├── og-image.png     # OpenGraph preview image
│   ├── robots.txt       # Search engine directives
│   ├── sitemap.xml      # SEO sitemap
│   └── Abhishek_Chatterjee_Resume.pdf
├── src/
│   ├── assets/
│   │   └── images/      # Project screenshots, profile images
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx          # Navigation with mobile menu
│   │   │   ├── Footer.tsx          # Footer with commit SHA display
│   │   │   └── SocialSidebar.tsx   # Fixed sidebar with social links
│   │   ├── sections/
│   │   │   ├── Hero.tsx            # Hero section with typewriter
│   │   │   ├── About.tsx           # Professional summary
│   │   │   ├── Skills.tsx          # Technical skills grid
│   │   │   ├── Projects.tsx        # Project showcase with tabs
│   │   │   ├── GitHubStats.tsx     # GitHub activity integration
│   │   │   └── Contact.tsx         # Contact form
│   │   ├── ui/
│   │   │   └── SectionDivider.tsx  # Animated section dividers
│   │   └── ChatBot.tsx              # AI chatbot with suggestions
│   ├── hooks/
│   │   ├── useGitHubStats.ts  # GitHub API integration hook
│   │   └── useSanityData.ts   # Sanity CMS data fetching hooks
│   ├── lib/
│   │   └── sanity.ts      # Sanity client, queries, and types
│   ├── utils/
│   │   └── resume.ts      # Resume download utility
│   ├── App.tsx            # Main application component
│   ├── main.tsx           # React application entry point
│   ├── index.css          # Global styles and Tailwind imports
│   └── vite-env.d.ts      # Vite environment types
├── studio/                # Sanity Studio (CMS admin interface)
│   ├── schemas/           # Content schema definitions
│   └── sanity.config.ts   # Sanity Studio configuration
├── biome.json             # Biome linter configuration
├── index.html             # HTML entry with SEO meta tags
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration (project references)
├── tsconfig.app.json      # App-specific TypeScript config
├── tsconfig.node.json     # Node environment TypeScript config
└── vite.config.ts         # Vite configuration with React compiler
```

## Getting Started

### Prerequisites

- Node.js 24+ (LTS recommended)
- npm 10+ or yarn 1.22+
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/abhishek1337chatterjee/abhishek1337chatterjee.github.io.git

# Navigate to project directory
cd abhishek1337chatterjee.github.io

# Install dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev
```

### Development

```bash
# Run development server with hot reload
npm run dev

# Run linter
npm run lint

# Format code
npm run format

# Run both lint and format
npm run check

# Preview production build
npm run preview
```

### Build & Deploy

```bash
# Build for production
npm run build

# Output directory: dist/
```

**Automated Deployment**: Pushing to the `master` branch triggers GitHub Actions workflow:
1. Code checkout
2. Biome lint verification
3. TypeScript compilation check
4. Vite production build
5. Deployment to GitHub Pages
6. Commit SHA injection into footer

## Configuration

### Environment Variables

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `VITE_CHAT_API_URL` | No | ChatBot API endpoint (streaming chat) | `http://localhost:3000/api/chat` |

Create `.env` file in project root:
```bash
VITE_CHAT_API_URL=https://your-api-endpoint.com/api/chat
```

**Note**: The suggestions endpoint is automatically derived from `VITE_CHAT_API_URL` by replacing `/api/chat` with `/api/suggestions`.

**ChatBot API Requirements**:
- `CHAT_API_URL` must return streaming text response (not JSON) with optional `[SUGGESTIONS]: query1 | query2 | query3` at the end
- `SUGGESTIONS_API_URL` must return JSON: `{ "suggestions": ["query1", "query2", "query3"] }`
- Both endpoints use data from Sanity CMS (via abhishek-api backend)

### Customization Guide

#### Update Personal Information
1. **Sanity CMS**: Edit content via Sanity Studio at `https://your-project.sanity.studio`
   - About, Skills, Projects, Career Phases, Social Links, Site Settings
   - Run `cd studio && npm run dev` to start local Sanity Studio
2. **Sanity Project ID**: Update in `src/lib/sanity.ts` if using your own Sanity project
3. **Meta Tags**: Edit `index.html` (lines 8-106) for SEO, Open Graph, and structured data
4. **GitHub Stats**: Update username in `src/components/sections/GitHubStats.tsx` and `src/hooks/useGitHubStats.ts`
5. **Contact Form**: Update action URL in `src/components/sections/Contact.tsx`

#### Styling Customization
- **Colors**: Tailwind theme configuration in Tailwind CSS 4 format
- **Fonts**: Update `index.css` for custom font imports
- **Animations**: Framer Motion variants in component files

## Performance Features

### Code Splitting Strategy
Manual chunks defined in `vite.config.ts` optimize bundle size:
- Initial bundle: ~50KB (gzipped)
- Vendor chunks: Lazy loaded based on route/interaction
- Markdown renderer: Loaded only when chatbot opens

### Build Optimizations
- **React Compiler**: Experimental compiler reduces re-renders
- **Tree Shaking**: Unused code elimination
- **Asset Optimization**: Image compression and lazy loading
- **CSS Purging**: Tailwind CSS removes unused styles

### SEO Optimizations
- Semantic HTML structure
- Meta tags for social sharing
- JSON-LD structured data (Person, WebSite schemas)
- Sitemap and robots.txt
- Canonical URLs
- Open Graph and Twitter Card support

## Browser Support

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- iOS Safari 14+
- Chrome Android (latest)

## Scripts Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server on port 5173 |
| `npm run build` | Production build (TypeScript + Vite) |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run Biome linter on src/ |
| `npm run format` | Format code with Biome |
| `npm run check` | Lint + format with auto-fix |

## Deployment

The site is deployed to GitHub Pages via GitHub Actions. The workflow:

1. **Trigger**: Push to `master` branch
2. **Lint**: Biome checks code quality
3. **Build**: TypeScript compilation + Vite bundling
4. **Deploy**: Artifacts pushed to `gh-pages` branch
5. **Versioning**: Commit SHA displayed in footer for tracking

**Deploy URL**: [https://abhishek1337chatterjee.github.io/](https://abhishek1337chatterjee.github.io/)

## Troubleshooting

### ChatBot Not Responding
- Verify `VITE_CHAT_API_URL` environment variable (e.g., `http://localhost:3000/api/chat`)
- Ensure suggestions endpoint exists at `/api/suggestions` (or chatbot will use fallback suggestions)
- Check API endpoint CORS configuration (must allow origin from portfolio domain)
- Inspect browser console for network errors
- Verify API returns:
  - **Chat endpoint**: Plain text stream (not JSON) with optional `[SUGGESTIONS]: query1 | query2 | query3` at the end
  - **Suggestions endpoint**: JSON `{ "suggestions": ["query1", "query2", "query3"] }`
- Ensure Sanity CMS data is accessible via the API backend (abhishek-api)
- Test suggestions: Open chat and check if initial suggestions load (if not, check API logs)

### Build Failures
- Clear `node_modules` and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Verify Node.js version: `node --version` (requires 24+)
- Check TypeScript errors: `npm run build`

### GitHub Actions Deployment Fails
- Check GitHub Pages is enabled in repository settings
- Verify workflow permissions allow writing to repository
- Review Actions logs for specific error messages

## Author

Abhishek Chatterjee <abhishek1337chatterjee@gmail.com>

- GitHub: [@abhishek1337chatterjee](https://github.com/abhishek1337chatterjee)
- LinkedIn: [abhishekchatterjee-saheb1337](https://www.linkedin.com/in/abhishekchatterjee-saheb1337/)
- Twitter: [@Abhishek1337C](https://x.com/Abhishek1337C)
